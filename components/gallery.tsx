"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/products";

export function Gallery({ images }: { images: ProductImage[] }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  return (
    <div
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") setIndex((value) => (value + 1) % images.length);
        if (event.key === "ArrowLeft") setIndex((value) => (value - 1 + images.length) % images.length);
      }}
    >
      <div className="gallery-main">
        <Image src={current.src} alt={current.alt} fill priority sizes="(min-width: 960px) 52vw, 100vw" />
      </div>
      <ul className="thumbs">
        {images.map((image, imageIndex) => (
          <li key={image.src}>
            <button
              type="button"
              aria-label={`Voir l’image ${imageIndex + 1} sur ${images.length}`}
              aria-current={imageIndex === index ? "true" : undefined}
              onClick={() => setIndex(imageIndex)}
            >
              <Image src={image.src} alt="" fill sizes="74px" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
