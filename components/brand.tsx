import Image from "next/image";
import Link from "next/link";

export function TrackLogo({ size = 56 }: { size?: number }) {
  return (
    <Image
      src="/assets/trackdiri-logo.png"
      alt="TRACKDiri logo"
      width={size}
      height={size}
      className="rounded-full object-contain"
      style={{ width: size, height: size }}
      priority={size > 80}
    />
  );
}

export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-track-sky">
      <TrackLogo size={48} />
      <div>
        <p className={`font-heading text-xl font-black ${inverse ? "text-white" : "text-track-ocean"}`}>
          TRACKDiri
        </p>
        <p className={`text-xs font-semibold ${inverse ? "text-white/78" : "text-slate-600"}`}>
          Daily health, clearly tracked
        </p>
      </div>
    </Link>
  );
}
