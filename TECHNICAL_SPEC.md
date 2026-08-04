# Đặc Tả Kỹ Thuật — Memo (Personal Objects Studio)

> **Cập nhật lần cuối**: 2026-08-04  
> **Phiên bản**: 1.0.0  
> Tài liệu này phục vụ mục đích bảo trì, nâng cấp và vibe coding. Đọc trước khi thêm tính năng mới hoặc refactor.
> **LƯU Ý QUAN TRỌNG VỀ STYLING:** Dự án sử dụng **CSS Modules thuần** (`.module.css`). Tuyệt đối KHÔNG sử dụng các framework như Tailwind, Bootstrap và KHÔNG dùng inline styles hay các class của Tailwind.

---

## 1. Tổng Quan Hệ Thống

**Memo** là ứng dụng quản lý cá nhân theo mô hình "Object-based": mọi thứ (note, task, event, mục tiêu tài chính...) đều là một **Object** có type rõ ràng và schema cố định.

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | Vite port 3000 |
| Styling | CSS Modules thuần | Cấu hình token qua `index.css` |
| State | React Context API (`AppContext`) | Không dùng Redux/Zustand |
| Storage | `localStorage` | Migration sang Firestore về sau |
| Backend | Express.js (TypeScript) | Port 3001, chỉ proxy AI |
| AI | Gemini 2.0 Flash (`@google/genai`) | API key bảo mật qua backend |
| Icons | Material Symbols | Ưu tiên icon size lớn |
| Âm thanh | Web Audio API (custom `sound.ts`) | |

---

## 2. Cấu Trúc Thư Mục

