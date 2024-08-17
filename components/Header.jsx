"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Fitness Goal Tracker Logo"
            width={48}
            height={48}
          />
          <h1 className="text-xl font-bold text-gray-800">
            Fitness Goal Tracker
          </h1>
        </Link>
        <nav className="flex gap-4">
          {session?.user ? (
            <>
              <Link href="/goals" className="hover:text-gray-600">
                Goals
              </Link>
              <Link href="/profile" className="hover:text-gray-600">
                Profile
              </Link>
              <button
                onClick={() => signIn({ callbackUrl: "/" })}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn({ callbackUrl: "/" })}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;