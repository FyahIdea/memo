# Design Guide — Memo (Personal Objects Studio)

> Tài liệu này là **nguồn sự thật duy nhất** về design system. Mọi component phải tuân theo.  
> Cập nhật lần cuối: 2026-08-04

---

## 1. Triết lý & Nguyên tắc

| Nguyên tắc | Mô tả |
|---|---|
| **Tách biệt style & nội dung** | `.tsx` chỉ chứa JSX/logic. Style viết hoàn toàn trong `.module.css` |
| **CSS thuần, không framework** | Không dùng Tailwind utilities trong JSX. Chỉ `className={styles.xxx}` |
| **CSS Custom Properties** | Token định nghĩa 1 lần ở `:root` trong `index.css`, dùng lại bằng `var(--token)` |
| **Responsive bằng clamp()** | Font size dùng `clamp(min, preferred, max)` — không hardcode breakpoint |
| **Đơn vị đúng** | Font: `rem`. Spacing nội tại: `em`. Layout: `rem`. Không dùng `px` |
| **Icon: Material Symbols** | Thay hoàn toàn `lucide-react` bằng Google Material Symbols (variable font) |
| **Comment tiếng Việt** | Mọi comment trong code viết tiếng Việt |
| **clsx cho conditional class** | Dùng `clsx(styles.btn, isActive && styles['btn--active'])` |

---

## 2. Design Tokens — `src/index.css`

### Màu sắc

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--color-blue` | `#4285F4` | Primary action, accent |
| `--color-red` | `#EA4335` | Finance, danger |
| `--color-yellow` | `#FBBC05` | Tasks, warning |
| `--color-green` | `#34A853` | Notes, success |
| `--color-bg` | `#F8FAFC` | App background |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-surface-alt` | `#F1F5F9` | Secondary surface |
| `--color-border` | `#E2E8F0` | Default borders |
| `--color-text-primary` | `#0F172A` | Tiêu đề, nội dung |
| `--color-text-secondary` | `#475569` | Label phụ |
| `--color-text-muted` | `#94A3B8` | Placeholder |
| `--color-accent` | `var(--color-blue)` | Alias cho primary |
| `--color-accent-soft` | `#EBF2FF` | Nền nhẹ của accent |

### Typography

| Token | Giá trị | Tương đương |
|---|---|---|
| `--text-xs` | `clamp(0.6875rem, 0.5vw + 0.5625rem, 0.75rem)` | 11–12px |
| `--text-sm` | `clamp(0.75rem, 0.5vw + 0.625rem, 0.875rem)` | 12–14px |
| `--text-base` | `clamp(0.875rem, 0.5vw + 0.75rem, 1rem)` | 14–16px |
| `--text-md` | `clamp(1rem, 0.75vw + 0.875rem, 1.125rem)` | 16–18px |
| `--text-lg` | `clamp(1.125rem, 1vw + 0.875rem, 1.25rem)` | 18–20px |
| `--text-xl` | `clamp(1.25rem, 1.5vw + 0.875rem, 1.5rem)` | 20–24px |
| `--text-2xl` | `clamp(1.5rem, 2vw + 1rem, 2rem)` | 24–32px |

### Spacing, Radius, Transition

| Token | Giá trị |
|---|---|
| `--space-1` | `0.25em` |
| `--space-2` | `0.5em` |
| `--space-3` | `0.75em` |
| `--space-4` | `1em` |
| `--space-6` | `1.5em` |
| `--space-8` | `2em` |
| `--radius-sm` | `0.5rem` |
| `--radius-md` | `0.75rem` |
| `--radius-lg` | `1rem` |
| `--radius-xl` | `1.25rem` |
| `--radius-2xl` | `1.5rem` |
| `--radius-full` | `9999px` |
| `--transition-fast` | `150ms ease` |
| `--transition-normal` | `250ms ease` |

---

## 3. Icons — Google Material Symbols

### Cài đặt (có trong `index.html`)

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
```

### Component `Icon`

```tsx
import { Icon } from '../shared/Icon';

