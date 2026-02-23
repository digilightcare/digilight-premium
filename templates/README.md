# Digilight Website Templates & Standards

## 📋 Overview

This directory contains standardized templates to ensure consistency across all future pages and blog posts. All templates include:

- ✅ **Consistent Header**: Same navigation and branding
- ✅ **Standard Hero Section**: `contact-hero` class with enhanced text visibility
- ✅ **Unified Footer**: Same footer structure and links
- ✅ **Mobile Optimization**: Fully responsive design
- ✅ **SEO Optimized**: Meta tags, structured data, and semantic HTML

## 🗂️ Template Files

### 1. `page-template.html`
**Use for**: All new internal pages (Services, Portfolio, Pricing, etc.)

**Features**:
- Standard header with navigation
- `contact-hero` section for consistency
- Placeholder for main content
- Complete footer with all links
- Mobile-responsive design

### 2. `blog-post-template.html`
**Use for**: All new blog posts

**Features**:
- Blog-specific header (relative paths)
- `contact-hero` section for consistency
- Blog article structure with meta information
- Featured image section
- Related posts section
- CTA buttons for lead generation
- Complete footer with relative paths

## 🎯 Hero Section Standards

All internal pages MUST use the `contact-hero` class:

```html
<section class="contact-hero">
    <div class="container">
        <h1>[PAGE TITLE]</h1>
        <p>[PAGE DESCRIPTION]</p>
    </div>
</section>
```

### Text Visibility Features:
- **Dual-layer text shadows** for maximum readability
- **Enhanced font weights** (600 for descriptions, 800 for headings)
- **Mobile-optimized shadows** for all screen sizes
- **No background changes** - only text styling enhanced

## 📱 Mobile Optimization Standards

All templates include:

### Responsive Breakpoints:
- **Desktop**: 1200px+ (standard layout)
- **Tablet**: 768px - 1199px (adjusted spacing)
- **Mobile**: 480px - 767px (stacked layout)
- **Small Mobile**: < 480px (compact layout)

### Mobile Features:
- **Hamburger Menu**: Collapsible navigation
- **Touch-Friendly**: Larger tap targets
- **Optimized Text**: Readable font sizes on all devices
- **Flexible Images**: Responsive image scaling

## 🔧 How to Create New Pages

### For Internal Pages:
1. Copy `page-template.html`
2. Replace placeholders:
   - `[PAGE TITLE]` - Page title (meta + hero)
   - `[PAGE DESCRIPTION]` - Meta description + hero text
   - `[PAGE-URL]` - URL for canonical links
   - `[PAGE CONTENT GOES HERE]` - Main page content
3. Update navigation active state
4. Save as `[page-name].html`

### For Blog Posts:
1. Copy `blog-post-template.html`
2. Replace placeholders:
   - `[BLOG POST TITLE]` - Blog post title
   - `[BLOG POST DESCRIPTION]` - Meta description
   - `[BLOG POST KEYWORDS]` - SEO keywords
   - `[BLOG POST HERO TITLE]` - Hero section title
   - `[BLOG POST HERO DESCRIPTION]` - Hero section text
   - `[BLOG POST FULL TITLE]` - Article title
   - `[BLOG POST IMAGE]` - Featured image filename
   - `[BLOG POST URL]` - URL slug
   - `[PUBLISH DATE]` - Publication date
   - `[BLOG POST CONTENT GOES HERE]` - Article content
3. Update related posts if needed
4. Save as `[post-slug].html` in `/blog/` directory

## 🎨 CSS Classes Reference

### Hero Section:
- `.contact-hero` - Standard hero for all internal pages
- Enhanced text shadows automatically applied
- Mobile responsive included

### Navigation:
- `.nav-links` - Main navigation
- `.mobile-menu-toggle` - Hamburger menu button
- `.active` - Current page indicator

### Footer:
- `.footer-content` - Main footer grid
- `.footer-section` - Individual footer columns
- `.social-links` - Social media icons
- `.contact-info` - Contact details

### Blog Specific:
- `.blog-wrapper` - Blog content wrapper
- `.blog-article` - Individual article container
- `.blog-meta` - Publication metadata
- `.blog-featured-image` - Article hero image
- `.blog-cta` - Call-to-action section
- `.related-posts` - Related articles grid

## 📐 File Structure

```
digilight-premium/
├── templates/
│   ├── page-template.html          # Internal pages template
│   ├── blog-post-template.html     # Blog posts template
│   └── README.md                   # This documentation
├── [new-page].html                 # New internal pages
├── blog/
│   └── [new-blog-post].html       # New blog posts
├── styles.css                      # Global styles (includes contact-hero)
├── js/
│   └── main.js                     # JavaScript functionality
└── images/
    └── [new-images]                # New images
```

## ✅ Pre-Launch Checklist

Before publishing any new page:

### SEO Checklist:
- [ ] Unique page title (50-60 characters)
- [ ] Meta description (150-160 characters)
- [ ] Canonical URL set
- [ ] Open Graph tags complete
- [ ] Twitter Card tags complete
- [ ] Structured data if applicable
- [ ] Alt text for all images

### Design Checklist:
- [ ] Using `contact-hero` class
- [ ] Navigation updated with active state
- [ ] Footer links correct
- [ ] Mobile responsive tested
- [ ] Text visibility verified
- [ ] All links working

### Performance Checklist:
- [ ] Images optimized
- [ ] CSS minified if needed
- [ ] JavaScript working
- [ ] Loading speed acceptable
- [ ] No console errors

## 🚀 Best Practices

### Content Guidelines:
- **Hero Titles**: Keep under 60 characters for impact
- **Hero Descriptions**: 150-200 characters maximum
- **Page Content**: Use semantic HTML5 tags
- **Images**: Use WebP format when possible
- **Links**: Use descriptive anchor text

### SEO Guidelines:
- **URL Structure**: Use hyphens, lowercase letters
- **Headings**: Use H1 for titles, H2-H6 for hierarchy
- **Internal Links**: Link to relevant pages
- **External Links**: Use `target="_blank"` appropriately

### Mobile Guidelines:
- **Touch Targets**: Minimum 44px tap targets
- **Text Size**: Minimum 16px for readability
- **Spacing**: Adequate spacing between elements
- **Navigation**: Ensure hamburger menu works

## 🔄 Maintenance

### Regular Updates:
- Review templates quarterly for improvements
- Update footer links when adding new pages
- Check for broken links monthly
- Update copyright year annually

### Version Control:
- Commit template changes to Git
- Document any breaking changes
- Maintain backward compatibility when possible

---

## 📞 Support

For questions about templates or standards:
- Contact: digilightcare@gmail.com
- Check existing pages for reference
- Review this documentation first

**Remember**: Consistency is key to professional branding. Always use these templates for new pages!
