// Digilight Blog - Dynamic Post Loader
// Loads blog posts correctly from blog/posts.json and blog/posts/

(async function () {
  const postsContainer = document.getElementById("blog-posts");

  if (!postsContainer) {
    console.error("Blog posts container not found");
    return;
  }

  // ✅ Correct file: posts.json (NOT posts-index.json)
  let postFiles = [];

  try {
    const indexResponse = await fetch("blog/posts.json");

    if (!indexResponse.ok) {
      throw new Error("posts.json not found");
    }

    const indexData = await indexResponse.json();

    // posts.json structure: { "posts": [ { "filename": "xxx.md" } ] }
    postFiles = indexData.posts.map((p) => p.filename);
  } catch (err) {
    console.error("Could not load posts.json:", err);
    postsContainer.innerHTML =
      "<p style='text-align:center;color:red;'>Blog index file missing.</p>";
    return;
  }

  // ✅ Parse Frontmatter
  function parseFrontmatter(content) {
    const regex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(regex);

    if (!match) return { metadata: {}, content };

    const metadata = {};
    match[1].split("\n").forEach((line) => {
      const colon = line.indexOf(":");
      if (colon > -1) {
        const key = line.substring(0, colon).trim();
        let value = line.substring(colon + 1).trim();
        value = value.replace(/^["']|["']$/g, "");
        metadata[key] = value;
      }
    });

    return { metadata, content: match[2] };
  }

  // ✅ Create Blog Card
  function createBlogCard(post) {
    const title = post.metadata.title || "Untitled Post";
    const description =
      post.metadata.description || post.content.substring(0, 120) + "...";

    return `
      <div class="result-card">
        <h3>${title}</h3>
        <p>${description}</p>
        <a href="/blog/post.html?slug=${post.slug}">Read More →</a>
      </div>
    `;
  }

  // ✅ Load Posts
  const posts = [];

  for (const filename of postFiles) {
    try {
      // ✅ Correct path: posts are inside blog/posts/
      const response = await fetch(`blog/posts/${filename}`);

      if (!response.ok) continue;

      const text = await response.text();
      const parsed = parseFrontmatter(text);

      posts.push({
        slug: filename.replace(".md", ""),
        ...parsed,
      });
    } catch (err) {
      console.warn("Failed loading post:", filename);
    }
  }

  // ✅ Display Posts
  if (posts.length === 0) {
    postsContainer.innerHTML =
      "<p style='text-align:center;'>No blog posts found.</p>";
    return;
  }

  postsContainer.innerHTML = `
    <div class="results-grid">
      ${posts.map(createBlogCard).join("")}
    </div>
  `;
})();
