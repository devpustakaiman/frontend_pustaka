import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string | React.ReactNode;
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
    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b border-gray-100 pb-4">
      <div>
        {eyebrow && (
          <span className="text-xs uppercase tracking-wider font-bold text-[#E52E2D] block mb-1.5">
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
          prefetch={false}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-[#272522] hover:text-[#E52E2D] border-b border-gray-300 hover:border-[#E52E2D] pb-0.5 transition-all mt-4 sm:mt-0"
        >
          <span>{linkLabel}</span>
          <ChevronRight
            className="group-hover:translate-x-1 transition-transform text-[#E52E2D]"
            size={16}
          />
        </Link>
      )}
    </div>
  );
}
