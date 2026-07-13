"use client";

interface City {
  id: string;
  label: string;
  x: number; // % from left of the map image
  y: number; // % from top
  faction?: string; // relationship key that governs this city's colour
}

// Positions tuned to public/maps/italy-antique.png (1408x768) — cities are
// already drawn + labelled in the art, so we only overlay allegiance markers.
const CITIES: City[] = [
  { id: "milan", label: "Milan", x: 35, y: 28, faction: "sforza" },
  { id: "venice", label: "Venice", x: 48, y: 26, faction: "venice" },
  { id: "florence", label: "Florence", x: 41, y: 43, faction: "medici" },
  { id: "rome", label: "Rome", x: 54, y: 59, faction: "borgia" },
  { id: "naples", label: "Naples", x: 73, y: 68, faction: "aragon" },
];

const CATEGORY_CITY: Record<string, string> = {
  political: "rome",
  military: "venice",
  economic: "florence",
  religious: "rome",
  crisis: "naples",
};

const REL_COLOR: Record<string, string> = {
  hostile: "#e0483a",
  wary: "#e0993a",
  neutral: "#d8b24a",
  allied: "#4fc07a",
  loyal: "#39e08a",
};

function cityColor(city: City, relationships: Record<string, string>): string {
  const level = city.faction ? relationships[city.faction] : undefined;
  return level ? REL_COLOR[level] ?? "#c9a84c" : "#c9a84c";
}

interface MapPanelProps {
  category?: string;
  city?: string;
  relationships?: Record<string, string>;
}

export function MapPanel({ category, city, relationships = {} }: MapPanelProps) {
  const activeCity =
    city ?? (category ? CATEGORY_CITY[category] : undefined) ?? "rome";
  const active = CITIES.find((c) => c.id === activeCity);

  return (
    <div className="rounded-lg overflow-hidden relative border-2 border-[#3a3020]">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1408 / 768" }}>
        <img
          src="/maps/italy-antique.png"
          alt="A map of the Italian states"
          className="map-image absolute inset-0 w-full h-full object-cover"
        />

        {/* Atmosphere: drifting fog layers */}
        <div
          className="map-fog absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 45% at 30% 40%, rgba(201,168,76,0.06), transparent 70%)",
            mixBlendMode: "screen",
          }}
        />
        <div
          className="map-fog map-fog-2 absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(55% 40% at 70% 60%, rgba(120,120,110,0.10), transparent 70%)",
            mixBlendMode: "screen",
          }}
        />

        {/* Atmosphere: slowly rising embers */}
        {[
          { left: "22%", top: "78%", delay: "0s", s: 3 },
          { left: "58%", top: "72%", delay: "2.4s", s: 2 },
          { left: "80%", top: "84%", delay: "4.1s", s: 3 },
          { left: "44%", top: "66%", delay: "5.6s", s: 2 },
        ].map((e, i) => (
          <span
            key={i}
            className="map-ember absolute rounded-full pointer-events-none"
            style={{
              left: e.left,
              top: e.top,
              width: e.s,
              height: e.s,
              backgroundColor: "#e9b24a",
              boxShadow: "0 0 6px 1px rgba(233,178,74,0.7)",
              animationDelay: e.delay,
            }}
          />
        ))}

        {/* Active city connector: dashed line dropping toward the card below */}
        {active && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${active.x}%`,
              top: `${active.y}%`,
              bottom: 0,
              width: 0,
              transform: "translateX(-50%)",
              borderLeft: "2px dashed rgba(244,217,122,0.55)",
            }}
          />
        )}

        {CITIES.map((c) => {
          const isActive = c.id === activeCity;
          const color = isActive ? "#f2e2b0" : cityColor(c, relationships);
          const ring = isActive ? "#f4d97a" : color;
          const size = isActive ? 14 : 11;
          return (
            <div
              key={c.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              title={c.label}
            >
              {isActive && (
                <span
                  className="font-heading absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 text-[10px] uppercase tracking-widest"
                  style={{
                    bottom: "calc(100% + 12px)",
                    color: "#2a2010",
                    background:
                      "linear-gradient(180deg, #e7d5a3 0%, #cdb578 100%)",
                    border: "1px solid #c9a84c",
                    borderRadius: 3,
                    boxShadow:
                      "0 1px 4px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.25)",
                    textShadow: "0 1px 0 rgba(255,255,255,0.3)",
                  }}
                >
                  {c.label}
                </span>
              )}
              <span className="relative flex items-center justify-center">
                {isActive && (
                  <span
                    className="absolute inline-flex rounded-full opacity-70 animate-ping"
                    style={{ width: 22, height: 22, backgroundColor: ring }}
                  />
                )}
                <span
                  className="relative inline-block rounded-full"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    border: `2px solid ${isActive ? "#2a2010" : "rgba(20,12,6,0.7)"}`,
                    boxShadow: `0 0 10px 2px ${ring}, 0 0 0 1px rgba(0,0,0,0.4)`,
                  }}
                />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