```
memo/
├── src/                            # Toàn bộ frontend source
│   ├── App.tsx                     # Shell: AppProvider + AppRouter (< 35 dòng)
│   ├── main.tsx                    # Entry point React DOM
│   ├── index.css                   # Design tokens, global css
│   ├── types.ts                    # Tất cả TypeScript interfaces/types
│   │
│   ├── contexts/
│   │   └── AppContext.tsx          # Global state + tất cả handlers (dùng useApp())
│   │
│   ├── layout/
│   │   └── shared/
│   │       └── MainLayout.tsx      # Shell: Sidebar + Header + Modals + Footer
│   │
│   ├── pages/                      # Mỗi tab = 1 page file
│   │   ├── shared/                 # Modal dùng chung toàn app
│   │   │   ├── QuickCaptureModal.tsx
│   │   │   └── ObjectDetailModal.tsx
│   │   ├── timeline/
│   │   │   └── TimelinePage.tsx
│   │   ├── notes/
│   │   │   └── NotesPage.tsx
│   │   ├── tasks/
│   │   │   └── TasksPage.tsx
│   │   ├── finance/
│   │   │   └── FinancePage.tsx
│   │   └── weekly/
│   │       └── WeeklyPage.tsx
│   │
│   ├── components/                 # UI components tái sử dụng
│   │   ├── shared/                 # Dùng chung nhiều trang
│   │   │   ├── Sidebar.tsx         # Navigation sidebar (desktop + mobile)
│   │   │   └── Navbar.tsx          # (Prototype cũ, chưa dùng)
│   │   ├── timeline/
│   │   │   └── DayCard.tsx         # Card hiển thị một ngày (events, tasks, notes)
│   │   ├── notes/
│   │   │   └── NotesView.tsx       # View quản lý notes & quick notes
│   │   ├── tasks/
│   │   │   ├── TasksView.tsx       # View quản lý tasks
│   │   │   └── TaskSidebarPanel.tsx # Task pool sliding panel
│   │   ├── finance/
│   │   │   └── FinanceView.tsx     # View Finance (jars, goals, rewards...)
│   │   └── weekly/
│   │       └── WeeklyCalendarView.tsx # Weekly time-blocking grid
│   │
│   ├── data/
│   │   └── initialData.ts          # Seed data mặc định + helper getTodayStr()
│   │
│   └── utils/
│       ├── storage.ts              # localStorage CRUD + AppState interface
│       ├── helpers.ts              # Utility functions (format, color...)
│       └── sound.ts                # Web Audio API sounds
│
├── server/                         # Backend Express (TypeScript)
│   ├── index.ts                    # Entry: mount routes, CORS, listen
│   ├── middleware/
│   │   └── cors.ts                 # CORS config
│   └── routes/
│       ├── health.ts               # GET /api/health
│       └── ai.ts                   # POST /api/ai/chat (Gemini proxy)
│
├── reference/                      # Tài liệu tham khảo, prototype cũ
├── assets/                         # Assets tĩnh
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 3. Data Model (types.ts)

Tất cả objects đều kế thừa `BaseObject`:

```typescript
interface BaseObject {
  id: string;        // unique, format: `${type}-${Date.now()}`
  type: ObjectType;  // phân biệt loại object
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

### Các ObjectType hiện có

| Type | Interface | Mô tả |
|---|---|---|
| `quick_note` | `QuickNoteObject` | Ghi chú nhanh gắn với ngày |
| `note` | `NoteObject` | Ghi chú có box, tags, subitems |
| `task` | `TaskObject` | Task nhiều ngày (dayRelations) |
| `event` | `EventObject` | Sự kiện có giờ |
| `box` | `BoxObject` | Nhóm/category cho notes |
| `tag` | `TagObject` | Label màu sắc |
| `jar` | `JarObject` | Hũ ngân sách hàng tháng |
| `savings_goal` | `SavingsGoalObject` | Mục tiêu tiết kiệm |
| `big_purchase` | `BigPurchaseObject` | Ghi lại mua sắm lớn |
| `online_expense` | `OnlineExpenseObject` | Chi phí dịch vụ online |
| `reward` | `RewardObject` | Phần thưởng mở khóa bằng điểm |
| `daily_note` | `DailyNoteObject` | Container một ngày (mood, highlight) |

### TaskObject — Nhiều-nhiều với ngày

```typescript
interface TaskObject extends BaseObject {
  dayRelations: Record<string, TaskDayConfig>; // dateStr -> config
}
interface TaskDayConfig {
  status: 'todo' | 'done' | 'in_progress' | 'cancelled';
  durationMinutes?: number;
  innerNote?: string;
}
```

---

## 4. State Management (AppContext)

File: `src/contexts/AppContext.tsx`

### Cách dùng trong component

```typescript
import { useApp } from '../../contexts/AppContext';

const MyComponent = () => {
  const { appState, handleAddTask, setInspectedObject } = useApp();
  // ...
};
```

### AppState (từ storage.ts)

```typescript
interface AppState {
  boxes: BoxObject[];
  tags: TagObject[];
  events: EventObject[];
  tasks: TaskObject[];
  quickNotes: QuickNoteObject[];
  notes: NoteObject[];
  jars: JarObject[];
  savingsGoals: SavingsGoalObject[];
  bigPurchases: BigPurchaseObject[];
  onlineExpenses: OnlineExpenseObject[];
  rewards: RewardObject[];
  gamification: GamificationState;
}
```

### UI State trong Context

| State | Kiểu | Mô tả |
|---|---|---|
| `activeTab` | `ActiveTab` | Tab đang hiển thị |
| `soundOn` | `boolean` | Bật/tắt sound effects |
| `isQuickCaptureOpen` | `boolean` | Modal quick capture |
| `isSidebarPanelOpen` | `boolean` | Task pool panel |
| `inspectedObject` | `any \| null` | Object đang inspect |
| `showStreakModal` | `boolean` | Modal streak/gamification |
| `minOffset` / `maxOffset` | `number` | Timeline date range |

---

## 5. Routing (Tab-based)

App dùng **tab routing nội bộ** (không dùng React Router), quản lý qua `activeTab` trong AppContext.

```
activeTab === 'timeline' → TimelinePage
activeTab === 'notes'    → NotesPage
activeTab === 'tasks'    → TasksPage
activeTab === 'finance'  → FinancePage
activeTab === 'weekly'   → WeeklyPage
```

> **Khi cần thêm tab mới:**
> 1. Thêm vào `ActiveTab` type trong `Sidebar.tsx`
> 2. Thêm tab vào array `tabs` trong `Sidebar.tsx`
> 3. Tạo `pages/<module>/<Name>Page.tsx`
> 4. Thêm route trong `App.tsx`

---

## 6. Storage (localStorage → Firebase migration path)

### Hiện tại: localStorage

File: `src/utils/storage.ts`

- Keys: prefix `memo_*` (ví dụ: `memo_tasks`)
- Auto-save: `useEffect` trong AppContext chạy mỗi khi `appState` thay đổi
- Reset: xóa tất cả keys và seed lại data mặc định

### Kế hoạch migration sang Firebase

```
Phase 1 (hiện tại):  localStorage                      Done
Phase 2 (sắp tới):   localStorage + Firebase SDK      Frontend trực tiếp gọi Firestore
Phase 3 (sau):       Full Firestore + Storage          Bỏ localStorage
```

**Khi migrate Phase 2:**
1. Cài `firebase` package: `npm install firebase`
2. Tạo `src/lib/firebase.ts` (init Firebase app)
3. Thay `safeGetItem/safeSetItem` trong `storage.ts` bằng Firestore calls
4. Upload file/ảnh dùng `firebase/storage` trực tiếp từ frontend

---

## 7. Backend API

Server: `server/index.ts`, port **3001**

| Endpoint | Method | Mô tả |
|---|---|---|
| `/api/health` | GET | Kiểm tra server alive |
| `/api/ai/chat` | POST | Proxy Gemini AI |

### POST /api/ai/chat

Request body:
```json
{
  "prompt": "string (required)",
  "context": "any (optional) - app state context"
}
```

Response:
```json
{ "text": "string" }
```

---

## 8. Conventions & Rules

### Đặt tên file
- Components: `PascalCase.tsx` (ví dụ: `DayCard.tsx`)
- Utilities: `camelCase.ts` (ví dụ: `helpers.ts`)
- Pages: `<Name>Page.tsx`
- Layout: `<Name>Layout.tsx`

### Import paths
- Component trong subfolder → dùng `../../` để lên src root
- Từ `pages/` → `../../components/`, `../../contexts/`, `../../utils/`
- Từ `components/<module>/` → `../../types`, `../../utils/`

### CSS / Styling
- **Không sử dụng framework CSS (như Tailwind, Bootstrap)** — viết CSS Modules thuần (ví dụ `Card.module.css`).
- **Màu sắc**: Dùng biến màu định nghĩa trong `index.css` (CSS Custom Properties).
- **Đơn vị**: Font size dùng `rem` hoặc `clamp`, spacing dùng `em` hoặc `rem`. Không dùng `px`.
- **Không**: box-shadow phức tạp, opacity gradient, uppercase text (trừ badge), letter-spacing lớn.
- **Icon**: Material Symbols, dùng qua component `<Icon />`.Ưu tiên size `md` (24px) hoặc `lg` (32px).

### Thêm component mới
1. Kiểm tra `components/shared/` có sẵn chưa (Badge, Modal, Button...)
2. Nếu chưa có → tạo mới trong subfolder module phù hợp
3. Nếu dùng chung → đặt vào `components/shared/`

### Comment code
- **Comment bằng tiếng Việt**
- Comment giải thích *tại sao*, không phải *cái gì*

### State & Handlers
- **Không prop-drill** — dùng `useApp()` hook để lấy state/handlers
- Tất cả handlers đặt trong `AppContext.tsx`
- Logic nghiệp vụ đặt trong handlers, không đặt trong component

---

## 9. Chạy Development

```bash
# Frontend
npm run dev          # Vite dev server tại :3000

# Backend (riêng terminal)
npx tsx server/index.ts   # Express tại :3001
# hoặc thêm script vào package.json:
# "server": "tsx server/index.ts"
```

### Biến môi trường (.env)
```
GEMINI_API_KEY=...   # Bắt buộc cho backend AI
APP_URL=...          # URL production
```

---

## 10. Thêm Tính Năng Mới — Checklist

Khi thêm một tính năng mới (ví dụ: Habits tracking):

- [ ] Định nghĩa ObjectType mới trong `types.ts`
- [ ] Thêm vào `AppState` trong `storage.ts`
- [ ] Thêm handlers trong `AppContext.tsx`
- [ ] Tạo seed data trong `data/initialData.ts`
- [ ] Tạo component trong `components/<module>/`
- [ ] Tạo page trong `pages/<module>/<Name>Page.tsx`
- [ ] Thêm tab vào `Sidebar.tsx` (nếu là trang mới)
- [ ] Thêm route trong `App.tsx`
- [ ] Cập nhật tài liệu này
