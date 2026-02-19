# Digilight India - Dynamic Blog System Documentation

## Overview

The Digilight blog is now **fully dynamic** and powered by **Netlify CMS**. You can create, edit, and publish blog posts from `/admin` without touching any HTML code.

---

## How It Works

### 1. **Content Management**
- All blog posts are stored as Markdown files in `/blog/posts/`
- Posts are created/edited via Netlify CMS at `/admin`
- Frontmatter metadata includes: title, date, description, thumbnail, category

### 2. **Dynamic Display**
- `blog.html` automatically loads all posts from `/blog/posts/`
- Posts are displayed as premium cards with images, titles, descriptions
- Sorted by date (newest first)

### 3. **Full Article Pages**
- Clicking any post opens `/blog/post.html?slug=post-name`
- Markdown content is converted to HTML dynamically
- Premium layout with CTA, author box, and FAQ sections

---

## File Structure

```
digilight-premium/
├── admin/
│   ├── index.html          # Netlify CMS dashboard
│   └── config.yml          # CMS configuration
├── blog/
│   ├── posts/              # Markdown blog posts
│   │   └── sample-post.md
│   ├── load-posts.js       # Dynamic post loader for blog.html
│   ├── posts-index.json    # Index of all posts
│   ├── post.html           # Dynamic single post viewer
│   └── blog-style.css      # Premium blog styling
├── blog.html               # Blog listing page (dynamic)
└── netlify.toml            # Netlify configuration
```

---

## Creating a New Blog Post

### Step 1: Access Admin Dashboard
1. Go to `https://digilightindia.netlify.app/admin`
2. Login with your Netlify Identity credentials

### Step 2: Create New Post
1. Click **"Blog Posts"** → **"New Blog Post"**
2. Fill in the fields:
   - **Title**: Post headline
   - **Publish Date**: Publication date
   - **Featured Image**: Upload or select image
   - **Description (SEO)**: Meta description for SEO
   - **Body Content**: Write in Markdown

### Step 3: Publish
1. Click **"Publish"** → **"Publish now"**
2. Netlify CMS commits the new `.md` file to GitHub
3. Netlify auto-deploys the site

### Step 4: Update Posts Index
After publishing, manually update `/blog/posts-index.json`:

```json
{
  "posts": [
    {
      "slug": "new-post-slug",
      "filename": "new-post-slug.md"
    },
    {
      "slug": "sample-post",
      "filename": "sample-post.md"
    }
  ]
}
```

**Note**: In production, this can be automated with a build script.

---

## Markdown Post Format

Example: `/blog/posts/sample-post.md`

```markdown
---
title: "Welcome to Digilight Blog"
date: 2026-02-18
thumbnail: "/assets/uploads/sample.jpg"
description: "This is the first CMS blog post."
category: "BLOG"
---

# Welcome to Digilight Blog 🚀

This blog is now powered by **Netlify CMS**.

You can write posts easily from `/admin`.

## Features

- Markdown support
- Image uploads
- SEO optimization
- Premium design
```

---

## How Dynamic Loading Works

### Blog Listing (`blog.html`)

1. Page loads with empty `<div id="blog-posts"></div>`
2. `load-posts.js` executes:
   - Fetches `posts-index.json` to get list of posts
   - Fetches each `.md` file from `/blog/posts/`
   - Parses frontmatter metadata
   - Generates premium blog cards
   - Injects HTML into `#blog-posts`
3. Cards link to `/blog/post.html?slug=post-name`

### Single Post View (`post.html`)

1. Gets `slug` from URL parameter
2. Fetches `/blog/posts/{slug}.md`
3. Parses frontmatter for metadata
4. Converts Markdown → HTML using `marked.js`
5. Displays in premium blog layout
6. Updates page title, meta description, canonical URL

---

## Premium Design Features

All posts automatically include:

✅ **Responsive Layout** - Mobile-optimized with `blog-style.css`  
✅ **Typography** - Inter font, 19px body text, 1.9 line-height  
✅ **Featured Images** - Full-width with proper spacing  
✅ **CTA Section** - Orange + White buttons for conversions  
✅ **Author Box** - Dark text on light gray background  
✅ **FAQ Accordion** - Expandable questions with smooth animations  
✅ **SEO Ready** - Meta tags, Open Graph, structured data  

---

## SEO Optimization

Each post automatically gets:

- Dynamic `<title>` tag
- Meta description from frontmatter
- Canonical URL with slug
- Open Graph tags for social sharing
- Proper heading hierarchy (H1, H2, H3)
- Alt text on images

---

## Maintenance

### Adding New Posts
1. Create post in `/admin`
2. Add entry to `posts-index.json`
3. Push to GitHub
4. Netlify auto-deploys

### Editing Existing Posts
1. Go to `/admin` → Select post
2. Make changes
3. Click "Publish"
4. Changes auto-deploy

### Deleting Posts
1. Delete from `/admin`
2. Remove from `posts-index.json`
3. Push changes

---

## Troubleshooting

### Post Not Showing on blog.html
- Check if post is in `posts-index.json`
- Verify `.md` file exists in `/blog/posts/`
- Check browser console for errors
- Clear browser cache (Ctrl+Shift+R)

### Post Not Opening
- Verify slug matches filename (without `.md`)
- Check if file exists at `/blog/posts/{slug}.md`
- Ensure frontmatter is properly formatted

### Styling Issues
- Verify `blog-style.css?v=3.0` is loading
- Check for CSS conflicts in browser DevTools
- Ensure `marked.js` is loading for Markdown parsing

---

## Future Enhancements

### Automated Posts Index
Create a build script to auto-generate `posts-index.json`:

```javascript
// build-posts-index.js
const fs = require('fs');
const path = require('path');

const postsDir = './blog/posts';
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

const posts = files.map(filename => ({
  slug: filename.replace('.md', ''),
  filename: filename
}));

fs.writeFileSync('./blog/posts-index.json', JSON.stringify({ posts }, null, 2));
```

Add to `netlify.toml`:
```toml
[build]
  command = "node build-posts-index.js"
  publish = "/"
```

### Categories/Tags
Add to frontmatter:
```yaml
category: "SEO"
tags: ["local-seo", "google", "ranking"]
```

Filter posts by category in `load-posts.js`.

### Search Functionality
Implement client-side search using post metadata and content.

### Pagination
Add pagination when posts exceed 12 items.

---

## Technical Stack

- **CMS**: Netlify CMS (Git-based)
- **Storage**: Markdown files in GitHub repo
- **Parsing**: Custom frontmatter parser + marked.js
- **Styling**: Custom CSS with Inter font
- **Deployment**: Netlify (auto-deploy on push)
- **Authentication**: Netlify Identity + Git Gateway

---

## Support

For issues or questions:
- Email: digilightcare@gmail.com
- Phone: +91-9548838588

---

**Last Updated**: February 18, 2026  
**Version**: 1.0.0
