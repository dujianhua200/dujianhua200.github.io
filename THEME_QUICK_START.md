# Theme Quick Start Guide

## Overview

This blog uses a custom design system built on top of Primer CSS. All custom styles are centralized in a single CSS file that uses CSS custom properties (variables) for easy maintenance.

## File Locations

- **Custom Stylesheet**: `docs/assets/css/site.css`
- **Configuration**: `blogBase.json` (look for `allHead` field)
- **Documentation**: `THEME_SYSTEM.md` (full details)

## Common Tasks

### Changing Colors

#### Primary Color (Links, Buttons)
Edit `docs/assets/css/site.css`:

```css
/* Light mode */
:root[data-color-mode="light"] {
  --color-primary: #0969da;        /* Change this */
  --color-primary-hover: #0550ae;  /* And this */
}

/* Dark mode */
:root[data-color-mode="dark"] {
  --color-primary: #58a6ff;        /* Change this */
  --color-primary-hover: #79c0ff;  /* And this */
}
```

#### Background Colors
```css
:root[data-color-mode="light"] {
  --color-bg-primary: #ffffff;     /* Main background */
  --color-bg-secondary: #f6f8fa;   /* Cards, code blocks */
  --color-bg-tertiary: #eaeef2;    /* Hover states */
}
```

### Changing Typography

#### Font Sizes
```css
:root[data-color-mode="light"] {
  --font-size-base: 1rem;      /* Body text (16px) */
  --font-size-lg: 1.125rem;    /* Slightly larger */
  --font-size-xl: 1.25rem;     /* Even larger */
}
```

#### Font Families
```css
:root[data-color-mode="light"] {
  --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", ...;
  --font-family-mono: ui-monospace, SFMono-Regular, ...;
}
```

#### Line Height
```css
body {
  line-height: var(--line-height-relaxed);  /* Currently 1.625 */
}
```

### Changing Spacing

#### Global Spacing
```css
:root[data-color-mode="light"] {
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
}
```

#### Component Spacing
Find the component in `site.css` and adjust:
```css
.SideNav-item {
  padding: var(--spacing-md);  /* Change to another spacing value */
}
```

### Changing Border Radius

```css
:root[data-color-mode="light"] {
  --radius-sm: 0.25rem;   /* 4px - subtle */
  --radius-md: 0.375rem;  /* 6px - moderate */
  --radius-lg: 0.5rem;    /* 8px - rounded */
}
```

### Adding a New Color

1. Add to both light and dark mode:
```css
:root[data-color-mode="light"] {
  --color-my-new-color: #ff6b6b;
}

:root[data-color-mode="dark"] {
  --color-my-new-color: #ff8787;
}
```

2. Use it in your styles:
```css
.my-component {
  background-color: var(--color-my-new-color);
}
```

### Modifying Responsive Breakpoints

Find the media queries in `site.css`:

```css
/* Mobile */
@media (max-width: 600px) {
  /* Small screen styles */
}

/* Tablet */
@media (max-width: 1024px) {
  /* Medium screen styles */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Large screen styles */
}
```

## Working with Gmeek

### Before Regeneration
1. Ensure `docs/assets/css/site.css` is up to date
2. Verify `blogBase.json` has the `allHead` field set correctly
3. Test locally if possible

### After Regeneration
The Gmeek build process will:
- Keep `docs/assets/` directory intact
- Include `allHead` content in all pages
- Generate clean HTML without inline styles (thanks to our config)

### Adding Per-Post Custom Styles

To add styles to a specific post, use the post's metadata in the GitHub Issue:

```json
{
  "style": ".my-post-specific-class { color: red; }"
}
```

## Testing Changes

### Local Testing
1. Open `docs/index.html` in a browser
2. Toggle dark mode (use the theme switcher)
3. Resize window to test responsive design
4. Check multiple pages (index, post, tag)

### Quick Checks
```bash
# Verify stylesheet exists
ls -lh docs/assets/css/site.css

# Check HTML files include the stylesheet
grep "site.css" docs/*.html docs/**/*.html

# Verify no inline styles remain
grep -c "<style>" docs/*.html docs/**/*.html
```

