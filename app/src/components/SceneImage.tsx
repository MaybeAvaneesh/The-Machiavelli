"use client";

import { getSceneImage } from "@/lib/scene-images";

interface SceneImageProps {
  category: string;
  scenarioId?: string;
}

export function SceneImage({ category, scenarioId = "default" }: SceneImageProps) {
  const src = getSceneImage(category, scenarioId);

  return (
    <div className="relative h-48 overflow-hidden rounded-t-lg retro-border-b">
      <div className="h-full w-full overflow-hidden">
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover object-top scene-toned scene-kenburns"
        />
      </div>
      {/* Warm candlelit wash to unify every painting into the game's palette */}
      <div className="absolute inset-0 scene-wash pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-transparent to-transparent opacity-90" />
      <div className="absolute inset-0 scanlines pointer-events-none" />
      <div className="absolute inset-0 crt-vignette pointer-events-none" />
    </div>
  );
}
