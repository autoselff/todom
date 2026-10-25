"use client";

import { useState } from "react";
import { useConfirm } from "./confirm";
import {
  createBoard as createBoardAction,
  deleteBoard as deleteBoardAction,
} from "@/lib/kanban";

export default function Boards({
  initial,
}: {
  initial: { id: string; title: string }[];
}) {
  const [boards, setBoards] = useState(initial);
  const [title, setTitle] = useState("");
  const [confirm, confirmDialog] = useConfirm();

  async function add() {
    const next = title.trim();
    if (!next) return;
    setTitle("");
    const id = await createBoardAction(next);
    setBoards((list) => [...list, { id, title: next }]);
  }

  async function remove(board: { id: string; title: string }) {
    const ok = await confirm({
      title: "Delete board?",
      message: `“${board.title}” and all its cards will be permanently deleted.`,
      action: "Delete",
    });
    if (!ok) return;
    setBoards((list) => list.filter((b) => b.id !== board.id));
    deleteBoardAction(board.id);
  }

  return (
    <div className="boardGrid">
      {boards.map((board) => (
        <article key={board.id} className="panel boardTile">
          <a href={`/board/${board.id}`}>{board.title}</a>
          <button
            type="button"
            className="iconBtn"
            aria-label={`Delete ${board.title}`}
            onClick={() => remove(board)}
          >
            ×
          </button>
        </article>
      ))}
      <form
        className="panel addBoard"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New board"
          aria-label="New board title"
        />
        <button type="submit">Add board</button>
      </form>
      {confirmDialog}
    </div>
  );
}
