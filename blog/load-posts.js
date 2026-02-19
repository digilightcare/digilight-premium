// Digilight Blog - Dynamic Post Loader (FINAL FIXED VERSION)

(async function () {
  const postsContainer = document.getElementById("blog-posts");

  if (!postsContainer) {
    console.error("Blog posts container not found");
    return;
  }

  // ✅ Correct index file location
  let postFiles = [];

  try {
    const indexResponse = await fetch("posts.json");

    if (!indexResponse.ok) {
      throw new Error("posts.json not found");
    }

    const indexData = await indexResponse.json();

    // posts.json structure: { "posts": [ { "filename": "xxx.md" } ] }
    postFiles = indexData.posts.map((p) => p.filename);
  } catch (err) {
    console.error("Could not load posts.json index file:", err);

    postsContainer.innerHTML =
      "<p style='text-align:center;color:red;padding:40px;'>Error: posts.json missing or incorrect.</p>";
    return;
  }

  // ✅ Frontmatter Parser
  function parseFrontmatter(content) {
    const frontmatterRegex =
      /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;

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

  // ✅ Excerpt
  function getExcerpt(content, maxLength = 150) {
    const text = content.replace(/[#*`\[\]]/g, "").trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  }

  // ✅ Blog Card UI
  function createBlogCard(post) {
    const { metadata, content } = post;
    const slug = post.slug;

    const title = metadata.title || "Untitled Post";
    const description = metadata.description || getExcerpt(content);
    const thumbnail = metadata.thumbnail || "../images/blog.jpg";
    const category = metadata.category || "BLOG";

    return `
      <div class="result-card">
        <img src="${thumbnail}" alt="${title}" 
          style="width:100%;border-radius:12px;margin-bottom:20px;height:220px;object-fit:cover;">

        <span style="display:inline-block;padding:6px 16px;
          background:rgba(255,106,0,0.15);color:#ff6a00;
          border-radius:16px;font-size:12px;font-weight:700;
          text-transform:uppercase;margin-bottom:12px;">
          ${category}
        </span>

        <h3 style="font-size:22px;margin-bottom:12px;">
          ${title}
        </h3>

        <p style="color:#64748b;line-height:1.7;">
          ${description}
        </p>

        <a href="post.html?slug=${slug}"
          style="color:#0056d2;font-weight:600;text-decoration:none;">
          Read More →
        </a>
      </div>
    `;
  }

  // ✅ Load Posts
  try {
    const posts = [];

    for (const filename of postFiles) {
      try {
        // ✅ Correct posts folder path
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
        console.warn("Failed loading post:", filename);
      }
    }

    // Show Output
    if (posts.length === 0) {
      postsContainer.innerHTML =
        "<p style='text-align:center;color:#64748b;padding:40px;'>No blog posts found.</p>";
    } else {
      postsContainer.innerHTML = `
        <div class="results-grid">
          ${posts.map(createBlogCard).join("")}
        </div>
      `;
    }
  } catch (error) {
    console.error("Blog loading error:", error);

    postsContainer.innerHTML =
      "<p style='text-align:center;color:red;padding:40px;'>Blog failed to load.</p>";
  }
})();
