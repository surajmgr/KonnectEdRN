import { createApiHandler } from "@/lib/utils/handlers";
import { apiEndpoints } from "../apiEndpoints";
import { checkHasPasswordResponseSchema, checkHasPasswordSchema, setPasswordSchema } from "@/lib/schema/auth";

export const checkHasPassword = createApiHandler({
  method: "POST",
  path: apiEndpoints.server.checkHasPassword,
  input: checkHasPasswordSchema,
  output: checkHasPasswordResponseSchema,
})

export const setPassword = createApiHandler({
  method: "POST",
  path: apiEndpoints.server.setPassword,
  input: setPasswordSchema,
  auth: true
})
