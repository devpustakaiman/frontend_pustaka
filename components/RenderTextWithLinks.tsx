"use client";

import React from "react";

interface RenderTextWithLinksProps {
  text?: string | null;
  className?: string;
}

/**
 * Auto-detects URLs (http/https/www) in plain text and renders them as clickable <a> tags.
 * Preserves line breaks using whitespace-pre-line.
 */
export default function RenderTextWithLinks({
  text,
  className = "",
}: RenderTextWithLinksProps) {
  if (!text) return null;

  // Regex matching http://, https://, or www. links
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const parts = text.split(urlRegex);

  return (
    <span className={`whitespace-pre-line ${className}`}>
      {parts.map((part, index) => {
        if (part.match(/^https?:\/\//i) || part.match(/^www\./i)) {
          const href = part.toLowerCase().startsWith("www.")
            ? `https://${part}`
            : part;
          return (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium underline hover:text-blue-800 transition-colors break-words"
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
}
