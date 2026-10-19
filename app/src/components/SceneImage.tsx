"use client";

import { getSceneImage } from "@/lib/scene-images";

interface SceneImageProps {
  category: string;
  scenarioId?: string;
}

export function SceneImage({ category, scenarioId = "default" }: SceneImageProps) {
  const images = getSceneImage(category, scenarioId);

  return (
    <div className="relative h-48 overflow-hidden rounded-t-lg retro-border-b">
      <div className={`h-full flex ${images.length > 1 ? "gap-0.5" : ""}`}>
        {images.map((src, i) => (
          <div key={i} className="flex-1 h-full overflow-hidden relative">
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover retro-pixelate"
              style={{ imageRendering: "auto" }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-transparent to-transparent opacity-90" />
      <div className="absolute inset-0 scanlines pointer-events-none" />
      <div className="absolute inset-0 crt-vignette pointer-events-none" />
    </div>
  );
}
