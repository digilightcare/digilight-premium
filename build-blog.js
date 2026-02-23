const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Simple frontmatter parser (no dependencies)
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { data: {}, content: content };
    }

    const frontmatter = match[1];
    const body = match[2];
    
    const data = {};
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            value = value.replace(/^["']|["']$/g, '');
            data[key] = value;
        }
    });

    return { data, content: body };
}

// Configure marked for better HTML output
marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: true,
    mangle: false
});

// Paths
const POSTS_DIR = path.join(__dirname, 'blog', 'posts');
const BLOG_DIR = path.join(__dirname, 'blog');
const BLOG_HTML = path.join(__dirname, 'blog.html');
const SITEMAP_XML = path.join(__dirname, 'sitemap.xml');

// Blog post template with complete SEO
function getPostTemplate(data) {
    const { slug, title, description, date, thumbnail, content, category } = data;
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const isoDate = new Date(date).toISOString();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google Analytics (GA4) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-68DSEJQ1RQ"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-68DSEJQ1RQ');
    </script>
    <meta name="google-site-verification" content="Vm1nrpE8araD_uosVz-LNZu75FGPKKMP3vc5oL-F3gA" />

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    
    <meta name="theme-color" content="#0056d2">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Digilight India">
    <meta name="format-detection" content="telephone=yes">
    <meta name="format-detection" content="address=yes">
    
    <title>${title} | Digilight India</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="digital marketing, SEO, PPC, social media marketing, content marketing, ${category}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://digilightindia.netlify.app/blog/${slug}.html">
    <meta name="author" content="Digilight India">
    <meta name="publish_date" property="og:publish_date" content="${isoDate}">
    
    <!-- Open Graph Tags -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://digilightindia.netlify.app/blog/${slug}.html">
    <meta property="og:title" content="${title} | Digilight India">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="https://digilightindia.netlify.app${thumbnail}">
    <meta property="og:site_name" content="Digilight India">
    <meta property="article:published_time" content="${isoDate}">
    <meta property="article:modified_time" content="${isoDate}">
    <meta property="article:author" content="Digilight India">
    <meta property="article:section" content="${category}">
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://digilightindia.netlify.app/blog/${slug}.html">
    <meta name="twitter:title" content="${title} | Digilight India">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="https://digilightindia.netlify.app${thumbnail}">
    <meta name="twitter:site" content="@digilightindia">
    <meta name="twitter:creator" content="@digilightindia">
    
    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${title}",
      "description": "${description}",
      "image": "https://digilightindia.netlify.app${thumbnail}",
      "datePublished": "${isoDate}",
      "dateModified": "${isoDate}",
      "author": {
        "@type": "Organization",
        "name": "Digilight India",
        "url": "https://digilightindia.netlify.app"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Digilight India",
        "logo": {
          "@type": "ImageObject",
          "url": "https://digilightindia.netlify.app/images/digilight-logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://digilightindia.netlify.app/blog/${slug}.html"
      },
      "articleSection": "${category}",
      "keywords": "digital marketing, SEO, PPC, ${category}"
    }
    </script>
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://digilightindia.netlify.app/"
      },{
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://digilightindia.netlify.app/blog.html"
      },{
        "@type": "ListItem",
        "position": 3,
        "name": "${title}",
        "item": "https://digilightindia.netlify.app/blog/${slug}.html"
      }]
    }
    </script>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="../styles-mobile-enhanced.css">
    <link rel="stylesheet" href="blog-style.css?v=3.0">
