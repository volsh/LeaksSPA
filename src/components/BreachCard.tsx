// components/BreachCard.tsx
"use client";

interface BreachCardProps {
  breach: Breach;
  searchQuery?: string;
}

import { Breach } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

function highlight(text: string, query: string) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function BreachCard({
  breach,
  searchQuery = "",
}: BreachCardProps) {
  const { Name, Title, BreachDate, LogoPath } = breach;
  const router = useRouter();
  const params = useSearchParams();

  const openModal = () => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("breach", Name);
    router.push(`/?${newParams.toString()}`, { scroll: false });
  };

  return (
    <button
      onClick={openModal}
      className="w-full text-left block animate-fade-in bg-white dark:bg-zinc-800 shadow-md rounded-md p-4 hover:shadow-lg transition-all hover:animate-pulse-slow"
    >
      <div className="flex items-center gap-4">
        <img
          src={LogoPath}
          alt={`${Title} logo`}
          className="w-12 h-12 object-contain rounded bg-white"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/fallback.png";
          }}
        />
        <div>
          <h2 className="text-lg font-semibold">
            {highlight(Title, searchQuery)}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Breach date: {new Date(BreachDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </button>
  );
}
