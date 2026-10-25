## todom

Minimal self-hosted Kanban board for planning and tracking tasks. Next.js, React, TypeScript and PostgreSQL, with a soft gruvbox-inspired light and dark theme.

<img width="3840" height="2108" alt="todom screenshot" src="https://github.com/user-attachments/assets/9a56928b-beb1-43da-9e89-8ec234fd46fd" />
<img width="3840" height="2109" alt="todom screenshot" src="https://github.com/user-attachments/assets/ea2a3e6d-2787-4ad9-ba27-fc6387f05705" />
<img width="3840" height="2108" alt="todom screenshot" src="https://github.com/user-attachments/assets/d1f87348-c1df-43a2-9499-2292883484e6" />

### Features

- Boards, columns and cards with drag and drop
- Inline editing for board and column names
- Colored card badges
- Light and dark theme that follows your system

### Getting started

Requires Docker and Node.js.

```
make setup # start postgres, create .env, install deps, sync schema
make up    # start db + dev server on http://localhost:3000
make down  # stop db
make db    # start postgres only
```
