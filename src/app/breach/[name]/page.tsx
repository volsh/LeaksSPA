// app/breach/[name]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";

interface Breach {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  Description: string;
  LogoPath: string;
  PwnCount: number;
  DataClasses: string[];
  IsVerified: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
}

const API_URL = "https://hiring.external.guardio.dev/fe/breaches";
const POKEMON = "pikachu"; // Replace with your favorite

export default async function BreachDetailPage({
  params,
}: {
  params: { name: string };
}) {
  try {
    const res = await fetch(API_URL, {
      headers: {
        "X-Best-Pokemon": POKEMON,
      },
      cache: "force-cache", // ensure static optimization
    });

    const all = await res.json();
    const breach = all.find((b: Breach) => b.Name === params.name);

    if (!breach) return notFound();

    return (
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Link href="/" className="text-blue-500 underline">
          ← Back to list
        </Link>

        <div className="flex items-center gap-4">
          <img
            src={breach.LogoPath}
            alt={`${breach.Title} logo`}
            className="w-16 h-16 object-contain rounded"
          />
          <div>
            <h1 className="text-2xl font-bold">{breach.Title}</h1>
            <p className="text-zinc-500 dark:text-zinc-300">
              Breach date: {new Date(breach.BreachDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <p className="prose dark:prose-invert">{breach.Description}</p>

        <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
          <p>Domain: {breach.Domain}</p>
          <p>Pwn Count: {breach.PwnCount.toLocaleString()}</p>
          <p>Data Classes: {breach.DataClasses.join(", ")}</p>
          <p>Verified: {breach.IsVerified ? "✅" : "❌"}</p>
          <p>Sensitive: {breach.IsSensitive ? "🔒" : "❌"}</p>
          <p>Retired: {breach.IsRetired ? "☠️" : "No"}</p>
        </div>
      </main>
    );
  } catch (err) {
    return notFound();
  }
}