</head>
<body>
    <header>
        <nav>
            <div class="logo" style="display: flex; align-items: center; gap: 8px; cursor: pointer;" onclick="window.location.href='../index.html'">
                <img src="../images/digilight-logo.png" alt="Digilight India" style="height: 40px;">
                <img src="../images/digilight-text-logo.png" alt="Digilight" style="height: 32px;">
            </div>
            <button class="mobile-menu-toggle" aria-label="Toggle mobile menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../services.html">Services</a></li>
                <li><a href="../portfolio.html">Portfolio</a></li>
                <li><a href="../pricing.html">Pricing</a></li>
                <li><a href="../testimonials.html">Testimonials</a></li>
                <li><a href="../guide.html">Free Tools</a></li>
                <li><a href="../blog.html" class="active">Blog</a></li>
                <li><a href="../contact.html">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section class="contact-hero">
        <div class="container">
            <h1>${title}</h1>
            <p>${description}</p>
        </div>
    </section>

    <section class="blog-wrapper">
        <div class="blog-container">
            <article class="blog-article">

                <p class="blog-meta">
                    ${formattedDate} • Digilight India
                </p>

                <h1>${title}</h1>

                <div class="blog-featured-image">
                    <img src="${thumbnail}" alt="${title}">
                </div>

                ${content}

                <!-- CTA -->
                <div class="blog-cta">
                    <h2>Ready to Grow Your Business with Digilight India?</h2>
                    <p>Book a free consultation and start ranking higher today.</p>

                    <div class="blog-cta-buttons">
                        <a href="../contact.html" class="blog-btn orange">Get Free SEO Audit</a>
                        <a href="../pricing.html" class="blog-btn white">View Pricing</a>
                    </div>
                </div>

                <!-- Author -->
                <div class="blog-author">
                    ✍ Written by <strong>Digilight India Team</strong> — Experts in SEO, Ads & Digital Growth.
                </div>

                <!-- Social Share Section -->
                <div class="blog-share-section">
                    <h3 class="blog-share-title">Share this article</h3>
                    <div class="social-share-buttons">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=https://digilightindia.netlify.app/blog/${slug}.html" target="_blank" class="share-btn facebook">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Facebook
                        </a>
                        <a href="https://x.com/intent/tweet?url=https://digilightindia.netlify.app/blog/${slug}.html&text=${encodeURIComponent(title)}" target="_blank" class="share-btn x">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            X
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://digilightindia.netlify.app/blog/${slug}.html" target="_blank" class="share-btn linkedin">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                        </a>
                        <a href="https://wa.me/?text=${encodeURIComponent(title + ' ' + 'https://digilightindia.netlify.app/blog/' + slug + '.html')}" target="_blank" class="share-btn whatsapp">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 0c-4.418 0-8 3.582-8 8 0 1.421.37 2.754 1.016 3.902L0 24l6.265-2.414A7.953 7.953 0 0016 24c4.418 0 8-3.582 8-8s-3.582-8-8-8zm0 14.5c-3.59 0-6.5-2.91-6.5-6.5S12.41 1.5 16 1.5s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"/>
                            </svg>
                            WhatsApp
                        </a>
                        <a href="#" onclick="navigator.clipboard.writeText('https://digilightindia.netlify.app/blog/${slug}.html'); return false;" class="share-btn copy">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </svg>
                            Copy Link
                        </a>
                    </div>
                </div>

                <!-- FAQ -->
                <div class="blog-faq">
                    <h2>Frequently Asked Questions</h2>

                    <details>
                        <summary>How long does SEO take to show results?</summary>
                        <p>Most businesses see improvements in 3–4 months, with strong results in 6–12 months.</p>
                    </details>

                    <details>
                        <summary>Do you offer digital marketing services in Meerut?</summary>
                        <p>Yes, Digilight India provides SEO, Google Ads, and social media marketing in Meerut.</p>
                    </details>

                    <details>
                        <summary>Can I get a free consultation?</summary>
                        <p>Absolutely. Contact Digilight India for a free strategy call.</p>
                    </details>

                </div>

                <!-- Related Posts -->
                <div class="related-posts">
                    <h2>Continue Reading</h2>
                    <div class="related-posts-grid" id="related-posts-grid">
                        <!-- Related posts will be dynamically loaded here -->
                    </div>
                </div>

            </article>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <div class="logo" style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; cursor: pointer;" onclick="window.location.href='../index.html'">
                        <img src="../images/digilight-logo.png" alt="Digilight India" style="height: 40px;">
                        <img src="../images/digilight-text-logo.png" alt="Digilight" style="height: 28px;">
                    </div>
                    <p style="margin-bottom: 16px; line-height: 1.7; text-align: justify; max-width: 350px;">Digilight India is a leading <strong>AI-powered digital marketing agency</strong> specializing in <strong>SEO services</strong>, <strong>social media marketing</strong>, <strong>PPC advertising</strong>, and <strong>content marketing</strong>. We help businesses achieve <strong>higher search rankings</strong>, drive <strong>organic traffic</strong>, and maximize <strong>ROI</strong>.</p>
                    <p style="margin-bottom: 20px; line-height: 1.7; text-align: justify; max-width: 350px;">From <strong>local SEO</strong> to enterprise solutions, we deliver results that boost <strong>brand visibility</strong> and generate qualified <strong>leads</strong>. Partner with India's trusted <strong>digital marketing experts</strong>!</p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/digilightindia/" target="_blank" class="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/digilightindia/" target="_blank" class="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/company/digilightindia/" target="_blank" class="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="https://www.youtube.com/@Digilightindia" target="_blank" class="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <div class="footer-col">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="../index.html">Home</a></li>
                        <li><a href="../services.html">Services</a></li>
                        <li><a href="../portfolio.html">Portfolio</a></li>
                        <li><a href="../pricing.html">Pricing</a></li>
                        <li><a href="../testimonials.html">Testimonials</a></li>
                        <li><a href="../guide.html">Free Tools</a></li>
                        <li><a href="../blog.html">Blog</a></li>
                        <li><a href="../contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h3>Contact Info</h3>
                    <p><strong>Address:</strong> Meerut, U.P., India 250001</p>
                    <p><strong>Phone:</strong> <a href="tel:+919548838588" style="color: #ff6a00; font-weight: 600; text-decoration: none; transition: all 0.3s ease;">+91-9548838588</a></p>
                    <p><strong>Email:</strong> <a href="mailto:digilightcare@gmail.com" style="color: #ff6a00; font-weight: 600; text-decoration: none; transition: all 0.3s ease;">digilightcare@gmail.com</a></p>
                    <p>Location: India</p>
                    <div style="margin-top: 24px;">
                        <h4 style="font-size: 18px; margin-bottom: 12px; color: var(--white); font-weight: 600;">Subscribe to Newsletter</h4>
                        <form action="https://dashboard.mailerlite.com/forms/1349402/147383048198948452/share" method="get" target="_blank" style="display: flex; gap: 8px; flex-direction: column;" onsubmit="gtag('event', 'subscribe', { event_category: 'Engagement', event_label: 'Newsletter Signup' }); console.log('GA4: Newsletter subscription tracked');">
                            <input type="email" name="email" placeholder="Enter your email" required style="padding: 12px 16px; border-radius: 6px; border: none; font-size: 14px; font-family: 'Raleway', Arial, sans-serif;">
                            <button type="submit" style="padding: 12px 24px; background: #ff6a00; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Raleway', Arial, sans-serif; transition: all 0.3s ease;">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p style="font-weight: 600; color: rgba(255,255,255,0.9);">&copy; 2026 Digilight India. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <a href="https://wa.me/919548838588?text=Hi%20Digilight%20India,%20I%20want%20digital%20marketing%20services" class="whatsapp-float" target="_blank" aria-label="Chat on WhatsApp" onclick="gtag('event', 'whatsapp_click', { event_category: 'Engagement', event_label: 'WhatsApp Click' }); console.log('GA4: WhatsApp click tracked');">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
            <path d="M16 0C7.164 0 0 7.164 0 16c0 2.825.738 5.48 2.032 7.776L0 32l8.448-2.016C10.656 31.232 13.248 32 16 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.344c-2.528 0-4.896-.704-6.912-1.92l-.496-.288-5.12 1.216 1.248-4.992-.32-.512C2.72 20.768 2.016 18.448 2.016 16c0-7.728 6.272-14 14-14s14 6.272 14 14-6.272 13.344-14 13.344zm7.68-10.496c-.416-.208-2.464-1.216-2.848-1.36-.384-.128-.656-.192-.944.208-.272.416-1.088 1.36-1.328 1.632-.24.288-.496.32-.912.112-.416-.208-1.76-.64-3.344-2.048-1.232-1.088-2.064-2.432-2.304-2.848-.24-.416-.016-.64.176-.848.192-.192.416-.496.624-.752.208-.24.272-.416.416-.688.128-.288.064-.528-.032-.752-.096-.208-.944-2.272-1.296-3.104-.336-.8-.688-.688-.944-.688-.24-.016-.528-.016-.816-.016s-.752.112-1.136.528c-.4.416-1.504 1.472-1.504 3.584s1.536 4.16 1.76 4.448c.208.272 3.104 4.736 7.52 6.64 1.056.448 1.872.72 2.512.928.1056.32 2.016.192 2.8.112.848-.128 2.464-.992 2.816-1.968.352-.96.352-1.792.24-1.968-.096-.192-.384-.304-.8-.512z"/>
        </svg>
    </a>

    <script src="../js/script.js"></script>
    
    <script>
        // Load related posts dynamically
        async function loadRelatedPosts() {
            try {
                const response = await fetch('./posts.json');
                if (!response.ok) return;

                const data = await response.json();
                const allPosts = data.posts;
                
                // Get 3 random posts (excluding current if needed)
                const shuffled = allPosts.sort(() => 0.5 - Math.random());
                const relatedPosts = shuffled.slice(0, 3);

                // Load metadata for each related post
                const relatedPostsData = [];
                for (const post of relatedPosts) {
                    try {
                        const postResponse = await fetch('./posts/' + post.filename);
                        if (!postResponse.ok) continue;
                        
                        const postContent = await postResponse.text();
                        const parsed = parseFrontmatter(postContent);
                        relatedPostsData.push({
                            slug: post.slug,
                            title: parsed.metadata.title || 'Untitled',
                            description: parsed.metadata.description || postContent.substring(0, 100) + '...',
                            thumbnail: parsed.metadata.thumbnail || '../images/blog.jpg'
                        });
                    } catch (err) {
                        console.warn('Failed to load related post:', post.filename);
                    }
                }

                // Display related posts
                const relatedPostsGrid = document.getElementById('related-posts-grid');
                if (relatedPostsGrid) {
                    relatedPostsGrid.innerHTML = relatedPostsData.map(post => 
                        '<a href="' + post.slug + '.html" class="related-post-card">' +
                            '<img src="' + post.thumbnail + '" alt="' + post.title + '" loading="lazy">' +
                            '<h3>' + post.title + '</h3>' +
                            '<p>' + post.description + '</p>' +
                        '</a>'
                    ).join('');
                }

            } catch (error) {
                console.error('Error loading related posts:', error);
            }
        }

        // Parse frontmatter function
        function parseFrontmatter(content) {
            const frontmatterRegex = /^---\\s*\\n([\\s\\S]*?)\\n---\\s*\\n([\\s\\S]*)$/;
            const match = content.match(frontmatterRegex);
            
            if (!match) {
                return { metadata: {}, content: content };
            }

            const frontmatter = match[1];
            const body = match[2];
            
            const metadata = {};
            frontmatter.split('\\n').forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > -1) {
                    const key = line.substring(0, colonIndex).trim();
                    let value = line.substring(colonIndex + 1).trim();
                    value = value.replace(/^["']|["']$/g, '');
                    metadata[key] = value;
                }
            });

            return { metadata, content: body };
        }

        // Load related posts when page loads
        document.addEventListener('DOMContentLoaded', loadRelatedPosts);
    </script>
