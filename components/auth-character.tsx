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
    <div className="auth-peek-character relative mx-auto hidden h-[42vh] min-h-72 w-full max-w-[440px] lg:block" data-testid="auth-peek-character">
      <Image
        src={src}
        alt=""
        data-testid="auth-peek-character-image"
        fill
        sizes="440px"
        className="object-contain drop-shadow-[0_22px_36px_rgba(6,58,120,.2)] transition-all duration-300"
        priority
      />
    </div>
  );
}
