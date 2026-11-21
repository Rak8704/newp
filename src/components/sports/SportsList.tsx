
"use client";

import { Sport } from "@/types/sports";
import { useEffect, useState } from "react";
import { useSportsStore } from "@/lib/store/sportsStore";

interface SportsListProps {
  onSelectSport: (sportKey: string) => void;
  selectedSportKey?: string;
}

export const SportsList = ({
  onSelectSport,
  selectedSportKey,
}: SportsListProps) => {
  const { sports, fetchAllSports, isLoading, error } = useSportsStore();

  const [groupedSports, setGroupedSports] = useState<
    Record<string, Sport[]>
  >({});

  useEffect(() => {
    fetchAllSports();
  }, [fetchAllSports]);

  useEffect(() => {
    const grouped = sports.reduce<Record<string, Sport[]>>((acc, sport) => {
      if (!acc[sport.group]) {
        acc[sport.group] = [];
      }

      acc[sport.group].push(sport);
      return acc;
    }, {});

    setGroupedSports(grouped);
  }, [sports]);

  if (isLoading && sports.length === 0) {
    return (
      <div className="space-y-3 bg-[#100525] p-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded-lg border border-[#351052] bg-[#351052]/40"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-3 rounded-xl border border-[#70269c] bg-[#150329] p-4 text-center">
        <p className="text-sm text-[#e8c8ff]">
          Error loading sports: {error}
        </p>

        <button
          onClick={() => fetchAllSports()}
          className="mt-3 rounded-lg border border-[#d946ef] bg-gradient-to-b from-[#c026d3] to-[#70269c] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-125"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto bg-[#100525] p-2">
      {Object.entries(groupedSports).map(([group, sportsList]) => (
        <div key={group} className="mb-4">
          <h3 className="mb-2 border-b border-[#351052] px-3 py-2 text-sm font-bold uppercase tracking-wide text-[#d946ef]">
            {group}
          </h3>

          <div className="space-y-1">
            {sportsList.map((sport) => (
              <button
                key={sport.key}
                onClick={() => onSelectSport(sport.key)}
                className={`w-full rounded-lg border px-3 py-2.5 text-left transition-all duration-200 ${
                  selectedSportKey === sport.key
                    ? "border-[#d946ef] bg-gradient-to-r from-[#70269c] to-[#351052] text-white shadow-[0_2px_10px_rgba(192,38,211,0.2)]"
                    : "border-transparent bg-transparent text-[#e8c8ff] hover:border-[#351052] hover:bg-[#351052]/60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {sport.title}
                  </span>

                  {sport.active && (
                    <span className="rounded-full border border-[#d946ef]/50 bg-[#70269c]/40 px-2 py-0.5 text-[10px] font-bold text-[#f0abfc]">
                      Live
                    </span>
                  )}
                </div>

                {sport.description && (
                  <p className="mt-1 text-xs text-[#a78abf]">
                    {sport.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {sports.length === 0 && !isLoading && (
        <p className="p-5 text-center text-sm text-[#a78abf]">
          No sports available
        </p>
      )}
    </div>
  );
};
