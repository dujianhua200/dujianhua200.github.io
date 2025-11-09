# Tech Insights Blog :link: https://dujianhua200.github.io 

A modern static blog built with [Gmeek](https://github.com/Meekdai/Gmeek) static site generator, featuring custom styling, enhanced SEO, and automated GitHub Actions deployment.

## 📊 Blog Statistics
### :page_facing_up: [2](https://dujianhua200.github.io/tag.html) 
### :speech_balloon: 0 
### :hibiscus: 11 
### :alarm_clock: 2025-11-08 22:44:42 

## 🚀 Features

- **Modern Design**: Custom CSS and JavaScript for enhanced user experience
- **Responsive Layout**: Mobile-first design with Primer CSS framework
- **SEO Optimized**: Enhanced meta tags, structured data, and performance optimizations
- **Dark/Light Theme**: Manual theme switching with localStorage persistence
- **Social Integration**: External links to GitHub, LinkedIn, and Twitter
- **Automated Deployment**: GitHub Actions workflow for continuous integration
- **Asset Preservation**: Custom assets protected during automatic regeneration

## 📁 Project Structure

```
├── config.json          # Main blog configuration
├── blogBase.json        # Generated blog metadata and settings
├── backup/              # Markdown backups of GitHub Issues
├── docs/                # Generated static site
│   ├── assets/          # Custom CSS, JS, and images (preserved)
│   ├── post/           # Generated blog posts
│   ├── index.html      # Homepage
│   ├── tag.html        # Tag archive page
│   └── rss.xml         # RSS feed
├── .github/
│   └── workflows/
│       └── Gmeek.yml   # Automated build and deployment
└── README.md           # This file
```

## ⚙️ Configuration

### Main Configuration (`config.json`)

```json
{
    "title": "Tech Insights Blog",
    "subTitle": "Exploring technology, development, and digital innovation",
    "avatarUrl": "https://github.githubassets.com/favicons/favicon.svg",
    "GMEEK_VERSION": "last",
    "email": "blog@techinsights.com"
}
```

### Advanced Configuration (`blogBase.json`)

Key configurable fields:

- **`startSite`**: Welcome message displayed on the homepage
- **`bottomText`**: Footer text with copyright and attribution
- **`exlink`**: External social media links
- **`labelColorDict`**: Color scheme for post labels/tags
- **`script`/`style`**: Custom JavaScript and CSS asset references
- **`head`/`allHead`**: Custom HTML head elements for SEO
- **`iconList`**: Navigation icon mappings

#### Custom Assets

The configuration references custom assets in `docs/assets/`:

- `assets/css/custom.css` - Global custom styles
- `assets/css/home.css` - Homepage-specific styles  
- `assets/js/main.js` - Global JavaScript functionality
- `assets/js/home.js` - Homepage-specific JavaScript

## 🛠️ Maintenance Guide

### Preserving Custom Assets During Updates

The GitHub Actions workflow automatically preserves the `docs/assets/` directory during regeneration:

1. **Before regeneration**: Assets are backed up to temporary storage
2. **During regeneration**: Gmeek rebuilds the site
3. **After regeneration**: Custom assets are restored

### Manual Regeneration

To manually regenerate the site without losing custom assets:

```bash
# Backup custom assets
cp -r docs/assets /tmp/backup_assets

# Run Gmeek regeneration (follow official Gmeek documentation)
# ...

# Restore custom assets
cp -r /tmp/backup_assets docs/assets
rm -rf /tmp/backup_assets
```

### Adding New Custom Assets

1. Create your CSS/JS files in `docs/assets/` subdirectories
2. Update `blogBase.json` to reference new assets:
   - Add `<link rel="stylesheet" href="assets/css/your-file.css">` to `style` or `indexStyle`
   - Add `<script src="assets/js/your-file.js"></script>` to `script` or `indexScript`
3. Commit changes to trigger automatic deployment

### Updating Configuration

1. **Basic settings**: Edit `config.json` for title, subtitle, avatar
2. **Advanced settings**: Edit `blogBase.json` for colors, assets, SEO, etc.
3. **Commit changes** to trigger automatic rebuild and deployment

### Theme Customization

Update the color palette in `blogBase.json`:

```json
{
    "labelColorDict": {
        "documentation": "#0969da",
        "tutorial": "#1f883d",
        "news": "#bc4c00",
        "feature": "#A333D0"
    },
    "yearColorList": ["#0969da", "#1f883d", "#bc4c00", "#A333D0"],
    "commentLabelColor": "#0969da"
}
```

## 🔄 Automated Workflow

The blog is automatically rebuilt when:

- **New GitHub Issue** is created or edited (becomes a blog post)
- **Manual workflow dispatch** is triggered
- **Scheduled daily** at 16:00 UTC

The workflow:
1. Clones the latest Gmeek source code
2. Backs up custom assets
3. Regenerates the site from GitHub Issues
4. Restores custom assets
5. Commits and deploys to GitHub Pages

## 📝 Content Management

Blog posts are managed through GitHub Issues:

1. Create a new issue in the repository
2. Use labels to categorize content (documentation, tutorial, news, etc.)
3. The issue automatically becomes a blog post
4. Markdown content is backed up in the `backup/` directory

## 🎨 Customization Tips

### Adding New Label Colors

Edit `labelColorDict` in `blogBase.json`:

```json
{
    "labelColorDict": {
        "your-label": "#your-color-hex"
    }
}
```

### Custom SEO Meta Tags

Add to `allHead` in `blogBase.json`:

```json
{
    "allHead": "<meta name=\"your-meta\" content=\"your-value\">"
}
```

### External Links

Update `exlink` in `blogBase.json`:

```json
{
    "exlink": {
        "Your Platform": "https://your-profile-url"
    }
}
```

## 📄 License

This blog configuration is open source. Please refer to the Gmeek project license for the generator framework.

## 🤝 Contributing

1. Fork the repository
2. Create a new issue for blog content
3. Submit pull requests for configuration improvements
4. Ensure custom assets are properly referenced in configuration

---

Built with ❤️ using [Gmeek](https://github.com/Meekdai/Gmeek) static site generator.