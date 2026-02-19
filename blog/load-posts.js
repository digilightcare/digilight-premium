// Digilight Blog - Dynamic Post Loader
// Fetches markdown posts from /blog/posts/ and displays them dynamically

(async function() {
    const postsContainer = document.getElementById('blog-posts');
    
    if (!postsContainer) {
        console.error('Blog posts container not found');
        return;
    }

    // Fetch posts index
    let postFiles = [];
    
    try {
        const indexResponse = await fetch('posts-index.json');
        if (indexResponse.ok) {
            const indexData = await indexResponse.json();
            postFiles = indexData.posts.map(p => p.filename);
        }
    } catch (err) {
        console.warn('Could not load posts index, using empty list');
    }

    // Function to parse frontmatter from markdown
    function parseFrontmatter(content) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (!match) {
            return { metadata: {}, content: content };
        }

        const frontmatter = match[1];
        const body = match[2];
        
        const metadata = {};
        frontmatter.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > -1) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                // Remove quotes if present
                value = value.replace(/^["']|["']$/g, '');
                metadata[key] = value;
            }
        });

        return { metadata, content: body };
    }

    // Function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Function to get excerpt from content
    function getExcerpt(content, maxLength = 150) {
        const text = content.replace(/[#*`\[\]]/g, '').trim();
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    // Function to create blog card HTML
    function createBlogCard(post) {
        const { metadata, content } = post;
        const slug = post.slug;
        
        const title = metadata.title || 'Untitled Post';
        const date = metadata.date ? formatDate(metadata.date) : '';
        const description = metadata.description || getExcerpt(content);
        const thumbnail = metadata.thumbnail || '../images/blog.jpg';
        const category = metadata.category || 'BLOG';

        return `
            <div class="result-card" style="text-align: left; border: 2px solid transparent; transition: all 0.4s ease;">
                <img src="${thumbnail}" alt="${title}" style="width: 100%; border-radius: 12px; margin-bottom: 20px; height: 220px; object-fit: cover;">
                <div style="padding: 0 4px;">
                    <span style="display: inline-block; padding: 6px 16px; background: rgba(255,106,0,0.15); color: #ff6a00; border-radius: 16px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; border: 1px solid rgba(255,106,0,0.3);">${category}</span>
                    <h3 style="font-size: 22px; margin-bottom: 12px; line-height: 1.4; color: #1a1a1a;">${title}</h3>
                    <p style="color: #64748b; margin: 16px 0; line-height: 1.7; font-size: 15px;">${description}</p>
                    <a href="post.html?slug=${slug}" style="color: #0056d2; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: gap 0.3s ease;">Read More <span style="transition: transform 0.3s ease;">→</span></a>
                </div>
            </div>
        `;
    }

    // Fetch and display posts
    try {
        const posts = [];

        for (const filename of postFiles) {
            try {
                const response = await fetch(`posts/${filename}`);
                if (!response.ok) continue;
                
                const content = await response.text();
                const parsed = parseFrontmatter(content);
                const slug = filename.replace('.md', '');
                
                posts.push({
                    slug,
                    ...parsed,
                    filename
                });
            } catch (err) {
                console.warn(`Failed to load ${filename}:`, err);
            }
        }

        // Sort posts by date (newest first)
        posts.sort((a, b) => {
            const dateA = new Date(a.metadata.date || 0);
            const dateB = new Date(b.metadata.date || 0);
            return dateB - dateA;
        });

        // Generate HTML
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p style="text-align: center; color: #64748b; padding: 40px;">No blog posts found. Create your first post in /admin!</p>';
        } else {
            postsContainer.innerHTML = `
                <div class="results-grid">
                    ${posts.map(post => createBlogCard(post)).join('')}
                </div>
            `;
        }

    } catch (error) {
        console.error('Error loading blog posts:', error);
        postsContainer.innerHTML = '<p style="text-align: center; color: #e74c3c; padding: 40px;">Error loading blog posts. Please try again later.</p>';
    }
})();
