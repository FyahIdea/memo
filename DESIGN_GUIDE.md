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
| `SidebarPanel` | `components/shared/SidebarPanel.tsx` | Base panel cho các Sidebar trượt |
| `Input` | `components/shared/Input.tsx` | Text input chuẩn |
| `Checkbox` | `components/shared/Checkbox.tsx` | Ô tick chọn |
| `Radio` | `components/shared/Radio.tsx` | Lựa chọn đơn (radio button) |
| `Switch` | `components/shared/Switch.tsx` | Nút gạt bật/tắt |
| `Dropdown` | `components/shared/Dropdown.tsx` | Menu thả xuống |
| `SegmentedControl` | `components/shared/SegmentedControl.tsx` | Thanh chọn tab ngang |
| `Tooltip` | `components/shared/Tooltip.tsx` | Hint box khi hover |
| `Alert` | `components/shared/Alert.tsx` | Hộp thông báo trạng thái |
| `Avatar` | `components/shared/Avatar.tsx` | Hiển thị ảnh đại diện / icon user |

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

### TaskItem (components/tasks/TaskItem.tsx)
- `variant="default"` — Hiển thị đầy đủ chi tiết, cho phép sửa title trực tiếp, menu trạng thái khi long press. Dùng cho Timeline / DayCard.
- `variant="pool"` — Giao diện rút gọn gọn gàng hơn, font chữ nhỏ hơn, các metadata nằm ngang liên tiếp. Không sửa title trực tiếp. Chuyên dùng cho Task Pool Panel.
- Các tính năng có thể tắt bật: `disableStatusMenu`, `disableTitleEdit`, `onClick` handler.

---

## 6. File Structure

```
components/
  shared/
    Alert.tsx + Alert.module.css
    Avatar.tsx + Avatar.module.css
    Badge.tsx + Badge.module.css
    Button.tsx + Button.module.css
    Card.tsx + Card.module.css
    Checkbox.tsx + Checkbox.module.css
    Dropdown.tsx + Dropdown.module.css
    Icon.tsx + Icon.module.css
    Input.tsx + Input.module.css
    Modal.tsx + Modal.module.css
    Navbar.tsx + Navbar.module.css
    Radio.tsx + Radio.module.css
    SegmentedControl.tsx + SegmentedControl.module.css
    Sidebar.tsx + Sidebar.module.css
    SidebarPanel.tsx + SidebarPanel.module.css
    Switch.tsx + Switch.module.css
    Tooltip.tsx + Tooltip.module.css
  timeline/
    DayCard.tsx + DayCard.module.css
  notes/
    NotesView.tsx + NotesView.module.css
  tasks/
    TasksView.tsx + TasksView.module.css
    TaskItem.tsx + TaskItem.module.css
    TaskPoolPanel.tsx + TaskPoolPanel.module.css
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

---

## 7. Các Nguyên Tắc UI/UX Khắt Khe (Từ User Feedback)

Đây là những luật **BẮT BUỘC TUÂN THỦ** được đúc kết từ quá trình chỉnh sửa thực tế:

### 7.1. Clean & Cute UI
- **Tối giản & Tròn trịa**: Giao diện phải sạch sẽ, gọn gàng, các góc bo tròn dễ thương (`--radius-xl`, `--radius-full`).
- **KHÔNG HIỆU ỨNG THỪA**: Tuyệt đối **KHÔNG** dùng `box-shadow` (kể cả shadow mờ), **KHÔNG** dùng dải màu (gradient), **KHÔNG** dùng màu giảm `opacity`. Tất cả màu phải dùng biến CSS đã định nghĩa, nếu cần màu nhạt thì dùng các biến `--color-xxx-bg` (nhờ `color-mix`).
- **Typography tự nhiên**: Tuyệt đối **KHÔNG** dùng `text-transform: uppercase`, **KHÔNG** tăng `letter-spacing`. Cứ để chữ tự nhiên, dùng `font-weight` (chỉ dùng `400` hoặc `800`) để phân cấp.
- **Input Focus**: Khi click vào (focus) ô Input/Textarea, **CHỈ** đổi màu `border` sang màu primary. Tuyệt đối không thêm cái viền mờ (box-shadow) màu xanh nào cả.
- **Màu tương phản**: Chữ nằm trên **nền vàng (Yellow)** bắt buộc phải dùng **chữ trắng (White)**, không dùng chữ đen.

### 7.2. Iconography
- **Luôn dùng Icon To và Đậm**: Icon nên được ưu tiên hiển thị to, rõ ràng. Size mặc định phải là `md` (24px) trở lên.
- **Luôn dùng biến thể FILL**: Component `<Icon>` đã được thiết lập mặc định sử dụng phong cách `FILL` của Google Material Symbols. **Không** chuyển về outline trừ phi có yêu cầu đặc biệt.
- Nút tắt (Close Modal): Dùng icon `X` (close). **Khi hover**: Icon phải có hiệu ứng xoay (`rotate(90deg)`), nền (background) chuyển sang màu **xám nhạt** (`var(--color-surface-alt)`). Tuyệt đối không dùng màu đỏ cho nút đóng chuẩn.

### 7.3. Optical Alignment (Căn lề thị giác)
- **Định nghĩa**: Là việc dùng `margin-left` âm để kéo ngược khối (box) sang trái, giúp **chữ** bên trong gióng thẳng hàng với lưới (grid) của trang web như cách Google làm.
- **Luật áp dụng**: **TẮT MẶC ĐỊNH** (`opticalAlign = false`) cho mọi component (Button, Card, Badge, Input). 
- **Lý do**: Nếu bật mặc định trên một hàng ngang (flex row), các component phía sau sẽ tự động lùi vào khoảng trống của component phía trước, làm hỏng hoàn toàn khoảng cách (gap) và đè lên nhau (overlap).
- **Cách dùng**: Chỉ truyền prop `opticalAlign={true}` (hoặc dùng class toàn cục `.opticalAlign` với `margin-left: -0.75rem; margin-right: 0.75rem`) cho các component **đứng đầu dòng ở mép trái**, hoặc trong một danh sách xếp dọc (vertical list).

### 7.4. Tái sử dụng & Quy tắc Code
- **Không Hardcode**: Trước khi code cứng một thành phần UI mới (như vẽ một cái badge hay nút bằng HTML thẻ `span`, `div`), **PHẢI** kiểm tra xem trong thư mục `components/shared` đã có component đó chưa. Nếu có `<Badge>`, `<Button>`, `<Icon>` thì bắt buộc phải import và xài lại.
- **Không đụng Backend**: Nếu User báo lỗi liên quan tới backend, **chỉ** giải thích nguyên nhân và đưa ra hướng dẫn để User tự fix. Tuyệt đối **KHÔNG** tự ý chỉnh sửa file backend.
- **Comment Code**: Chỉ sử dụng tiếng Việt. Không dùng tiếng Anh.
```
