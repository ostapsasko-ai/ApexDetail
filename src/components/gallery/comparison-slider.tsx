"use client";

import Image from "next/image";
import { useState } from "react";

export function ComparisonSlider() {
  const [position, setPosition] = useState(52);
  return (
    <div className="comparison" style={{ "--position": `${position}%` } as React.CSSProperties}>
      <Image src="/generated/apexdetail-hero.png" alt="Lakier po korekcie i zabezpieczeniu" fill className="object-cover" sizes="100vw" />
      <div className="comparison__before"><Image src="/generated/apexdetail-hero.png" alt="Lakier przed korektą — wizualizacja" fill className="object-cover grayscale contrast-75 brightness-50" sizes="100vw" /></div>
      <span className="comparison__label comparison__label--before">Przed</span><span className="comparison__label comparison__label--after">Po</span>
      <div className="comparison__line" aria-hidden="true"><b>↔</b></div>
      <label><span className="sr-only">Pozycja porównania przed i po</span><input type="range" min="10" max="90" value={position} onChange={(event) => setPosition(Number(event.target.value))} /></label>
    </div>
  );
}

