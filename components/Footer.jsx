"use client";

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="flex gap-4">
          <Link href="/" className="hover:text-gray-200">
            <Image
              src="/logo.svg"
              alt="Fitness Goal Tracker Logo"
              width={32}
              height={32}
            />
          </Link>
          <p className="text-sm font-medium">&copy; 2023 Fitness Goal Tracker</p>
        </div>
        <div className="flex gap-4 mt-4 text-xs">
          <Link href="/terms" className="hover:text-gray-200">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-gray-200">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;