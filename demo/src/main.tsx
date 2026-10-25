import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./fonts.css";
import "@/app/globals.css";
import Boards from "@/app/components/boards";
import ThemeToggle from "@/app/components/theme-toggle";
import KanbanBoard from "@/app/components/kanban/board";
import { getBoardSync, listBoardsSync } from "./store";

document.documentElement.style.setProperty("--font-inter", '"Inter Variable"');
document.documentElement.style.setProperty("--font-jetbrains", '"JetBrains Mono Variable"');

document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest?.("a");
  const href = a?.getAttribute("href");
  if (!href || !href.startsWith("/") || href.startsWith("//")) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  location.hash = href;
});

function useRoute() {
  const read = () => location.hash.replace(/^#/, "") || "/";
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onHash = () => setRoute(read());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

function Home() {
  return (
    <main className="shell boardShell">
      <div className="hero boardBar">
        <a className="brand" href="/">
          <span>todom</span>
        </a>
        <span className="crumbSep" aria-hidden="true">/</span>
        <h1 className="boardTitle">Boards</h1>
        <ThemeToggle />
      </div>
      <Boards initial={listBoardsSync()} />
    </main>
  );
}

function BoardPage({ id }: { id: string }) {
  const board = getBoardSync(id);
  if (!board) {
    return (
      <main className="shell boardShell">
        <div className="hero boardBar">
          <a className="brand" href="/">
            <span>todom</span>
          </a>
          <span className="crumbSep" aria-hidden="true">/</span>
          <h1 className="boardTitle">Not found</h1>
          <ThemeToggle />
        </div>
      </main>
    );
  }
  return (
    <main className="shell boardShell">
      <KanbanBoard initial={board} />
    </main>
  );
}

function App() {
  const route = useRoute();
  const match = route.match(/^\/board\/([^/]+)$/);
  return match ? <BoardPage key={route} id={match[1]} /> : <Home key={route} />;
}

createRoot(document.getElementById("root")!).render(<App />);
