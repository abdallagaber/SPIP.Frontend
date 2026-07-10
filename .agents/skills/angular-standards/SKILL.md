---
name: angular-standards
description: Defines Angular v22, TypeScript, accessibility, and code-quality standards. Use when generating components, directives, pipes, routes, templates, forms, and services.
---

---

# Angular Standards Skill

This project uses Angular v22, TypeScript strict mode, Signals, PrimeNG, Tailwind CSS, ApexCharts, and Lucide icons.

Always prioritize:

- Maintainability
- Scalability
- Performance
- Accessibility
- Type safety
- Readability

---

# TypeScript Rules

## General

- Enable strict type checking.
- Prefer type inference when the type is obvious.
- Never use `any`.
- Use `unknown` when the type is uncertain.
- Prefer immutable patterns.
- Extract reusable interfaces and types.
- Avoid unnecessary generics.

## Naming

- Use `PascalCase` for classes, interfaces, enums, and types.
- Use `camelCase` for variables, methods, signals, and functions.
- Use descriptive names.

Examples:

```ts
readonly currentUser = signal<User | null>(null);

type ApiResponse<T> = {
  data: T;
  message: string;
};
```

---

# Angular Rules

## Components

- Use standalone components only.
- Never add:

```ts
standalone: true;
```

- Never add:

```ts
changeDetection: ChangeDetectionStrategy.OnPush;
```

because Angular v22 already uses OnPush by default.

- Keep components small.
- Components must have a single responsibility.
- Extract reusable UI into `shared/ui`.

---

## Inputs & Outputs

Always prefer:

```ts
readonly user = input.required<User>();

readonly saved = output<User>();
```

Avoid:

```ts
@Input()
@Output()
```

---

## Dependency Injection

Always use:

```ts
private readonly authService = inject(AuthService);
```

Avoid constructor injection whenever possible.

---

## Host Bindings

Never use:

```ts
@HostBinding()

@HostListener()
```

Use:

```ts
@Component({
  host: {
    '[class.active]': 'isActive()',
    '(click)': 'onClick()'
  }
})
```

---

# Templates

Use Angular control flow:

```html
@if () @for () @switch ()
```

Never use:

```html
*ngIf *ngFor *ngSwitch
```

Avoid:

```html
[ngClass] [ngStyle]
```

Use:

```html
[class.selected] [style.width.px]
```

Rules:

- Keep templates simple.
- Avoid business logic.
- Avoid deeply nested conditions.
- Prefer computed signals.

---

# Forms

Preferred order:

1. Signal Forms (`@angular/forms/signals`)
2. Reactive Forms

Avoid template-driven forms.

Signal Forms should provide:

- Type safety
- Validation
- Predictable state
- Schema-driven forms

---

# Images

Always use:

```ts
NgOptimizedImage;
```

Rules:

- Use for all static assets.
- Do not use with inline base64 images.
- Provide width and height.
- Always provide alt text.

---

# Accessibility

All generated code MUST:

- Pass AXE checks.
- Follow WCAG AA.
- Support keyboard navigation.
- Have visible focus states.
- Maintain color contrast.
- Use semantic HTML.
- Include ARIA labels when needed.

Before finishing a task, verify:

- Focus management.
- Screen reader compatibility.
- Interactive element accessibility.

---

# Performance

- Lazy load features.
- Use signals.
- Use computed state.
- Avoid unnecessary subscriptions.
- Avoid unnecessary re-renders.
- Use async pipe for observables.
