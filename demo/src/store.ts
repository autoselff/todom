export type Card = {
  id: string;
  title: string;
  description: string;
  badgeColor: string | null;
  columnId: string;
  order: number;
};

export type Column = {
  id: string;
  title: string;
  order: number;
  cards: Card[];
};

export type Board = {
  id: string;
  title: string;
  columns: Column[];
};

type Data = { seq: number; boards: Board[] };

const KEY = "todom-demo";

function seed(): Data {
  let seq = 0;
  const id = () => String(++seq);
  const column = (title: string, cards: [string, string, string | null][]) => {
    const columnId = id();
    return {
      id: columnId,
      title,
      order: 0,
      cards: cards.map(([title, description, badgeColor], order) => ({
        id: id(),
        title,
        description,
        badgeColor,
        columnId,
        order,
      })),
    };
  };
  const boardId = id();
  const columns = [
    column("To do", [
      ["Drag me to another column", "Cards and columns can be reordered by dragging.", "blue"],
      ["Click a card to edit it", "Change the title, description or badge color.", null],
    ]),
    column("In progress", [
      ["Rename this column", "Click a column or board title to edit it inline.", "yellow"],
    ]),
    column("Done", [
      ["Try the theme toggle", "Top right corner.", "green"],
    ]),
  ].map((c, order) => ({ ...c, order }));
  return { seq, boards: [{ id: boardId, title: "Welcome", columns }] };
}

function load(): Data {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seed();
}

const data = load();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

function nextId() {
  return String(++data.seq);
}

function findBoard(id: string) {
  const board = data.boards.find((b) => b.id === id);
  if (!board) throw new Error("Board not found");
  return board;
}

function findColumn(id: string) {
  for (const board of data.boards) {
    const column = board.columns.find((c) => c.id === id);
    if (column) return { board, column };
  }
  throw new Error("Column not found");
}

function findCard(id: string) {
  for (const board of data.boards) {
    for (const column of board.columns) {
      const card = column.cards.find((c) => c.id === id);
      if (card) return { board, column, card };
    }
  }
  throw new Error("Card not found");
}

function reorder<T extends { order: number }>(list: T[]) {
  list.forEach((item, order) => (item.order = order));
}

export function listBoardsSync() {
  return data.boards.map((b) => ({ id: b.id, title: b.title }));
}

export function getBoardSync(id: string): Board | null {
  const board = data.boards.find((b) => b.id === id);
  return board ? structuredClone(board) : null;
}

export async function listBoards() {
  return listBoardsSync();
}

export async function getBoard(id: string): Promise<Board> {
  return structuredClone(findBoard(id));
}

export async function createBoard(title: string) {
  const id = nextId();
  data.boards.push({ id, title, columns: [] });
  save();
  return id;
}

export async function deleteBoard(id: string) {
  data.boards = data.boards.filter((b) => b.id !== id);
  save();
}

export async function updateBoard(id: string, patch: { title: string }) {
  Object.assign(findBoard(id), patch);
  save();
}

export async function addColumn(boardId: string, title: string) {
  const board = findBoard(boardId);
  const id = nextId();
  board.columns.push({ id, title, order: board.columns.length, cards: [] });
  save();
  return id;
}

export async function deleteColumn(id: string) {
  const { board } = findColumn(id);
  board.columns = board.columns.filter((c) => c.id !== id);
  reorder(board.columns);
  save();
}

export async function updateColumn(id: string, patch: { title: string }) {
  Object.assign(findColumn(id).column, patch);
  save();
}

export async function addCard(columnId: string, title: string, description: string) {
  const { column } = findColumn(columnId);
  const id = nextId();
  column.cards.push({
    id,
    title,
    description,
    badgeColor: null,
    columnId,
    order: column.cards.length,
  });
  save();
  return id;
}

export async function updateCard(
  id: string,
  patch: { title: string; description: string; badgeColor: string | null },
) {
  Object.assign(findCard(id).card, patch);
  save();
}

export async function deleteCard(id: string) {
  const { column } = findCard(id);
  column.cards = column.cards.filter((c) => c.id !== id);
  reorder(column.cards);
  save();
}

export async function moveCard(id: string, toColumnId: string, toIndex: number) {
  const { column: from, card } = findCard(id);
  const { column: to } = findColumn(toColumnId);
  from.cards = from.cards.filter((c) => c.id !== id);
  card.columnId = toColumnId;
  to.cards.splice(toIndex, 0, card);
  reorder(from.cards);
  reorder(to.cards);
  save();
}

export async function moveColumn(id: string, toIndex: number) {
  const { board, column } = findColumn(id);
  board.columns = board.columns.filter((c) => c.id !== id);
  board.columns.splice(toIndex, 0, column);
  reorder(board.columns);
  save();
}