<Icon name="calendar_month" />           // size mặc định md
<Icon name="check_circle" size="lg" filled />   // filled variant
<Icon name="close" size="sm" />
```

### Mapping lucide-react → Material Symbols

| lucide-react | Material Symbols |
|---|---|
| `CalendarDays` | `calendar_month` |
| `FileText` | `description` |
| `CheckSquare` | `check_box` |
| `PiggyBank` | `savings` |
| `Calendar` | `event` |
| `Plus` | `add` |
| `X` | `close` |
| `ChevronLeft` | `chevron_left` |
| `ChevronRight` | `chevron_right` |
| `ArrowDown` | `expand_more` |
| `Flame` | `local_fire_department` |
| `Star` | `star` |
| `Target` | `my_location` |
| `Volume2` | `volume_up` |
| `VolumeX` | `volume_off` |
| `Layers` | `layers` |
| `Clock` | `schedule` |
| `Search` | `search` |
| `Filter` | `filter_list` |
| `Trash2` | `delete` |
| `Save` | `save` |
| `RotateCcw` | `history` |
| `Zap` | `bolt` |
| `Check` | `check` |
| `AlertCircle` | `error` |
| `GripVertical` | `drag_indicator` |
| `Pin` | `push_pin` |
| `Gift` | `redeem` |
| `Tag` | `label` |
| `Box` | `inbox` |
| `Sparkles` | `auto_awesome` |
| `RefreshCw` | `refresh` |
| `TrendingUp` | `trending_up` |
| `CreditCard` | `credit_card` |
| `ShoppingBag` | `shopping_bag` |
| `ArrowRight` | `arrow_forward` |

---

## 4. CSS Modules — Convention

### Cấu trúc file

```
ComponentName.tsx
ComponentName.module.css    ← đặt cùng thư mục với .tsx
```

### Quy tắc đặt tên class

```css
/* Block */
.sidebar { }

/* Element — camelCase (tương thích CSS Modules) */
.sidebarHeader { }
.sidebarNavItem { }

/* Modifier — dấu hai gạch ngang */
.sidebarNavItem--active { }
.sidebarNavItem--disabled { }

/* State — prefix "is" */
.card--isLoading { }
```

### Template chuẩn

```css
/* ComponentName.module.css */
/* Mô tả ngắn về component */

/* ─── Root container ──────────────────────────────────── */
.root { }

/* ─── Elements ───────────────────────────────────────── */
.header { }
.body { }
.footer { }

/* ─── Modifiers / States ─────────────────────────────── */
.root--compact { }
.item--active { }

/* ─── Responsive (dùng em thay px) ─────────────────── */
@media (max-width: 48em) {   /* 768px */
  .root { }
}
```

---

## 5. Base Components

| Component | File | Mô tả |
|---|---|---|
| `Icon` | `components/shared/Icon.tsx` | Wrapper Material Symbols |
| `Badge` | `components/shared/Badge.tsx` | Label màu nhỏ |
| `Button` | `components/shared/Button.tsx` | Nút có variants |
| `Card` | `components/shared/Card.tsx` | Container nội dung |
| `Modal` | `components/shared/Modal.tsx` | Overlay dialog base |
| `Input` | `components/shared/Input.tsx` | Text input chuẩn |

### Badge variants
- `default` (slate) — label chung
- `accent` (blue) — timeline, event
- `success` (green) — notes
- `warning` (yellow) — tasks, points
- `danger` (red) — finance
- `ghost` — subtle

### Button variants
- `primary` — CTA chính (nền blue)
- `secondary` — Hành động phụ (nền surface)
- `ghost` — Không nền, chỉ text
- `danger` — Hành động nguy hiểm

### Icon size
- `sm` = `1.125rem` (18px)
- `md` = `1.5rem` (24px) — mặc định
- `lg` = `2rem` (32px)
- `xl` = `2.5rem` (40px)

---

## 6. File Structure

```
components/
  shared/
    Icon.tsx + Icon.module.css
    Badge.tsx + Badge.module.css
    Button.tsx + Button.module.css
    Card.tsx + Card.module.css
    Modal.tsx + Modal.module.css
    Input.tsx + Input.module.css
    Sidebar.tsx + Sidebar.module.css
    Navbar.tsx + Navbar.module.css
  timeline/
    DayCard.tsx + DayCard.module.css
  notes/
    NotesView.tsx + NotesView.module.css
  tasks/
    TasksView.tsx + TasksView.module.css
    TaskSidebarPanel.tsx + TaskSidebarPanel.module.css
  finance/
    FinanceView.tsx + FinanceView.module.css
  weekly/
    WeeklyCalendarView.tsx + WeeklyCalendarView.module.css

layout/
  shared/
    MainLayout.tsx + MainLayout.module.css

pages/
  shared/
    QuickCaptureModal.tsx + QuickCaptureModal.module.css
    ObjectDetailModal.tsx + ObjectDetailModal.module.css
  timeline/
    TimelinePage.tsx + TimelinePage.module.css
```
