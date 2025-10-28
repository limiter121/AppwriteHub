"use client";
import { signUpWithEmail } from "@/lib/actions";
import { Alert, Anchor, Button, Checkbox, TextInput } from "@mantine/core";
import Link from "next/link";
import { useActionState } from "react";

export default function SignUpForm() {
  const [error, action, pending] = useActionState(signUpWithEmail);

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
            htmlFor="name"
            className="text-dark mb-3 block text-sm dark:text-white"
          >
            {" "}
            Full Name{" "}
          </label>
          <TextInput
            id="name"
            name="name"
            placeholder="Enter your full name"
            type="text"
            autoComplete="name"
            size="lg"
            required
          />
        </div>
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
        <div className="mb-4">
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
            autoComplete="new-password"
            minLength={8}
            size="lg"
            required
          />
        </div>
        <div className="mb-8 flex">
          <Checkbox
            label={
              <>
                By creating an account you agree to the{" "}
                <Anchor component={Link} href="/terms" target="_blank" inherit>
                  terms and conditions
                </Anchor>{" "}
                and the{" "}
                <Anchor
                  component={Link}
                  href="/privacy"
                  target="_blank"
                  inherit
                >
                  privacy policy
                </Anchor>
              </>
            }
            required
          />
        </div>
        <div className="mb-6">
          <Button type="submit" size="lg" loading={pending} fullWidth>
            Sign up
          </Button>
        </div>
      </form>
    </>
  );
}
