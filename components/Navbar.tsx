"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Space */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-600/30">
              PI
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              Pustaka Iman
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-slate-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/katalog"
              className="text-slate-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Katalog Buku
            </Link>
            <Link
              href="/kirim-naskah"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-600/20 transition-all"
            >
              Kirim Naskah
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white font-medium"
          >
            Beranda
          </Link>
          <Link
            href="/katalog"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white font-medium"
          >
            Katalog Buku
          </Link>
          <Link
            href="/kirim-naskah"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md bg-emerald-600 text-white font-medium text-center shadow-sm"
          >
            Kirim Naskah
          </Link>
        </div>
      )}
    </header>
  );
}
