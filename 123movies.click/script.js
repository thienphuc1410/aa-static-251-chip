    const TMDB_READ_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDEwZmMwYWY4YzdlNGNiYzI2NmE4M2YzNDYwY2YxNSIsIm5iZiI6MTcyMTk4NTI2NS41MjEsInN1YiI6IjY2YTM2OGYxMGQyMDljNDIxZjA4ZjI1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0_ho9lWn8TwC44PjsFmNca7Jif9L9mB67FtNUQpAKeQ';
    // const API_KEY_V3 = 'd410fc0af8c7e4cbc266a83f3460cf15';

    const IMG = (p, size='w500') => p ? `https://image.tmdb.org/t/p/${size}${p}` : '';

    async function load() {
      try {
        const r = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', {
          headers: { Authorization: `Bearer ${TMDB_READ_TOKEN}`, Accept: 'application/json' }
          // hoặc dùng V3: fetch(`https://api.themoviedb.org/3/trending/movie/day?language=fr-FR&api_key=${API_KEY_V3}`)
        });
        if (!r.ok) throw new Error(`TMDB ${r.status} ${r.statusText}`);
        const { results = [] } = await r.json();
        render(results.slice(0, 5));
      } catch (e) {
        document.querySelector('#grid').innerHTML =
          `<div class="err"><b>Erreur</b>: ${e.message}</div>`;
        console.error(e);
      }
    }

    function render(list) {
      const grid = document.querySelector('#grid');
      grid.innerHTML = list.map(m => {
        const title = m.title ?? m.name ?? '—';
        const date = m.release_date ?? '—';
        const rating = (typeof m.vote_average === 'number') ? m.vote_average.toFixed(1) : '—';
        const src = IMG(m.poster_path || m.backdrop_path);
        const year = (m.release_date && m.release_date.length >= 4)
  ? m.release_date.slice(0, 4)
  : '—';

        return `
          <article class="card">
            ${src ? `<img class="poster" src="${src}" alt="${title.replace(/"/g,'&quot;')}" loading="lazy" />` : `<div class="poster"></div>`}
            <div class="meta">
              <div class="title">${title}</div>
              <div class="badges">
                <span>${year}</span><div class="rating"><span class="star">★</span> <span>${rating}</span></div>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    load();