# Assets Directory

This directory contains static assets for the blog that are served directly by GitHub Pages.

## Structure

```
assets/
└── css/
    └── site.css    # Custom theme stylesheet
```

## Files

### css/site.css
The main custom stylesheet for the blog. Contains:
- CSS custom properties (design tokens)
- Component styles
- Layout styles
- Responsive design rules
- Light/dark mode support
- Accessibility enhancements

**Size**: ~916 lines
**Load order**: After Primer CSS
**Referenced in**: All HTML pages via `<link>` tag

## Maintenance

### Editing Styles
To modify the theme, edit `css/site.css`. See the root-level documentation for details:
- `THEME_SYSTEM.md` - Complete theme documentation
- `THEME_QUICK_START.md` - Quick reference guide

### Gmeek Integration
This directory is preserved during Gmeek regeneration. The stylesheet is included in all pages via the `allHead` field in `blogBase.json`.

### Adding New Assets
To add new assets (images, fonts, JS files):
1. Create appropriate subdirectories (e.g., `assets/images/`, `assets/js/`)
2. Add files to the subdirectory
3. Reference them in HTML or CSS using relative paths
4. Verify they load correctly before regenerating with Gmeek

## File Paths

### From Root Pages
```html
<link href="assets/css/site.css" rel="stylesheet">
```

### From Post Pages
```html
<link href="../assets/css/site.css" rel="stylesheet">
```

### From CSS (for other assets)
```css
background-image: url('../images/background.jpg');
```

## Best Practices

1. **Organize by type**: Keep CSS, JS, images in separate subdirectories
2. **Optimize files**: Minify CSS/JS for production (if needed)
3. **Use relative paths**: Ensure paths work from different page depths
4. **Version control**: Track all assets in git
5. **Test thoroughly**: Verify assets load after Gmeek regeneration

## Do Not

- ❌ Don't put generated HTML files here
- ❌ Don't put temporary files here
- ❌ Don't hardcode absolute URLs when relative paths work
- ❌ Don't commit large binary files without compression

## Future Expansion

Possible additions:
- `assets/js/` - Custom JavaScript
- `assets/images/` - Blog images and graphics
- `assets/fonts/` - Custom web fonts
- `assets/icons/` - SVG icons or favicon sets

---

**Note**: This directory is intentionally kept simple. The blog primarily uses Primer CSS and inline SVG icons, with custom styling in `site.css`.
