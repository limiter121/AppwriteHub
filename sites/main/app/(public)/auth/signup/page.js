import { getLoggedInUser, getSessionCookieName } from "@/lib/server/appwrite";
import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { TextInput, Button, Anchor, Checkbox, Divider } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";

async function signUpWithEmail(formData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  const { account } = await createAdminClient();

  await account.create({
    userId: ID.unique(),
    email,
    password,
    name,
  });
  const session = await account.createEmailPasswordSession({
    email,
    password,
  });
  const cookie = process.env.NEXT_PUBLIC_APPWRITE_COOKIE;

  cookies().set(cookie, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  redirect("/account");
}

export default async function SignUpPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/account");

  return (
    <>
      <section className="relative z-10 overflow-hidden pt-8 pb-16 md:pb-20 lg:pb-28">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
                  Create your account
                </h3>
                <p className="text-body-color mb-11 text-center text-base font-medium">
                  It's totally free and super easy
                </p>
                <div className="flex flex-col gap-2 mb-8">
                  <Button
                    color="gray"
                    variant="outline"
                    leftSection={<IconBrandGithub size={18} />}
                    fullWidth
                    disabled
                  >
                    Sign up with Github - Coming soon
                  </Button>
                </div>

                <Divider my="md" label="OR" labelPosition="center" />

                <form action={signUpWithEmail}>
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
                          <Anchor
                            component={Link}
                            href="/terms"
                            target="_blank"
                            inherit
                          >
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
                    <Button type="submit" size="lg" fullWidth>
                      Sign up
                    </Button>
                  </div>
                </form>
                <p className="text-body-color text-center text-base font-medium">
                  Already have an account?{" "}
                  <Link
                    href="/auth/signin"
                    className="text-primary hover:underline"
                  >
                    Sign in
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
