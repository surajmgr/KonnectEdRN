import { z, ZodTypeAny } from "zod";
import { authClient } from "../auth/authClient";

interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    total: number;
    limit: number;
  };
}

const standardResponseSchema = <O extends ZodTypeAny>(outputSchema?: O) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: outputSchema ? outputSchema : z.any(),
    pagination: z
      .object({
        page: z.number(),
        total: z.number(),
        limit: z.number(),
      })
      .optional(),
  });

interface ApiHandlerOptions<
  I extends ZodTypeAny,
  O extends ZodTypeAny,
  W extends "standard" | "non-standard" = "non-standard",
  Paginated extends boolean = false
> {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  input?: I;
  output?: O;
  wrapper?: W;
  isPaginated?: Paginated; // Type-checked against Paginated generic
  transform?: (data: z.infer<O>) => z.infer<O>;
  auth?: boolean;
  baseUrl?: string;
}

interface ApiCallParams<I extends ZodTypeAny> { // Added constraint here for clarity
  input?: z.infer<I>;
  token?: string;
  query?: Record<string, string | number>;
}

export function createApiHandler<
  I extends ZodTypeAny,
  O extends ZodTypeAny,
  W extends "standard" | "non-standard" = "non-standard",
  Paginated extends boolean = false
>(
  options: ApiHandlerOptions<I, O, W, Paginated>
) {
  // type Input = z.infer<I>;
  type RawOutput = z.infer<O>;
  type Output = W extends "standard"
    ? Paginated extends true
    ? StandardResponse<RawOutput>
    : RawOutput
    : RawOutput;

  return async ({
    input,
    token,
    query,
  }: ApiCallParams<I>): Promise<Output> => {
    const {
      method,
      path,
      input: inputSchema,
      output: outputSchema,
      wrapper = "standard" as W,
      isPaginated = false as Paginated, // Default aligns with generic
      transform,
      auth,
      baseUrl,
    } = options;

    const API_BASE = baseUrl ?? process.env.EXPO_PUBLIC_API_URL ?? "";

    if (inputSchema && input) {
      const parsed = inputSchema.safeParse(input);
      if (!parsed.success) {
        throw new Error("Invalid input: " + parsed.error.message);
      }
    }

    const url = new URL(`${API_BASE}${path}`);
    if (query) {
      Object.entries(query).forEach(([key, val]) =>
        url.searchParams.append(key, String(val))
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (auth && token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (auth) {
      const cookie = authClient.getCookie();
      if (cookie) {
        headers.Cookie = cookie;
      }
    }

    const res = await fetch(url.toString(), {
      method,
      headers,
      credentials: (auth && token) ? "include" : "omit",
      body: method !== "GET" ? JSON.stringify(input ?? {}) : undefined,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} – ${res.statusText}`);
    }

    const json = await res.json();

    let validatedData: Output;

    if (wrapper === "standard") {
      const stdSchema = standardResponseSchema(outputSchema);
      const parsed = stdSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error(parsed.error.message || "Invalid server response");
      }
      if (!parsed.data.success) {
        throw new Error(`API error: ${parsed.data.message}`);
      }

      validatedData = (isPaginated
        ? parsed.data
        : parsed.data.data) as Output;
    } else {
      if (outputSchema) {
        const parsed = outputSchema.safeParse(json);
        if (!parsed.success) {
          throw new Error("Invalid server response: " + parsed.error.message);
        }
        validatedData = parsed.data as Output;
      } else {
        validatedData = json as Output;
      }
    }

    if (transform && "data" in validatedData) {
      const toTransform = "data" in validatedData ? validatedData.data : validatedData;
      const transformed = transform(toTransform as RawOutput);
      validatedData = (isPaginated
        ? { ...validatedData, data: transformed }
        : transformed) as Output;
    } else if (transform) {
      validatedData = transform(validatedData as RawOutput) as Output;
    }

    return validatedData;
  };
}
