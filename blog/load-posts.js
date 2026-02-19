// Digilight Blog - Dynamic Post Loader
// Correct paths for Netlify deployment

(async function () {
  const postsContainer = document.getElementById("blog-posts");

  if (!postsContainer) {
    console.error("Blog posts container not found");
    return;
  }

  // ✅ Step 1: Load posts.json from SAME folder (/blog/)
  let postFiles = [];

  try {
    const indexResponse = await fetch("posts.json");

    if (indexResponse.ok) {
      const indexData = await indexResponse.json();
      postFiles = indexData.posts.map((p) => p.filename);
    } else {
      console.error("posts.json not found");
    }
  } catch (err) {
    console.error("Error loading posts.json:", err);
  }

  // ✅ Frontmatter Parser
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

  // ✅ Blog Card HTML
  function createBlogCard(post) {
    const { metadata, content } = post;

    const title = metadata.title || "Untitled Post";
    const date = metadata.date ? formatDate(metadata.date) : "";
    const description = metadata.description || getExcerpt(content);
    const thumbnail = metadata.thumbnail || "../images/blog.jpg";
    const category = metadata.category || "BLOG";

    return `
      <div class="result-card">
        <img src="${thumbnail}" alt="${title}" 
          style="width:100%;border-radius:12px;margin-bottom:15px;height:220px;object-fit:cover;">

        <span style="display:inline-block;padding:6px 14px;
          background:rgba(255,106,0,0.15);
          color:#ff6a00;border-radius:14px;
          font-size:12px;font-weight:700;">
          ${category}
        </span>

        <h3 style="margin:12px 0;font-size:20px;">
          ${title}
        </h3>

        <p style="color:#64748b;font-size:14px;line-height:1.6;">
          ${description}
        </p>

        <a href="post.html?slug=${post.slug}"
          style="color:#0056d2;font-weight:600;">
          Read More →
        </a>
      </div>
    `;
  }

  // ✅ Step 2: Fetch all posts correctly from /blog/posts/
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
        });
      } catch (err) {
        console.warn("Failed loading post:", filename, err);
      }
    }

    // Sort newest first
    posts.sort((a, b) => {
      return new Date(b.metadata.date || 0) - new Date(a.metadata.date || 0);
    });

    // Display
    if (posts.length === 0) {
      postsContainer.innerHTML =
        "<p style='text-align:center;'>No blog posts found.</p>";
    } else {
      postsContainer.innerHTML = `
        <div class="results-grid">
          ${posts.map(createBlogCard).join("")}
        </div>
      `;
    }
  } catch (error) {
    console.error("Blog load error:", error);
    postsContainer.innerHTML =
      "<p style='text-align:center;color:red;'>Error loading posts.</p>";
  }
})();
