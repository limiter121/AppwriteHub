import Image from "next/image";
import Link from "next/link";
import HeaderUser from "./user";
import HeaderLinks from "./links";
import { getLoggedInUser } from "@/lib/server/appwrite";

export default async function Header() {
  const user = await getLoggedInUser();

  return (
    <header>
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link href="/" className="flex font-medium items-center mb-4 md:mb-0">
          <Image
            src="/apple-touch-icon-60x60.png"
            alt={process.env.NEXT_PUBLIC_APP_NAME}
            width={60}
            height={60}
          />
          <span className="ml-3 text-xl">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </span>
        </Link>
        <HeaderLinks authenticated={!!user} />
        <iframe src="https://ghbtns.com/github-btn.html?user=limiter121&repo=AppwriteHub&type=star&count=true&size=large" frameBorder="0" scrolling="0" width="120" height="30" title="GitHub" className="mt-2 md:mt-0"></iframe>
        <HeaderUser className="mt-4 md:mt-0" user={user} />
      </div>
    </header>
  );
}
