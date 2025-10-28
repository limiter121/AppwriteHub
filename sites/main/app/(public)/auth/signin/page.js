import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TextInput, Button, Divider, Alert } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import SignInForm from "@/components/auth/SignInForm";

export default async function SignInPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/dashboard");

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

                <SignInForm />

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
