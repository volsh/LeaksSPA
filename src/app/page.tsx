"use client";

import { useEffect, useState, useRef, useDeferredValue, useMemo } from "react";
import BreachCard from "@/components/BreachCard";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useRouter, useSearchParams } from "next/navigation";
import BreachDetailModal from "@/components/BreachDetailModal";
import { Breach } from "@/types";

const PAGE_SIZE = 10;

export default function HomePage() {
  const [breaches, setBreaches] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterSensitive, setFilterSensitive] = useState(false);
  const [selectedBreach, setSelectedBreach] = useState<any | null>(null);

  const deferredSearch = useDeferredValue(search);

  const containerRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const hasMore = useRef(true);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("breach");
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  const fetchBreaches = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/breaches?offset=${offset}`);
      const { items, error, total } = await res.json();

      if (error) {
        throw new Error(error);
      }
      if (offset + items.length < total) {
        setOffset((prev) => prev + PAGE_SIZE);
      } else {
        hasMore.current = false;
      }
      setBreaches((prev) => [...prev, ...items]);
    } catch (err) {
      console.error("Failed to load breaches:", err);
    } finally {
      setLoading(false);
    }
  };

  // Lazy loading on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        hasMore.current
      ) {
        fetchBreaches();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  useEffect(() => {
    fetchBreaches(); // initial load
  }, []);

  useEffect(() => {
    const name = searchParams.get("breach");

    if (!name) return setSelectedBreach(null);

    const existing = breaches.find((b) => b.Name === name);
    if (existing) return setSelectedBreach(existing);

    // If not found, fetch directly
    fetch(`/api/breaches?name=${encodeURIComponent(name)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject("Not found")))
      .then(({ item }) => setSelectedBreach(item))
      .catch((err) => {
        console.error("Could not load selected breach:", err);
        setSelectedBreach(null);
      });
  }, [searchParams, breaches]);

  const filteredBreaches = useMemo(
    () =>
      breaches
        .filter((b) =>
          !!deferredSearch
            ? b.Title.toLowerCase().includes(deferredSearch.toLowerCase())
            : true
        )
        .filter((b) => !filterVerified || b.IsVerified)
        .filter((b) => !filterSensitive || b.IsSensitive),
    [breaches, deferredSearch, filterVerified, filterSensitive]
  );

  return (
    <main
      ref={containerRef}
      className="p-6 max-w-4xl mx-auto space-y-4 scroll-mt-16"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">Known Data Breaches</h1>
        <ThemeToggle />
      </div>

      <input
        type="text"
        placeholder="Search breaches…"
        className="p-1 w-full rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded border-zinc-300 dark:border-zinc-700"
            checked={filterVerified}
            onChange={(e) => setFilterVerified(e.target.checked)}
          />
          Verified only
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded border-zinc-300 dark:border-zinc-700"
            checked={filterSensitive}
            onChange={(e) => setFilterSensitive(e.target.checked)}
          />
          Sensitive only
        </label>
      </div>

      {loading && breaches.length === 0 && (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white dark:bg-zinc-800 rounded-md p-4 space-y-4 shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredBreaches.length === 0 && (
        <p className="text-center text-sm text-zinc-500">
          No breaches match your filters.
        </p>
      )}

      <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-inner">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {filteredBreaches.map((breach, idx) => (
            <div key={`${breach.Name}-${idx}`} className="animate-fade-in">
              <BreachCard breach={breach} searchQuery={deferredSearch} />
            </div>
          ))}
          {selectedBreach && (
            <BreachDetailModal breach={selectedBreach} onClose={closeModal} />
          )}
        </div>
      </div>
    </main>
  );
}
