const API_BASE = "https://ceramic-api.onrender.com";

function postToHTML(p) {
    return `
        <article class="blog__item">
            <img 
                src="${new URL(p.image, API_BASE)}" 
                alt="${p.title}" 
                loading="lazy"
                class="blog__item-img"
            >
            <div class="blog__info">
                <h3>${p.title}</h3>
                <button class="btn-default blog__button">Read</button>
            </div>
            <p class="blog__text">${p.excerpt}</p>
        </article>`;
}

async function fetchPosts() {
    const res = await fetch(`${API_BASE}/api/posts`);
    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
    }
    return res.json();
}

async function renderPosts() {
    const grid = document.querySelector(".blog__grid");
    if (!grid) return console.warn("No .blog__grid found");

    grid.innerHTML = `<div class="loading">Loading…</div>`;

    try {
        const data = await fetchPosts();

        const shown = data;
        // let shown = [];
        // shown = data.slice(0, 2);

        grid.innerHTML = shown.map(postToHTML).join("");
    } catch (err) {
        console.error(err);
        grid.innerHTML = `<div class="error">Failed to load</div>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderPosts();
});