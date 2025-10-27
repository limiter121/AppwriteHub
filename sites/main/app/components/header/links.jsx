"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Browse", href: "/browse" },
  { name: "Contribute", href: "/contribute" },
  { name: "Dashboard", href: "/dashboard", authenticated: true },
];

export default function HeaderLinks({ authenticated }) {
  const pathname = usePathname();

  return (
    <nav className="md:ml-auto md:mr-auto flex flex-wrap gap-5 items-center text-base justify-center">
      {links
        .filter((link) => (link.authenticated ? authenticated : true))
        .map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`hover:text-pink-400 ${pathname === link.href ? "text-pink-500 font-medium" : ""}`}
          >
            {link.name}
          </Link>
        ))}
    </nav>
  );
}