</body>
</html>`;
}

// Blog card template
function getBlogCard(post) {
    const { slug, title, description, date, thumbnail, category } = post;
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return `
                <div class="result-card">
                    <img src="${thumbnail}" alt="${title}" loading="lazy">
                    <div class="result-card-content">
                        <span class="category-badge">${category || 'BLOG'}</span>
                        <h3>${title}</h3>
                        <p>${description}</p>
                        <a href="blog/${slug}.html" class="read-more-btn">
                            Read More
                        </a>
                    </div>
                </div>`;
}

// Main build function
async function buildBlog() {
    console.log('🚀 Building Digilight Blog...\n');

    // Check if posts directory exists
    if (!fs.existsSync(POSTS_DIR)) {
        console.log('❌ Posts directory not found. Creating it...');
        fs.mkdirSync(POSTS_DIR, { recursive: true });
        console.log('✅ Posts directory created\n');
        return;
    }

    // Read all markdown files
    const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
        console.log('⚠️  No blog posts found in /blog/posts/\n');
        return;
    }

    console.log(`📝 Found ${files.length} blog post(s)\n`);

    const posts = [];

    // Process each markdown file
    for (const file of files) {
        const filePath = path.join(POSTS_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        // Parse frontmatter
        const { data, content } = parseFrontmatter(fileContent);
        
        const slug = file.replace('.md', '');
        
        // Convert markdown to HTML using marked.js
        const htmlContent = marked(content);
        
        // Create post data
        const postData = {
            slug,
            title: data.title || 'Untitled Post',
            description: data.description || '',
            date: data.date || new Date().toISOString(),
            thumbnail: data.thumbnail || 'images/blog.jpg',
            category: data.category || 'BLOG',
            content: htmlContent
        };

        posts.push(postData);

        // Generate static HTML file for this post
        const postHtml = getPostTemplate(postData);
        const outputPath = path.join(BLOG_DIR, `${slug}.html`);
        fs.writeFileSync(outputPath, postHtml);
        
        console.log(`✅ Generated: /blog/${slug}.html`);
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
    
    console.log('📅 Posts sorted by date (newest first)\n');

    // Update blog.html with post cards
    let blogHtml = fs.readFileSync(BLOG_HTML, 'utf-8');
    
    // Generate blog cards HTML
    const blogCardsHtml = posts.map(post => getBlogCard(post)).join('\n');
    
    // Replace the blog posts section
    const blogPostsSection = `            <div class="results-grid">
