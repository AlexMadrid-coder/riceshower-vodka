# React Flow App

A production-ready starter built with **React 19**, **TypeScript** (strict), **@xyflow/react v12**, **React Router DOM v7**, and **plain CSS** — no UI frameworks, no external state managers.

## Stack

| Layer | Technology |
|---|---|
| UI library | React 19 |
| Type system | TypeScript 5 (strict) |
| Bundler | Vite 6 |
| Diagrams | @xyflow/react 12 |
| Routing | React Router DOM 7 |
| Styling | Plain CSS (CSS custom properties) |
| State | React hooks only (`useState`, `useReducer`, `useCallback`, `useMemo`) |

## Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or pnpm / yarn)

## Installation

```bash
# 1. Clone or download the project
git clone <your-repo-url>
cd <project-folder>

# 2. Install dependencies
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for production

```bash
npm run build
```

The output is in the `dist/` folder.

## Preview production build

```bash
npm run preview
```

## Project structure

```
src/
├── main.tsx                  # Entry point — mounts <App> inside <BrowserRouter>
├── App.tsx                   # Root layout with <Navbar> + <Routes>
├── App.css                   # Global layout styles
├── index.css                 # CSS custom properties (design tokens)
│
├── components/
│   ├── Navbar/
│   │   ├── Navbar.tsx        # Navigation bar with NavLink active states
│   │   └── Navbar.css
│   └── DiagramNode/
│       ├── DiagramNode.tsx   # Custom React Flow node (memoized)
│       └── DiagramNode.css
│
├── pages/
│   ├── Home/
│   │   ├── HomePage.tsx      # Landing page with useState counter demo
│   │   └── HomePage.css
│   └── Diagram/
│       ├── DiagramPage.tsx   # Fully controlled React Flow canvas
│       └── DiagramPage.css
│
├── hooks/
│   └── useCounter.ts         # Reusable counter hook (min/max support)
│
└── utils/
    └── flowUtils.ts          # Node/Edge types + initial flow data
```

## Routes

| Path | Page | Description |
|---|---|---|
| `/` | Home | Stack overview + interactive useState counter |
| `/diagram` | Diagram | Live React Flow canvas with custom nodes |

## Key React Flow implementation details

- `nodeTypes` is defined **outside** the component body to keep a stable reference (prevents unnecessary re-renders).
- The canvas uses a **controlled flow**: `onNodesChange`, `onEdgesChange`, and `onConnect` are all wired up.
- Custom nodes are wrapped in `React.memo` for performance.
- The `<ReactFlow>` container gets its dimensions from a CSS flex parent set to `flex: 1` — no hardcoded pixel heights.
- `@xyflow/react/dist/style.css` is imported in `DiagramPage.tsx` (scoped to the page that needs it).

## Verification checklist

- [ ] `npm install` completes without errors
- [ ] `npm run dev` opens without console errors
- [ ] Navigating to `/` shows the Home page with a working counter
- [ ] Navigating to `/diagram` shows the React Flow canvas with 6 nodes and 5 edges
- [ ] Nodes can be dragged and reconnected
- [ ] `npm run build` exits with code 0 (no TypeScript errors)
