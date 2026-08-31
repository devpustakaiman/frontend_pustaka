import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  href = "/katalog",
  linkLabel = "Lihat Semua",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b border-[#EAE5D9] pb-4">
      <div>
        {eyebrow && (
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B67A2D] block mb-1">
            {eyebrow}
          </span>
        )}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#272522] tracking-tight">
          {title}
        </h2>
      </div>

      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-sm font-medium text-[#272522] hover:text-[#B67A2D] border-b border-gray-400 hover:border-[#B67A2D] pb-0.5 transition-all mt-4 sm:mt-0"
        >
          <span>{linkLabel}</span>
          <ChevronRight
            className="group-hover:translate-x-1 transition-transform"
            size={16}
          />
        </Link>
      )}
    </div>
  );
}
