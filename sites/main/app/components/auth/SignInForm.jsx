"use client";
import { useActionState } from "react";
import { signInWithEmail } from "@/lib/actions";
import { Alert, Button, TextInput } from "@mantine/core";

export default function SignInForm() {
  const [error, action, pending] = useActionState(signInWithEmail);

  return (
    <>
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      <form action={action}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="text-dark mb-3 block text-sm dark:text-white"
          >
            {" "}
            Email{" "}
          </label>
          <TextInput
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            autoComplete="email"
            size="lg"
            required
          />
        </div>
        <div className="mb-8">
          <label
            htmlFor="password"
            className="text-dark mb-3 block text-sm dark:text-white"
          >
            {" "}
            Your Password{" "}
          </label>
          <TextInput
            id="password"
            name="password"
            placeholder="Enter your Password"
            type="password"
            autoComplete="current-password"
            minLength={8}
            size="lg"
            required
          />
        </div>
        <div className="mb-6">
          <Button type="submit" size="lg" loading={pending} fullWidth>
            Sign in
          </Button>
        </div>
      </form>
    </>
  );
}
