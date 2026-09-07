"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Plus, MessageCircle } from "lucide-react";

interface ShareSectionProps {
  title: string;
  url?: string;
  className?: string;
}

/**
 * Enhanced Reusable ShareSection Component
 * Supports: WhatsApp, Facebook, X (Twitter), Telegram, LinkedIn, Instagram, Copy Link, and Native Web Share (+).
 */
export default function ShareSection({ title, url, className = "" }: ShareSectionProps) {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [igToast, setIgToast] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(url || window.location.href);
    }
  }, [url]);

  const handleCopyLink = async () => {
    if (typeof window !== "undefined" && currentUrl) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const handleInstagramShare = async () => {
    if (typeof window !== "undefined" && currentUrl) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setIgToast(true);
        setTimeout(() => setIgToast(false), 3000);

        if (typeof navigator !== "undefined" && navigator.share) {
          try {
            await navigator.share({
              title: title || "Pustaka Iman",
              text: title,
              url: currentUrl,
            });
          } catch (e) {
            window.open("https://instagram.com/direct/inbox/", "_blank", "noopener,noreferrer");
          }
        } else {
          window.open("https://instagram.com/direct/inbox/", "_blank", "noopener,noreferrer");
        }
      } catch (err) {
        console.error("Failed to share to Instagram:", err);
      }
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title || "Pustaka Iman",
          text: title,
          url: currentUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.warn("Native share fallback to copy link:", err);
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const encodedTitle = encodeURIComponent(title || "Pustaka Iman");
  const encodedUrl = encodeURIComponent(currentUrl);

  return (
    <div className={`space-y-2.5 ${className}`}>
      <span className="text-xs font-bold text-[#76716A] uppercase tracking-wider block">
        Bagikan:
      </span>
      
      {igToast && (
        <div className="p-2.5 bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold rounded-xl animate-in fade-in flex items-center justify-between">
          <span>Tautan disalin! Buka Instagram untuk membagikan 📸</span>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {/* 1. WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-xl text-xs font-bold transition-all duration-200"
          title="Bagikan ke WhatsApp"
        >
          <MessageCircle size={15} fill="currentColor" />
          <span>WhatsApp</span>
        </a>

        {/* 2. Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white rounded-xl text-xs font-bold transition-all duration-200"
          title="Bagikan ke Facebook"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </a>

        {/* 3. X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 hover:bg-black hover:text-white rounded-xl text-xs font-bold transition-all duration-200"
          title="Bagikan ke X (Twitter)"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X</span>
        </a>

        {/* 4. Telegram */}
        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white rounded-xl text-xs font-bold transition-all duration-200"
          title="Bagikan ke Telegram"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .54-1.43.53-.47-.01-1.37-.26-2.05-.48-.83-.27-1.49-.42-1.43-.89.03-.25.38-.51 1.07-.78 4.2-1.83 7-3.04 8.4-3.63 4-.17 4.83.69 4.87.72z" />
          </svg>
          <span>Telegram</span>
        </a>

        {/* 5. LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white rounded-xl text-xs font-bold transition-all duration-200"
          title="Bagikan ke LinkedIn"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
          </svg>
          <span>LinkedIn</span>
        </a>

        {/* 6. Instagram */}
        <button
          type="button"
          onClick={handleInstagramShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 text-pink-600 hover:from-purple-600 hover:to-pink-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
          title="Bagikan ke Instagram (Salin Tautan)"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span>Instagram</span>
        </button>

        {/* 7. Salin Tautan */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
          title="Salin Tautan ke Clipboard"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          <span>{copied ? "Tautan Disalin!" : "Salin Tautan"}</span>
        </button>

        {/* 8. Tombol "+" (Native Web Share API / Opsi Lainnya) */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center justify-center p-2 bg-red-50 text-[#E52E2D] hover:bg-[#E52E2D] hover:text-white rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border border-red-100 shadow-2xs"
          title="Opsi Share Lainnya (Telegram, LinkedIn, Email, DLL)"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
