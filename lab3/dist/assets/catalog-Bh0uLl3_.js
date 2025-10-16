import"./forms-VwjCAZkT.js";const i="https://ceramic-api.onrender.com";function n(t){return`
        <article class="catalog__item">
            <img src="${new URL(t.image,i)}" alt="${t.title}" loading="lazy">
            <div class="catalog__info">
                <h3>${t.title}</h3>
                <p>${t.price} €</p>
            </div>
        </article>`}async function r(){const t=await fetch(`${i}/api/products`);if(!t.ok)throw new Error(`Failed to fetch: ${t.status}`);return t.json()}async function o(t="tea"){const e=document.querySelector(".catalog__grid");if(!e)return console.warn("No .catalog__grid found");e.innerHTML='<div class="loading">Loading…</div>';try{const a=await r();let c=[];t==="tea"&&(c=a.slice(0,5)),t==="kitchen"&&(c=a.slice(0,3)),t==="plants"&&(c=a.slice(0,2)),e.innerHTML=c.map(n).join("")}catch(a){console.error(a),e.innerHTML='<div class="error">Failed to load</div>'}}function s(){const t=document.querySelectorAll(".catalog__filter");t.length&&t.forEach(e=>e.addEventListener("click",async()=>{t.forEach(c=>c.classList.remove("active")),e.classList.add("active");const a=e.dataset.category;await o(a)}))}document.addEventListener("DOMContentLoaded",()=>{s(),o("tea")});
