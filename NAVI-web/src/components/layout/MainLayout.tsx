import Sidebar, { type PageId } from "./Sidebar";
import Topbar from "./Topbar";
import type { ReactNode } from "react";

interface MainLayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  children: ReactNode;
}

export default function MainLayout({
  currentPage,
  onNavigate,
  children,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className=" flex flex-col flex-1">
        <Topbar currentPage={currentPage} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
