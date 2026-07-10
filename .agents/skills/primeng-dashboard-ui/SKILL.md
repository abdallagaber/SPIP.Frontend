---
name: primeng-dashboard-ui
description: Builds dashboards, charts, forms, tables, and responsive pages using PrimeNG 22, Tailwind CSS, ApexCharts, and Lucide icons.
---

---

# PrimeNG Dashboard UI Skill

Stack:

- PrimeNG 22.0.0-rc.1
- Tailwind CSS
- ApexCharts
- Lucide Angular

---

# PrimeNG Rules

Always prefer PrimeNG components.

Preferred components:

- Table
- Button
- Dialog
- Drawer
- Toast
- Tooltip
- InputText
- Select
- DatePicker
- Tabs
- Menu
- Breadcrumb

Avoid rebuilding components already available in PrimeNG.

---

# Tailwind Rules

Use Tailwind for:

- Layout
- Spacing
- Typography
- Grid
- Flexbox
- Responsive behavior

Preferred spacing:

```text
p-4
p-6
gap-4
gap-6
space-y-6
rounded-xl
shadow-sm
```

Avoid custom CSS unless necessary.

---

# Icons

Use Lucide icons by default.

Avoid PrimeIcons unless required by PrimeNG.

---

# Charts

Reusable charts belong in:

```text
shared/charts/
```

Structure:

```text
shared/charts/

├── line-chart/
├── bar-chart/
├── pie-chart/
├── donut-chart/
└── area-chart/
```

Every chart component must accept:

```ts
series;
categories;
title;
height;
```

Requirements:

- Responsive.
- Tooltip support.
- Loading state.
- Empty state.
- Error state.

---

# Dashboard Layout

Use this order:

```text
Page Header

Filters

Statistics Cards

Charts

Tables

Recent Activity
```

Dashboard widgets belong in:

```text
features/dashboard/widgets/
```

Examples:

```text
statistics-cards/

revenue-chart/

users-chart/

sales-chart/

activity-feed/

latest-orders/
```

---

# Responsive Design

Support:

- Mobile
- Tablet
- Desktop

Breakpoints:

```text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

# UI Principles

The interface must be:

- Modern
- Minimal
- Consistent
- Accessible
- Fast

Use:

- Skeleton loaders
- Empty states
- Error states
- Subtle animations

Avoid:

- Heavy motion
- Deep nesting
- Visual clutter
