import { Play } from "lucide-react";

interface FeaturedVideoProps {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
}

export default function FeaturedVideo({
  title = "Agenda & Liputan Visual",
  subtitle = "Saksikan ulasan, wawancara, dan trailer karya literasi pilihan dari Pustaka Iman",
  videoUrl = "https://www.youtube.com/embed/t_cWQkwBDps?start=73",
}: FeaturedVideoProps) {
  return (
    <section className="w-full bg-[#F7F4E9] py-12 md:py-16 border-t border-[#EAE5D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Serif Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-[#D32F2F]">
            <Play size={13} strokeWidth={2} fill="currentColor" />
            Media & Video
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-[#76716A]">
            {subtitle}
          </p>
        </div>

        {/* Constrained Centered Container & Styled Responsive Iframe */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="aspect-video w-full rounded-2xl shadow-lg border border-[#EAE5D9] overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src={videoUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

      </div>
    </section>
  );
}