### Browser DevTools
1. Open DevTools (F12)
2. Go to Elements tab
3. Check computed styles
4. Verify CSS variables are applied
5. Test responsive design (Device Toolbar)

## Common Issues

### Styles Not Applying

**Problem**: Changes to CSS not visible
**Solution**: 
1. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check file path is correct
4. Verify no syntax errors in CSS

### Dark Mode Not Working

**Problem**: Colors don't change in dark mode
**Solution**:
1. Check `data-color-mode` attribute on `<html>` element
2. Verify both light and dark variables are defined
3. Test theme switcher JavaScript is working

### Layout Broken on Mobile

**Problem**: Horizontal scrolling or overlapping elements
**Solution**:
1. Check viewport meta tag exists
2. Verify responsive styles in media queries
3. Test at actual device width (not just resize)
4. Check for fixed widths without max-width

### Primer CSS Conflicts

**Problem**: Primer CSS overriding custom styles
**Solution**:
1. Increase specificity of custom selectors
2. Use `!important` sparingly as last resort
3. Ensure custom CSS loads after Primer
4. Consider using CSS layers (future enhancement)

## Best Practices

### DO
✅ Use CSS custom properties (variables)
✅ Define colors for both light and dark modes
✅ Test in multiple browsers
✅ Check responsive design
✅ Maintain consistent spacing scale
✅ Document complex styles
✅ Test accessibility (keyboard nav, contrast)

### DON'T
❌ Hardcode colors directly in components
❌ Use inline styles in HTML
❌ Forget to test dark mode
❌ Ignore mobile responsiveness
❌ Use arbitrary spacing values
❌ Remove vendor prefixes prematurely
❌ Forget to test in multiple browsers

## Need Help?

1. **Full Documentation**: See `THEME_SYSTEM.md`
2. **Testing Guide**: See `TESTING_CHECKLIST.md`
3. **Changes Summary**: See `REFRESH_THEME_CHANGES.md`
4. **CSS Reference**: Browse `docs/assets/css/site.css`

## Quick Reference

### Color Variables
| Variable | Light Mode | Dark Mode | Usage |
|----------|-----------|-----------|-------|
| `--color-primary` | #0969da | #58a6ff | Links, buttons |
| `--color-text-primary` | #24292f | #e6edf3 | Body text |
| `--color-bg-primary` | #ffffff | #0d1117 | Background |
| `--color-border-default` | #d0d7de | #30363d | Borders |

### Spacing Scale
| Variable | Value | Usage |
|----------|-------|-------|
| `--spacing-xs` | 4px | Tight spacing |
| `--spacing-sm` | 8px | Small gaps |
| `--spacing-md` | 16px | Default spacing |
| `--spacing-lg` | 24px | Generous spacing |
| `--spacing-xl` | 32px | Large spacing |

### Font Sizes
| Variable | Value | Usage |
|----------|-------|-------|
| `--font-size-sm` | 14px | Small text |
| `--font-size-base` | 16px | Body text |
| `--font-size-lg` | 18px | Emphasis |
| `--font-size-2xl` | 24px | Subheadings |
| `--font-size-4xl` | 36px | Page titles |

## Example: Adding a Custom Component

```css
/* 1. Add to site.css */
.my-new-component {
  /* Use existing variables */
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  
  /* Add smooth transitions */
  transition: all var(--transition-base);
}

.my-new-component:hover {
  background-color: var(--color-bg-tertiary);
  box-shadow: var(--shadow-sm);
}

/* 2. Add responsive behavior */
@media (max-width: 600px) {
  .my-new-component {
    padding: var(--spacing-sm);
  }
}
```

## Support

For issues or questions:
1. Check the full documentation in `THEME_SYSTEM.md`
2. Review the testing checklist in `TESTING_CHECKLIST.md`
3. Examine the CSS file directly for examples
4. Look at similar components for patterns

---

**Last Updated**: 2025-11-09
**Version**: 1.0
