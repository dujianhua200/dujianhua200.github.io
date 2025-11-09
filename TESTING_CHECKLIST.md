# Testing Checklist for Theme Refresh

## Visual Regression Testing

### Light Mode
- [ ] Homepage renders correctly with new styles
- [ ] Post pages display properly
- [ ] Tag/search page works as expected
- [ ] Header layout is correct
- [ ] Footer displays properly
- [ ] Navigation links are styled correctly
- [ ] Avatar animation works on hover
- [ ] Button hover states work
- [ ] Labels/tags have correct colors
- [ ] Code blocks are readable
- [ ] Typography hierarchy is clear

### Dark Mode
- [ ] All pages render in dark mode
- [ ] Color contrast is adequate (WCAG AA)
- [ ] Text is readable on dark backgrounds
- [ ] Interactive elements are visible
- [ ] Hover states work in dark mode
- [ ] Links are distinguishable
- [ ] Code blocks are readable
- [ ] Border colors are visible but not harsh

### Responsive Design

#### Mobile (≤600px)
- [ ] No horizontal scrolling
- [ ] Blog title hides on mobile
- [ ] RSS button hides on mobile
- [ ] Avatar scales to 40px
- [ ] Padding is appropriate (8px)
- [ ] Font sizes are readable
- [ ] Post titles scale down
- [ ] Tag title hides on mobile
- [ ] Label time hides on mobile
- [ ] SideNav items stack properly
- [ ] Search bar is usable

#### Tablet (600-1024px)
- [ ] Layout adjusts smoothly
- [ ] Font sizes are appropriate
- [ ] Spacing is comfortable
- [ ] All elements are accessible

#### Desktop (>1024px)
- [ ] Full layout displays
- [ ] Maximum width is respected (900px)
- [ ] Spacing is generous
- [ ] All features are visible

### Component Testing

#### Header
- [ ] Displays on all pages
- [ ] Avatar loads and animates
- [ ] Title/logo is visible
- [ ] Action buttons work
- [ ] Theme switcher functions
- [ ] Search button works
- [ ] RSS link works
- [ ] Border bottom is visible

#### Navigation (SideNav)
- [ ] Post list displays correctly
- [ ] Hover states work
- [ ] Icons display properly
- [ ] Post titles truncate if too long
- [ ] Labels display with correct colors
- [ ] Date labels show (except mobile)
- [ ] Border between items is visible

#### Footer
- [ ] Copyright displays
- [ ] Links work
- [ ] Powered by message shows
- [ ] Centered alignment
- [ ] Top border is visible

#### Buttons
- [ ] Default button style works
- [ ] Invisible button style works
- [ ] Primary button style works
- [ ] Block button style works
- [ ] Hover states work
- [ ] Active states work
- [ ] Focus states are visible

#### Forms & Search
- [ ] Search input is styled
- [ ] Search button works
- [ ] Focus states work
- [ ] Input is readable
- [ ] Border radius is correct

#### Labels & Tags
- [ ] Background colors display
- [ ] Text is readable (white)
- [ ] Hover effects work
- [ ] Counter displays properly
- [ ] Border radius is consistent

### Typography Testing

#### Headings
- [ ] H1 size and weight correct
- [ ] H2 size and weight correct
- [ ] H3 size and weight correct
- [ ] H4 size and weight correct
- [ ] H5 size and weight correct
- [ ] H6 size and weight correct
- [ ] Heading spacing is appropriate
- [ ] Border bottom on H1/H2 in content

#### Body Text
- [ ] Paragraph spacing is good
- [ ] Line height is readable (1.625)
- [ ] Font size is comfortable
- [ ] Color contrast is adequate

#### Links
- [ ] Color is distinguishable
- [ ] Hover effect works
- [ ] Visited state is styled
- [ ] Underline on hover

#### Code
- [ ] Inline code has background
- [ ] Inline code is readable
- [ ] Code blocks have background
- [ ] Code blocks have border
- [ ] Code blocks are scrollable
- [ ] Font family is monospace

### Accessibility Testing

#### Keyboard Navigation
- [ ] Tab order is logical
- [ ] Focus states are visible
- [ ] All interactive elements focusable
- [ ] Skip links work (if present)

#### Color Contrast
- [ ] Text on background meets WCAG AA
- [ ] Links are distinguishable
- [ ] Interactive elements have sufficient contrast
- [ ] Disabled states are clear

#### Motion & Animation
- [ ] Reduced motion is respected
- [ ] Animations are not jarring
- [ ] Transitions are smooth
- [ ] No auto-playing animations

### Browser Testing

#### Modern Browsers
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### Functionality
- [ ] CSS custom properties work
- [ ] Flexbox layout works
- [ ] Media queries work
- [ ] Hover states work
- [ ] Transitions work

### Performance Testing

- [ ] Stylesheet loads quickly
- [ ] No render blocking
- [ ] No layout shifts
- [ ] Smooth scrolling
- [ ] Fast theme switching

### Print Testing

- [ ] Page prints correctly
- [ ] Header/footer hide in print
- [ ] Content is readable
- [ ] Links are underlined
- [ ] No color wasted

### Integration Testing

#### Gmeek Regeneration
- [ ] Stylesheet is preserved
- [ ] HTML includes stylesheet link
- [ ] Inline styles remain removed
- [ ] Configuration is respected

#### Theme Switching
- [ ] Light → Dark transition works
- [ ] Dark → Auto transition works
- [ ] Auto → Light transition works
- [ ] Theme persists on reload
- [ ] Utterances theme updates

### Edge Cases

- [ ] Very long post titles
- [ ] Many labels on one post
- [ ] Empty states
- [ ] Long code blocks
- [ ] Large images
- [ ] Many posts in list
- [ ] Special characters in titles
- [ ] Emoji rendering

## Automated Checks

### CSS Validation
```bash
# Check CSS syntax (if validator available)
css-validator docs/assets/css/site.css
```

### Link Checking
```bash
# Check for broken links
grep -r "href=" docs/*.html | grep "site.css"
```

### File Size
```bash
# Check stylesheet size
ls -lh docs/assets/css/site.css
```

### Line Count
```bash
# Verify no inline styles remain
grep -c "<style>" docs/*.html docs/**/*.html
```

## Sign-off

- [ ] All critical tests pass
- [ ] No regressions found
- [ ] Dark mode works correctly
- [ ] Mobile experience is good
- [ ] Accessibility standards met
- [ ] Documentation is complete
- [ ] Ready for deployment

## Notes

Record any issues or observations during testing:

```
[Testing notes go here]
```

## Date: _______________
## Tester: _______________
## Status: [ ] Pass / [ ] Fail / [ ] Needs Work
