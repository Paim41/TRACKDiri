import Image from "next/image";

export function TrackLogo({ size = 56 }: { size?: number }) {
  return (
    <Image
      src="/assets/trackdiri-logo.png"
      alt="TRACKDiri logo"
      width={size}
      height={size}
      className="rounded-full object-contain"
      priority={size > 80}
    />
  );
}

export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <TrackLogo size={48} />
      <div>
        <p className={`font-heading text-xl font-black ${inverse ? "text-white" : "text-track-ocean"}`}>
          TRACKDiri
        </p>
        <p className={`text-xs font-semibold ${inverse ? "text-white/78" : "text-slate-600"}`}>
          Daily health, clearly tracked
        </p>
      </div>
    </div>
  );
}
