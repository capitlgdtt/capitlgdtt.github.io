import"./forms-VwjCAZkT.js";const n="https://ceramic-api.onrender.com";function i(t){return`
        <article class="blog__item">
            <img 
                src="${new URL(t.image,n)}" 
                alt="${t.title}" 
                loading="lazy"
                class="blog__item-img"
            >
            <div class="blog__info">
                <h3>${t.title}</h3>
                <button class="btn-default blog__button">Read</button>
            </div>
            <p class="blog__text">${t.excerpt}</p>
        </article>`}async function r(){const t=await fetch(`${n}/api/posts`);if(!t.ok)throw new Error(`Failed to fetch: ${t.status}`);return t.json()}async function a(){const t=document.querySelector(".blog__grid");if(!t)return console.warn("No .blog__grid found");t.innerHTML='<div class="loading">Loading…</div>';try{const e=await r();t.innerHTML=e.map(i).join("")}catch(o){console.error(o),t.innerHTML='<div class="error">Failed to load</div>'}}document.addEventListener("DOMContentLoaded",()=>{a()});
