"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function AuthCharacter() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const src = passwordVisible
    ? "/assets/trackdiri-character-open.png"
    : "/assets/trackdiri-character-closed.png";

  useEffect(() => {
    function onVisibilityChange(event: Event) {
      const detail = (event as CustomEvent<{ visible: boolean }>).detail;
      setPasswordVisible(Boolean(detail?.visible));
    }

    window.addEventListener("trackdiri-password-visibility", onVisibilityChange);
    return () => window.removeEventListener("trackdiri-password-visibility", onVisibilityChange);
  }, []);

  return (
    <div className="relative mx-auto hidden min-h-[390px] w-full max-w-[640px] flex-1 lg:block" data-testid="auth-peek-character">
      <Image
        src={src}
        alt=""
        data-testid="auth-peek-character-image"
        fill
        sizes="640px"
        className="object-contain drop-shadow-[0_24px_36px_rgba(6,58,120,.22)] transition-opacity duration-200"
        priority
      />
    </div>
  );
}
