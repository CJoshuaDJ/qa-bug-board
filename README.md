# BugBoard

A QA bug tracker for reporting, prioritizing, and resolving issues on a kanban-style board.

Built as a portfolio project by Carl Joshua De Jesus.

## Features

- Report, edit, and delete bugs
- Capture steps to reproduce, expected vs actual results, environment, and reporter
- Severity levels: Critical, High, Medium, Low
- Status workflow: Open → In progress → Fixed → Won't fix → Closed
- Kanban board by status
- Drag and drop cards between columns
- Search plus status and severity filters
- Dashboard stats
- Sample seed data on first visit
- Data saved in browser `localStorage` (no backend required for v1)

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Getting started

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually http://localhost:5173).

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run preview` — preview production build

## Future ideas

- Attachments / screenshots
- Auth + cloud sync
- Export to CSV
- Reorder within a column
