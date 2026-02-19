// Digilight Blog - Dynamic Post Loader
// Loads posts from blog/posts.json and displays them

(async function () {
  const postsContainer = document.getElementById("blog-posts");

  if (!postsContainer) {
    console.error("Blog posts container not found");
    return;
  }

  // ✅ Step 1: Load posts.json (Correct File)
  let postFiles = [];

  try {
    const indexResponse = await fetch("posts.json");

    if (indexResponse.ok) {
      const indexData = await indexResponse.json();

      // Expected structure:
      // { "posts": [ { "filename": "sample-post.md" } ] }

      postFiles = indexData.posts.map((p) => p.filename);
    } else {
      console.error("posts.json not found!");
    }
  } catch (err) {
    console.error("Could not load posts.json:", err);
  }

  // ✅ Frontmatter parser
  function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return { metadata: {}, content: content };
    }

    const frontmatter = match[1];
    const body = match[2];

    const metadata = {};
    frontmatter.split("\n").forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        value = value.replace(/^["']|["']$/g, "");
        metadata[key] = value;
      }
    });

    return { metadata, content: body };
  }

  // ✅ Date formatter
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // ✅ Excerpt generator
  function getExcerpt(content, maxLength = 150) {
    const text = content.replace(/[#*`\[\]]/g, "").trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  }

  // ✅ Blog card generator
  function createBlogCard(post) {
    const { metadata, content } = post;
    const slug = post.slug;

    const title = metadata.title || "Untitled Post";
    const date = metadata.date ? formatDate(metadata.date) : "";
    const description = metadata.description || getExcerpt(content);
    const thumbnail = metadata.thumbnail || "../images/blog.jpg";
    const category = metadata.category || "BLOG";

    return `
      <div class="result-card" style="text-align:left;">
        <img src="${thumbnail}" alt="${title}"
          style="width:100%; border-radius:12px; margin-bottom:20px; height:220px; object-fit:cover;">

        <div style="padding:0 4px;">
          <span style="display:inline-block; padding:6px 16px;
            background:rgba(255,106,0,0.15); color:#ff6a00;
            border-radius:16px; font-size:12px; font-weight:700;
            margin-bottom:12px;">
            ${category}
          </span>

          <h3 style="font-size:22px; margin-bottom:12px; color:#1a1a1a;">
            ${title}
          </h3>

          <p style="color:#64748b; margin:16px 0; line-height:1.7;">
            ${description}
          </p>

          <a href="post.html?slug=${slug}"
            style="color:#0056d2; font-weight:600; text-decoration:none;">
            Read More →
          </a>
        </div>
      </div>
    `;
  }

  // ✅ Step 2: Load and display posts
  try {
    const posts = [];

    for (const filename of postFiles) {
      try {
        const response = await fetch(`posts/${filename}`);
        if (!response.ok) continue;

        const content = await response.text();
        const parsed = parseFrontmatter(content);
        const slug = filename.replace(".md", "");

        posts.push({
          slug,
          ...parsed,
          filename,
        });
      } catch (err) {
        console.warn(`Failed to load ${filename}:`, err);
      }
    }

    // Sort newest first
    posts.sort((a, b) => {
      const dateA = new Date(a.metadata.date || 0);
      const dateB = new Date(b.metadata.date || 0);
      return dateB - dateA;
    });

    // Render posts
    if (posts.length === 0) {
      postsContainer.innerHTML =
        '<p style="text-align:center; padding:40px;">No blog posts found. Add posts from /admin.</p>';
    } else {
      postsContainer.innerHTML = `
        <div class="results-grid">
          ${posts.map(createBlogCard).join("")}
        </div>
      `;
    }
  } catch (error) {
    console.error("Error loading blog posts:", error);
    postsContainer.innerHTML =
      '<p style="text-align:center; padding:40px; color:red;">Error loading blog posts.</p>';
  }
})();
