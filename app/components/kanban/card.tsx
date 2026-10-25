"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Card as CardType } from "@/lib/kanban";

const TONES = ["orange", "yellow", "green", "aqua", "blue", "purple", "red"];

// Badges store a tone name; older cards may still hold a raw hex color.
function badgeCss(badge: string) {
  return badge.startsWith("#") ? badge : `var(--tone-${badge})`;
}

export default function Card({
  card,
  dragging,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
}: {
  card: CardType;
  dragging: boolean;
  onUpdate: (data: { title: string; description: string }) => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [badge, setBadge] = useState(card.badgeColor);

  function close() {
    setTitle(card.title);
    setDescription(card.description);
    setBadge(card.badgeColor);
    setEditing(false);
  }

  useEffect(() => {
    if (!editing) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, card.title, card.description]);

  return (
    <article
      className={`card${dragging ? " dragging" : ""}`}
      style={
        card.badgeColor
          ? { borderLeft: `4px solid ${badgeCss(card.badgeColor)}` }
          : undefined
      }
      draggable={!editing}
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.setData("text/plain", `card:${card.id}`);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
    >
      <button type="button" className="cardBody" onClick={() => setEditing(true)}>
        <strong>{card.title}</strong>
        {card.description ? <p>{card.description}</p> : null}
      </button>

      {editing ? createPortal(
        <div className="modalBackdrop" onClick={close}>
          <form
            className="modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              const nextTitle = title.trim();
              if (!nextTitle) return;
              onUpdate({
                title: nextTitle,
                description: description.trim(),
                badgeColor: badge,
              });
              setEditing(false);
            }}
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Card title"
              autoFocus
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Card description"
              rows={5}
            />
            <div className="badgePicker" role="radiogroup" aria-label="Badge color">
              <span>Badge</span>
              <button
                type="button"
                role="radio"
                aria-checked={badge === null}
                aria-label="No badge"
                className="swatch none"
                onClick={() => setBadge(null)}
              />
              {TONES.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  role="radio"
                  aria-checked={badge === tone}
                  aria-label={tone}
                  className="swatch"
                  style={{ background: badgeCss(tone) }}
                  onClick={() => setBadge(tone)}
                />
              ))}
            </div>
            <div className="cardActions">
              <button
                type="button"
                className="deleteCard"
                onClick={() => {
                  if (confirm("Delete this card?")) onDelete();
                }}
              >
                Delete
              </button>
              <button type="button" onClick={close}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>,
        document.body,
      ) : null}
    </article>
  );
}