${blogCardsHtml}
            </div>`;

    // Find and replace the results-grid section
    blogHtml = blogHtml.replace(
        /<div class="results-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<script src="blog\/load-posts\.js"><\/script>/,
        `${blogPostsSection}
        </div>
    </section>`
    );

    fs.writeFileSync(BLOG_HTML, blogHtml);
    console.log(`✅ Updated: blog.html with ${posts.length} post card(s)\n`);

    // Update sitemap.xml with blog posts
    updateSitemap(posts);

    console.log('🎉 Blog build complete!\n');
}

// Update sitemap.xml with blog post URLs
function updateSitemap(posts) {
    if (!fs.existsSync(SITEMAP_XML)) {
        console.log('⚠️  sitemap.xml not found, skipping sitemap update\n');
        return;
    }

    let sitemap = fs.readFileSync(SITEMAP_XML, 'utf-8');
    
    // Remove existing blog post entries (between markers or all blog/ URLs)
    sitemap = sitemap.replace(/\s*<!-- Blog Posts Start -->[\s\S]*?<!-- Blog Posts End -->/g, '');
    sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/digilightindia\.netlify\.app\/blog\/[^<]+\.html<\/loc>[\s\S]*?<\/url>/g, '');
    
    // Generate new blog post entries
    const today = new Date().toISOString().split('T')[0];
    const blogPostsXml = posts.map(post => {
        const postDate = new Date(post.date).toISOString().split('T')[0];
        return `    <url>
        <loc>https://digilightindia.netlify.app/blog/${post.slug}.html</loc>
        <lastmod>${postDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`;
    }).join('\n    \n');
    
    // Insert blog posts before closing </urlset>
    const blogSection = `
    <!-- Blog Posts Start -->
${blogPostsXml}
    <!-- Blog Posts End -->
    
</urlset>`;
    
    sitemap = sitemap.replace('</urlset>', blogSection);
    
    fs.writeFileSync(SITEMAP_XML, sitemap);
    console.log(`✅ Updated: sitemap.xml with ${posts.length} blog post(s)\n`);
}

// Run build
buildBlog().catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});
