import { useState, type KeyboardEvent } from "react";
import * as Icons from "lucide-react";
import { searchEntries, type SearchEntry } from "./searchIndex";

interface SearchBoxProps {
  onSelect: (entry: SearchEntry) => void;
}

export default function SearchBox({ onSelect }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = searchEntries(query);
  const showList = isOpen && query.trim() !== "";

  const handleSelect = (entry: SearchEntry) => {
    onSelect(entry);
    setQuery("");
    setIsOpen(false);
  };

  // Enter abre el primer resultado; Escape cierra la lista
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results.length > 0) {
      handleSelect(results[0]);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex-1 max-w-md mx-6 relative">
      {/* capa invisible: al hacer clic fuera se cierra la lista */}
      {showList && <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />}

      <div className="relative z-20">
        <Icons.Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar"
          className="w-full rounded-lg bg-slate-100 pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#5960A1]/30"
        />
      </div>

      {showList && (
        <ul className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-100 py-1.5 z-20 text-sm">
          {results.length === 0 ? (
            <li className="px-3 py-2 text-xs text-slate-400">Sin resultados para "{query.trim()}"</li>
          ) : (
            results.map((entry, idx) => (
              <li key={`${entry.page}-${entry.sectionId ?? "page"}`}>
                <button
                  onClick={() => handleSelect(entry)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-slate-50 cursor-pointer ${
                    idx === 0 ? "bg-slate-50" : ""
                  }`}
                >
                  <span className="font-medium text-slate-700">{entry.label}</span>
                  <span className="text-[11px] text-slate-400">{entry.group}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
