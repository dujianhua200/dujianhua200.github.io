# Theme System Documentation

## Overview

This blog uses a modern, comprehensive design system built with CSS custom properties (CSS variables) to support both light and dark modes. The styling system is designed to be maintainable, scalable, and work harmoniously with Primer CSS.

## Architecture

### Stylesheet Organization

The custom styles are centralized in a single stylesheet:
- **Location**: `docs/assets/css/site.css`
- **Loading**: Referenced via `allHead` configuration in `blogBase.json`
- **Order**: Loaded after Primer CSS to allow overrides

### Configuration

In `blogBase.json`, the stylesheet is loaded via the `allHead` field:

```json
{
  "allHead": "<link rel='stylesheet' href='assets/css/site.css'>"
}
```

This ensures that when Gmeek regenerates the site, the custom stylesheet will be included in all pages (index, posts, and tag pages).

## Design System

### CSS Custom Properties (Design Tokens)

The design system uses CSS custom properties organized into logical categories:

#### Color System

**Light Mode Colors:**
- Primary colors: `--color-primary`, `--color-primary-hover`, `--color-primary-active`
- Semantic colors: `--color-success`, `--color-warning`, `--color-danger`, `--color-info`
- Background colors: `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-tertiary`
- Text colors: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`
- Border colors: `--color-border-default`, `--color-border-muted`, `--color-border-subtle`

**Dark Mode Colors:**
- Automatically switch when `data-color-mode="dark"` is set on the root element
- Optimized for contrast and readability in dark environments

#### Typography Scale

Font sizes follow a modular scale:
- `--font-size-xs` (12px) to `--font-size-5xl` (48px)
- Font families: `--font-family-base`, `--font-family-mono`, `--font-family-display`
- Font weights: `--font-weight-normal` to `--font-weight-bold`
- Line heights: `--line-height-tight` to `--line-height-loose`

#### Spacing Scale

Consistent spacing using a 4px base unit:
- `--spacing-xs` (4px) to `--spacing-4xl` (64px)

#### Other Design Tokens

- Border radius: `--radius-sm` to `--radius-full`
- Shadows: `--shadow-sm` to `--shadow-xl` (different values for light/dark modes)
- Transitions: `--transition-fast`, `--transition-base`, `--transition-slow`

## Component Styling

### Layout Components

1. **Body**: Centered layout with max-width, responsive padding
2. **Header**: Flexible header with title, avatar, and action buttons
3. **Footer**: Centered footer with copyright and metadata
4. **Content**: Main content area with proper spacing

### Interactive Components

1. **Buttons**: Multiple variants (default, invisible, primary, block)
2. **Navigation (SideNav)**: Styled list of posts/pages with labels
3. **Labels/Tags**: Colorful pills with hover effects
4. **Search**: Integrated search input with button

### Content Components

1. **Typography**: Enhanced heading hierarchy, improved readability
2. **Code blocks**: Styled pre/code with proper syntax highlighting support
3. **Tables**: Striped rows, bordered cells
4. **Images**: Responsive with rounded corners
5. **Blockquotes**: Left border accent

## Responsive Design

The design system includes three breakpoints:

1. **Mobile** (≤600px):
   - Reduced padding and font sizes
   - Hidden non-essential elements (blog title on mobile, RSS button)
   - Vertical layout for post cards
   - Smaller avatar size

2. **Tablet** (600-1024px):
   - Medium padding and font sizes
   - Optimized for touch targets

3. **Desktop** (>1024px):
   - Full layout with all features
   - Larger spacing and typography

## Dark Mode Implementation

Dark mode is controlled by the `data-color-mode` attribute on the `<html>` element:

```html
<html data-color-mode="light">  <!-- or "dark" -->
```

The theme switcher in the UI toggles between three states:
- `light`: Uses light theme colors
- `dark`: Uses dark theme colors  
- `auto`: Follows system preference (handled by JavaScript)

All color tokens automatically switch based on this attribute, ensuring consistent theming across all components.

## Accessibility Features

1. **Keyboard Navigation**: Visible focus states for interactive elements
2. **High Contrast Mode**: Adjusted colors for high contrast preferences
3. **Reduced Motion**: Respects user's motion preferences
4. **Color Contrast**: All text meets WCAG AA standards
5. **Print Styles**: Optimized print layout

## Maintenance Guidelines

### Adding New Colors

When adding new colors, define them for both light and dark modes:

```css
:root[data-color-mode="light"] {
  --color-new-element: #value;
}

:root[data-color-mode="dark"] {
  --color-new-element: #value;
}
```

### Creating New Components

Use existing design tokens rather than hardcoded values:

```css
.new-component {
  padding: var(--spacing-md);
  color: var(--color-text-primary);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}
```

### Responsive Design

Add breakpoints in this order (mobile-first approach):

```css
/* Mobile styles (default) */
.component { ... }

/* Tablet and up */
@media (max-width: 1024px) { ... }

/* Mobile only */
@media (max-width: 600px) { ... }

/* Desktop only */
@media (min-width: 1025px) { ... }
```

## Integration with Gmeek

Since Gmeek regenerates HTML files from GitHub Issues, styling should be configured through:

1. **blogBase.json**: Use `allHead`, `head`, `style` fields for global styles
2. **Per-post customization**: Use issue-level `head`, `style` fields
3. **Assets directory**: Store static CSS files in `docs/assets/css/`

When Gmeek rebuilds the site, it will:
- Include the `allHead` content in all pages
- Preserve the `docs/assets/` directory
- Apply the custom styles on top of Primer CSS

## Future Enhancements

Potential improvements to consider:

1. **Theme variants**: Add more color scheme options (e.g., high contrast, sepia)
2. **CSS Grid layouts**: Implement advanced grid layouts for post archives
3. **Animations**: Add subtle animations for page transitions
4. **Component library**: Document all components with usage examples
5. **CSS layers**: Use `@layer` for better cascade control with Primer CSS

## Troubleshooting

### Styles not applying

1. Check that `site.css` exists at `docs/assets/css/site.css`
2. Verify `blogBase.json` includes the stylesheet in `allHead`
3. Clear browser cache and reload
4. Check browser console for 404 errors

### Dark mode not working

1. Verify `data-color-mode` attribute is set on `<html>` element
2. Check that both light and dark mode variables are defined
3. Ensure the theme switcher JavaScript is functioning

### Responsive issues

1. Check viewport meta tag is present: `<meta name="viewport" content="width=device-width,initial-scale=1.0">`
2. Test at actual device widths, not just browser resize
3. Verify media queries are not overriding each other

## Resources

- **Primer CSS**: https://primer.style/css/
- **CSS Custom Properties**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Responsive Design**: https://web.dev/responsive-web-design-basics/
