import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth/authClient";
import { useState } from "react";
import { View } from "react-native";

export default function SignIn() {
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Signing in...");
    await authClient.signIn.email({
      email,
      password,
      fetchOptions: {
        onSuccess: () => {
          console.log("Signed in.");
        },
        onError: (e) => {
          console.log("Sign in failed.");
          console.log(e);
        }
      }
    })
  };

  const handleSocialSignIn = async () => {
    console.log("Signing in...");
    await authClient.signIn.social({
      provider: "google",
      fetchOptions: {
        onSuccess: () => {
          console.log("Signed in.");
        },
        onError: (e) => {
          console.log("Sign in failed.");
          console.log(e);
        }
      },
      callbackURL: "/search",
    })
  };

  return (
    <View>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button onPress={handleLogin} variant="default">
        <Text>Sign In</Text>
      </Button>

      <Button onPress={() => authClient.signOut()} variant="destructive">
        <Text>Sign Out</Text>
      </Button>

      <Button onPress={handleSocialSignIn} variant="default">
        <Text>Sign In with Google</Text>
      </Button>

      <Text>Session: {JSON.stringify(session)}</Text>
    </View>
  );
}
