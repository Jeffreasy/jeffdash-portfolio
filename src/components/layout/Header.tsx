import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="p-4 bg-gray-100">
      <nav className="container mx-auto flex justify-between">
        <Link href="/" className="font-bold">Jeffdash Portfolio</Link>
        <div>
          <Link href="/projects" className="mr-4">Projects</Link>
          <Link href="/blog" className="mr-4">Blog</Link>
          <Link href="/about" className="mr-4">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>
    </header>
  );
} 