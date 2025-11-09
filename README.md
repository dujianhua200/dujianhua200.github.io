# Blog Title :link: https://dujianhua200.github.io

## ✨ Discovery & engagement features
- **Universal search overlay** – press `/` or use the header search button on any page to open a fuzzy search that indexes titles, descriptions, tags, and excerpts from `docs/postList.json`. Results support keyboard navigation, offline re-use (cached for the session), and highlighted matches.
- **Filterable listings** – category and tag chips on the home and tag pages allow multi-filtering. Active filters are reflected in the URL hash so links can be shared with state intact.
- **Hero insights** – site level stats (post count, tag count, site age, pageviews when available) surface at the top of listing pages for quick context.

## 📚 Reading statistics
- **Per-post reading time** – automatically calculated from `wordCount` metadata (defaults to a single-minute read when the value is missing).
- **View counts** – integrates the Busuanzi counter; results are cached locally so cards render without layout shifts. When the third-party script responds, values are synced and reused for future visits.
- **Post detail badges** – individual articles show publish date, read time, categories, tags, and live view counts above the content.

## 🛠 Configuration
All configuration stays in plain JSON so GitHub Pages can serve it directly.

| Setting | Location | Notes |
| --- | --- | --- |
| Category to label mapping | `docs/postList.json` → `meta.categoryMapping` (mirrored in `blogBase.json`) | Map GitHub labels/tags to high-level categories.
| Default category styling | `docs/postList.json` → `meta.defaultCategory` | Used when no mapping applies.
| Category metadata (color/description) | `docs/postList.json` → `meta.categories` | Optional styling and copy for each category.
| Analytics toggle | `docs/postList.json` → `meta.site.analytics.enabled`, `blogBase.json.analytics.enabled`, `config.json.analytics.enabled` | Set to `false` (or `0`) to disable the Busuanzi integration; the notice and counters disappear automatically.
| Privacy notice text | `docs/postList.json` → `meta.site.analytics.privacyNotice` | Displayed wherever counters are shown.

### Adding a new category/tag
1. Apply the desired GitHub label to the post issue.
2. Update `meta.categoryMapping` if the label should roll up to a broader category.
3. (Optional) Add a color/description entry in `meta.categories` for custom styling.
4. Regenerate `postList.json` (or update the relevant post entry) with the label so filters pick it up.

### Adjusting analytics
- To disable counters entirely: set `enabled` to `false` in `config.json`, `blogBase.json.analytics`, and `docs/postList.json.meta.site.analytics`.
- To update the privacy message: edit the `privacyNotice` string in either JSON location; the UI pulls the same text everywhere.

## 🛡 Privacy
The site uses [Busuanzi](http://busuanzi.ibruce.info/) for anonymous visitor and page view counts. No personally identifiable information is collected, and the feature can be switched off via configuration as described above.
