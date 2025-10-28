import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button, Divider } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import SignUpForm from "@/components/auth/SignUpForm";

export default async function SignUpPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/dashboard");

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

                <SignUpForm />

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
