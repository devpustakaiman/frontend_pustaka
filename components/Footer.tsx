"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const DEFAULT_LINKS = {
  facebook_url: "https://www.facebook.com/penerbit.imania/",
  x_url: "https://x.com/penerbitimania",
  instagram_url: "https://www.instagram.com/penerbitimania/",
  tiktok_url: "https://www.tiktok.com/@penerbitimania",
  mizanstore_url: "https://mizanstore.com",
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState(DEFAULT_LINKS);

  useEffect(() => {
    async function fetchFooterSettings() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("facebook_url, x_url, instagram_url, tiktok_url, mizanstore_url")
          .eq("id", "default")
          .maybeSingle();

        if (!error && data) {
          setSocialLinks({
            facebook_url: data.facebook_url || DEFAULT_LINKS.facebook_url,
            x_url: data.x_url || DEFAULT_LINKS.x_url,
            instagram_url: data.instagram_url || DEFAULT_LINKS.instagram_url,
            tiktok_url: data.tiktok_url || DEFAULT_LINKS.tiktok_url,
            mizanstore_url: data.mizanstore_url || DEFAULT_LINKS.mizanstore_url,
          });
        }
      } catch (err) {
        console.error("Error fetching footer links from site_settings:", err);
      }
    }

    fetchFooterSettings();
  }, []);

  return (
    <footer className="bg-[#1C1819] text-gray-100 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Editorial Mission Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center">
              <div className="bg-white px-3.5 py-2 rounded-2xl shadow-sm inline-flex items-center justify-center">
                <Image
                  src="/logo500x200_1.png"
                  alt="PUSTAKA IMaN"
                  width={500}
                  height={200}
                  loading="lazy"
                  style={{ width: "auto" }}
                  className="h-9 object-contain"
                />
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm font-sans">
              Penerbit & Penyedia Literasi bermutu tinggi untuk mencerdaskan
              bangsa melalui karya-karya pemikiran dan spiritualitas yang bermakna.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-[#E52E2D] font-bold mb-4 text-xs uppercase tracking-wider">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/" prefetch={false} className="hover:text-[#E52E2D] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/katalog/" prefetch={false} className="hover:text-[#E52E2D] transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/pre-order/" prefetch={false} className="hover:text-[#E52E2D] transition-colors">
                  Pre-Order Buku
                </Link>
              </li>
              <li>
                <Link href="/warta/" prefetch={false} className="hover:text-[#E52E2D] transition-colors">
                  Warta Buku
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Services Column */}
          <div>
            <h3 className="text-[#E52E2D] font-bold mb-4 text-xs uppercase tracking-wider">
              Layanan & Info
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/kirim-naskah/" prefetch={false} className="hover:text-[#E52E2D] transition-colors">
                  Kirim Naskah
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami/" prefetch={false} className="hover:text-[#E52E2D] transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak/" prefetch={false} className="hover:text-[#E52E2D] transition-colors">
                  Kontak Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* External Store & Social Links Column */}
          <div>
            <h3 className="text-[#E52E2D] font-bold mb-4 text-xs uppercase tracking-wider">
              Official Store & Media
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <a
                  href={socialLinks.mizanstore_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 hover:text-[#E52E2D] transition-colors"
                >
                  <svg className="w-4 h-4 text-current flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Mizanstore Official</span>
                </a>
              </li>
              <li>
                <a
                  href={socialLinks.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 hover:text-[#E52E2D] transition-colors"
                >
                  <svg className="w-4 h-4 text-current flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href={socialLinks.x_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 hover:text-[#E52E2D] transition-colors"
                >
                  <svg className="w-4 h-4 text-current flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>X (Twitter)</span>
                </a>
              </li>
              <li>
                <a
                  href={socialLinks.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 hover:text-[#E52E2D] transition-colors"
                >
                  <svg className="w-4 h-4 text-current flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href={socialLinks.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 hover:text-[#E52E2D] transition-colors"
                >
                  <svg className="w-4 h-4 text-current flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.32 0 .63.05.92.14V8.9a6.38 6.38 0 0 0-.92-.07A6.34 6.34 0 0 0 3 15.17a6.34 6.34 0 0 0 6.34 6.33 6.34 6.34 0 0 0 6.33-6.33V9.05a8.27 8.27 0 0 0 4.92 1.6V7.2a4.85 4.85 0 0 1-1-.51z" />
                  </svg>
                  <span>TikTok</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {currentYear} Pustaka Iman. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="text-[11px] text-gray-500">
            Official Publisher Partner of Mizan Group
          </p>
        </div>
      </div>
    </footer>
  );
}
