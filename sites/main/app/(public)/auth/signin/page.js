import { getLoggedInUser, getSessionCookieName } from "@/lib/server/appwrite";
import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { TextInput, Button, Anchor, Checkbox, Divider } from "@mantine/core";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

async function signInWithEmail(formData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  const { account } = await createAdminClient();

  const session = await account.createEmailPasswordSession({
    email,
    password,
  });

  (await cookies()).set(
    process.env.NEXT_PUBLIC_APPWRITE_COOKIE,
    session.secret,
    {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    },
  );

  redirect("/dashboard");
}

export default async function SignInPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/account");

  return (
    <>
      <section className="relative z-10 overflow-hidden pt-8 pb-16 md:pb-20 lg:pb-28">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
                <h3 className="mb-6 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
                  Sign in to your account
                </h3>
                <div className="flex flex-col gap-2 mb-8">
                  <Button
                    color="gray"
                    variant="outline"
                    leftSection={<IconBrandGithub size={18} />}
                    fullWidth
                    disabled
                  >
                    Sign in with Github - Coming soon
                  </Button>
                </div>

                <Divider my="md" label="OR" labelPosition="center" />

                <form action={signInWithEmail}>
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
                    <Button type="submit" size="lg" fullWidth>
                      Sign in
                    </Button>
                  </div>
                </form>
                <p className="text-body-color text-center text-base font-medium">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 z-[-1]">
          <img src="/image.svg" />
        </div>
      </section>
    </>
  );
}
