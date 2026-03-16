"use client";

import { useEffect, useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";

type FeatureProperties = {
  name?: string;
};

type WorldFeature = GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>;

type WorldGeoJson = {
  type: "FeatureCollection";
  features: WorldFeature[];
};

type Props = {
  selectedCountry: string;
  className?: string;
  svgHeightClassName?: string;
};

const WORLD_GEOJSON_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const MAP_WIDTH = 860;
const MAP_HEIGHT = 420;

const COUNTRY_NAME_ALIASES: Record<string, string[]> = {
  "united states": ["united states of america", "usa"],
  "south korea": ["korea", "republic of korea"],
  "united kingdom": ["uk", "great britain"],
  turkey: ["turkiye"],
};

function normalizeCountryName(value: string): string {
  return value.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
}

export function CountryMap({ selectedCountry, className, svgHeightClassName = "h-[220px]" }: Props) {
  const [geoJson, setGeoJson] = useState<WorldGeoJson | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMap() {
      setLoadingError(null);
      try {
        const response = await fetch(WORLD_GEOJSON_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Map data request failed.");
        }
        const data = (await response.json()) as WorldGeoJson;
        setGeoJson(data);
      } catch {
        if (!controller.signal.aborted) {
          setLoadingError("Map preview unavailable right now.");
        }
      }
    }

    void loadMap();
    return () => controller.abort();
  }, []);

  const selectedNames = useMemo(() => {
    const cleaned = normalizeCountryName(selectedCountry);
    if (!cleaned) return new Set<string>();
    const aliases = COUNTRY_NAME_ALIASES[cleaned] ?? [];
    return new Set<string>([cleaned, ...aliases.map(normalizeCountryName)]);
  }, [selectedCountry]);

  const mapPaths = useMemo(() => {
    if (!geoJson) return [];

    const projection = geoNaturalEarth1().fitSize([MAP_WIDTH, MAP_HEIGHT], geoJson as never);
    const pathGenerator = geoPath(projection);

    return geoJson.features.map((feature, index) => {
      const path = pathGenerator(feature);
      if (!path) return null;
      const rawName = feature.properties?.name ?? "";
      const normalized = normalizeCountryName(rawName);
      const isSelected = selectedNames.has(normalized);

      return {
        key: `${rawName}-${index}`,
        path,
        isSelected,
      };
    });
  }, [geoJson, selectedNames]);

  return (
    <div className={`relative overflow-hidden rounded-[16px] border border-ink-soft/20 bg-surface-elevated/60 ${className ?? ""}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(105,226,255,0.14),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(114,184,255,0.1),transparent_44%)]" />

      <div className="relative p-2.5">
        {loadingError ? (
          <p className="py-12 text-center text-sm text-ink-soft">{loadingError}</p>
        ) : mapPaths.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-soft">Loading map...</p>
        ) : (
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className={`${svgHeightClassName} w-full`}
            role="img"
            aria-label="World map preview"
          >
            {mapPaths.map((item) => {
              if (!item) return null;
              return (
                <path
                  key={item.key}
                  d={item.path}
                  fill={item.isSelected ? "var(--accent)" : "color-mix(in srgb, var(--surface-muted) 76%, var(--foreground) 24%)"}
                  opacity={item.isSelected ? 1 : 0.9}
                  stroke="color-mix(in srgb, var(--background) 76%, transparent)"
                  strokeWidth={0.6}
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}