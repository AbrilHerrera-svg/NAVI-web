import Sidebar, { type PageId } from "./Sidebar";
import Topbar from "./Topbar";
import { type SearchEntry } from "./searchIndex";
import type { ReactNode } from "react";

interface MainLayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
  onSearchSelect: (entry: SearchEntry) => void;
  children: ReactNode;
}

export default function MainLayout({
  currentPage,
  onNavigate,
  onLogout,
  onSearchSelect,
  children,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className=" flex flex-col flex-1">
        <Topbar
          currentPage={currentPage}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onSearchSelect={onSearchSelect}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
