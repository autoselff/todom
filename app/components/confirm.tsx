"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Request = {
  title: string;
  message: string;
  action: string;
  resolve: (ok: boolean) => void;
};

export function useConfirm() {
  const [request, setRequest] = useState<Request | null>(null);

  function confirm(options: Omit<Request, "resolve">) {
    return new Promise<boolean>((resolve) => setRequest({ ...options, resolve }));
  }

  function answer(ok: boolean) {
    request?.resolve(ok);
    setRequest(null);
  }

  useEffect(() => {
    if (!request) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      answer(false);
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [request]);

  const dialog = request
    ? createPortal(
        <div
          className="modalBackdrop"
          onClick={(e) => {
            e.stopPropagation();
            answer(false);
          }}
        >
          <div
            className="modal confirm"
            role="alertdialog"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="confirm-title">{request.title}</h2>
            <p id="confirm-message">{request.message}</p>
            <div className="confirmActions">
              <button type="button" onClick={() => answer(false)} autoFocus>
                Cancel
              </button>
              <button type="button" className="danger" onClick={() => answer(true)}>
                {request.action}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return [confirm, dialog] as const;
}
