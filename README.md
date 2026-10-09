# preciousani.github.io

Personal website for **Precious Oluwafemi Sani** — AI Security Engineer and researcher working across Applied AI & ML, AI Safety & Governance, Responsible AI, and Research Systems.

## 🔗 Live Site

[https://preciousani.github.io](https://preciousani.github.io)

## 🛠 Tech Stack

- **Jekyll** (built automatically by GitHub Pages on push): layouts, blog posts in Markdown, RSS feed, sitemap, SEO tags
- **Vanilla CSS**: "Security console" design system with CSS variables, dark-first theme with a light-mode toggle, and a wide-screen layout with sticky side rails for monitors ≥1600px and ≥2100px
- **Vanilla JavaScript**: ambient attack-graph canvas, cursor spotlight, ⌘K command palette, text decode effects, lightbox, the blog's table of contents and copy-code buttons, and the Hack the Bot game 🎉
- **Typography**: Space Grotesk + Inter + JetBrains Mono, plus Newsreader for long-form posts

## ✍️ Writing a blog post

1. Copy `_drafts/new-post-template.md` to `_posts/YYYY-MM-DD-your-slug.md`.
2. Fill in the front matter (`title`, `description`, `tags`) and write in Markdown.
3. Put images in `assets/images/blog/your-slug/`.
4. Commit and push. The post appears at `/blog/your-slug/`, on the homepage, in the ⌘K palette and in `/feed.xml`.

No local setup is needed: you can also add a file straight from GitHub's web UI (**Add file → Create new file** in `_posts/`).
For a rich-text editor in the browser, sign in to [Pages CMS](https://pagescms.org) with GitHub and open this repo (configured in `.pages.yml`).

**Cross-posting to Medium:** publish here first, then use Medium's *Import a story* with the post URL. Medium will set the canonical link back to this site.
The posts imported from Medium keep `canonical_url` pointing at Medium. Delete that line from a post to make this site the canonical home.

## 📂 Structure

```
├── _config.yml           Site + blog settings
├── _layouts/             default (page shell) and post templates
├── _includes/            head, header, footer, command palette, reading time
├── _posts/               Blog posts (Markdown)
├── _drafts/              Unpublished drafts + new post template
├── index.html            Homepage
├── blog/index.html       Blog index (search + tag filter)
├── 404.html
├── css/
│   ├── design-system.css Design tokens (colors, spacing, typography)
│   ├── layouts.css       Grid, nav, sections, wide-screen shell
│   ├── components.css    Cards, buttons, bento gallery, lightbox
│   ├── effects.css       Canvas, spotlight, palette, rails
│   └── blog.css          Blog index + post reading layout
├── js/
│   ├── main.js           Nav, theme, reveal, Hack the Bot
│   ├── effects.js        Visual effects + lightbox
│   ├── palette.js        ⌘K command palette
│   └── blog.js           TOC, reading progress, code copy, filters
└── assets/               Images (incl. assets/images/blog) and video
```

## 🚀 Running Locally

```bash
bundle install
bundle exec jekyll serve --livereload   # add --drafts to preview drafts
```

Then open [http://localhost:4000](http://localhost:4000).

## 📄 License

© 2026 Precious Oluwafemi Sani. All rights reserved.
