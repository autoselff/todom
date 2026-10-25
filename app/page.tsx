import Boards from "./components/boards";
import ThemeToggle from "./components/theme-toggle";
import { listBoards } from "@/lib/kanban";

export const dynamic = "force-dynamic";

export default async function Home() {
  const boards = await listBoards();

  return (
    <main className="shell boardShell" suppressHydrationWarning>
      <div className="hero boardBar">
        <a className="brand" href="/">todom</a>
        <span className="crumbSep" aria-hidden="true">/</span>
        <h1 className="boardTitle">Boards</h1>
        <ThemeToggle />
      </div>
      <Boards initial={boards} />
    </main>
  );
}
