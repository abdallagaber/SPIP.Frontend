---
name: angular-architecture
description: Defines the project architecture, folder structure, dependency boundaries, and feature organization. Use when creating features, layouts, services, routes, and shared modules.
---

---

# Angular Architecture Skill

The application follows a feature-based architecture.

---

# Folder Structure

```text
src/
└── app/
    ├── core/
    ├── shared/
    ├── layouts/
    ├── features/
    ├── styles/
    ├── app.routes.ts
    ├── app.config.ts
    └── app.component.ts
```

---

# Core Layer

```text
core/

├── guards/
├── interceptors/
├── services/
├── constants/
├── enums/
└── models/
```

Contains:

- Authentication
- Route guards
- HTTP interceptors
- Theme management
- Global state
- Shared models

Rules:

- Imported once.
- Never depend on features.
- Contains singleton services only.

---

# Shared Layer

```text
shared/

├── ui/
├── charts/
├── icons/
├── directives/
├── pipes/
└── utils/
```

Contains:

- Reusable components
- Generic tables
- Dialogs
- Buttons
- Charts
- Pipes
- Utilities

Rules:

- No business logic.
- Reusable everywhere.
- Small and composable.

---

# Layout Layer

```text
layouts/

├── main-layout/
└── auth-layout/
```

Main layout contains:

- Sidebar
- Topbar
- Footer
- Breadcrumb

Auth layout contains:

- Login
- Register
- Public pages

---

# Features Layer

Every feature follows:

```text
feature/

├── pages/
├── components/
├── widgets/
├── services/
├── models/
└── routes.ts
```

Examples:

```text
features/

├── auth/
├── dashboard/
├── users/
├── reports/
├── settings/
└── profile/
```

Rules:

- Features must never import each other.
- Features must be lazy loaded.
- Business logic belongs inside the feature.

---

# Dependency Direction

Always follow:

```text
features
    ↓

shared
    ↓

core
```

Never violate this dependency chain.

---

# Services

Rules:

- Single responsibility.
- Use:

```ts
@Service({
  providedIn: 'root'
})
```

for global services.

- Use feature services inside the owning feature.
- Prefer:

```ts
inject();
```

over constructor injection.

---

# State Management

Rules:

- Use signals for local state.
- Use computed values.
- Use:

```ts
signal.set();

signal.update();
```

Never use:

```ts
signal.mutate();
```

State updates must remain pure and predictable.
