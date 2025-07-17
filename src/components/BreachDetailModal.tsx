import { Breach } from "@/types";
import DOMPurify from "dompurify";

export default function BreachDetailModal({
  breach,
  onClose,
}: {
  breach: Breach;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow-lg w-full max-w-xl relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-zinc-500 hover:text-red-500"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-2">{breach.Title}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {new Date(breach.BreachDate).toLocaleDateString()}
        </p>
        <p
          className="mt-4 prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(breach.Description || ""),
          }}
        />{" "}
      </div>
    </div>
  );
}
