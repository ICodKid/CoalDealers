(function() {
  const isLight = (r, g, b) => {
    // Perceived color brightness formula
    const srgb = [r, g, b].map(v => v / 255).map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
    const L = 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
    return L > 0.5;
  };

  const setThemeFromRGB = (r, g, b) => {
    const root = document.documentElement;
    const light = isLight(r,g,b);
    
    const accent = `rgb(${r}, ${g}, ${b})`;
    root.style.setProperty('--accent', accent);
   
    const contrast = (r*0.299 + g*0.587 + b*0.114) > 186 ? '#0b0f15' : '#f7fbff';
    root.style.setProperty('--accent-contrast', contrast);
    
    if (light) {
      root.style.setProperty('--bg', '#f4f7fb');
      root.style.setProperty('--text', '#0d0f14');
      root.style.setProperty('--muted', '#354155');
      root.style.setProperty('--card-bg', 'rgba(0, 0, 0, 0.04)');
      root.style.setProperty('--card-border', 'rgba(0, 0, 0, 0.12)');
    } else {
      root.style.setProperty('--bg', '#0d0f14');
      root.style.setProperty('--text', '#e9f1ff');
      root.style.setProperty('--muted', '#a9b3c6');
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.06)');
      root.style.setProperty('--card-border', 'rgba(255, 255, 255, 0.12)');
    }
  };

  const extractAverageColor = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const w = canvas.width = 32;
      const h = canvas.height = 32;
      ctx.drawImage(img, 0, 0, w, h);
      let r=0,g=0,b=0,count=0;
      const data = ctx.getImageData(0,0,w,h).data;
      for (let i=0; i<data.length; i+=4) {
        const a = data[i+3];
        if (a === 0) continue; // Skip transparent pixels
        r += data[i];
        g += data[i+1];
        b += data[i+2];
        count++;
      }
      if (!count) return resolve({ r: 88, g: 196, b: 181 }); // fallback accent
      resolve({ r: Math.round(r/count), g: Math.round(g/count), b: Math.round(b/count) });
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });

  async function applyBackgroundTheme() {
    const body = document.body;
    const bg = body.dataset.bg;
    if (bg) {
      body.style.backgroundImage = `url("${bg}")`;
      try {
        const { r, g, b } = await extractAverageColor(bg);
        setThemeFromRGB(r, g, b);
      } catch {
        setThemeFromRGB(88, 196, 181); // Fallback accent
      }
    }
  }

  function bindCopyIP() {
    const btn = document.querySelector('[data-copy-ip]');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const ip = btn.getAttribute('data-copy-ip');
      const originalHTML = btn.innerHTML;
      try {
        await navigator.clipboard.writeText(ip);
        btn.classList.add('success');
        btn.innerHTML = '<i class="fa-solid fa-check"></i><span>Copied</span>';
        setTimeout(() => {
          btn.classList.remove('success');
          btn.innerHTML = originalHTML;
        }, 1500);
      } catch {
        // Fallback for older browsers
        prompt('Copy this IP:', ip);
      }
    });
  }

  // ---------------------------------------------
  // AUTO-CHANGING FAVICON BASED ON DATE / EVENTS
  // ---------------------------------------------
  function applyEventFavicon() {
    const link = document.getElementById("dynamic-favicon");
    if (!link) return; // If missing, skip safely

    const now = new Date();
    const m = now.getMonth() + 1; // 1–12
    const d = now.getDate();

    // Default favicon
    let icon = "assets/favicon.png";

    // Pride Month (June)
    if (m === 6) {
      icon = "assets/favicon-pride.png";
    }

    // Halloween (October)
    if (m === 10) {
      icon = "assets/favicon-halloween.png";
    }

    // Christmas Season (Dec 1–26)
    if (m === 12 && d <= 26) {
      icon = "assets/favicon-christmas.png";
    }

    // Apply selected icon
    link.href = icon;
  }

  // Exposed function for vote.html
  function renderVoteSites(sites) {
    const mount = document.getElementById('vote-list');
    if (!mount || !Array.isArray(sites)) return;
    mount.innerHTML = '';
    sites.forEach((site, idx) => {
      const li = document.createElement('div');
      li.className = 'vote-item';
      const isEmpty = !site?.url;
      li.innerHTML = `
        <div class="index">${idx + 1}</div>
        <div class="info">
          <div class="name">${site?.name || 'Coming soon'}</div>
          <div class="desc">${isEmpty ? 'Slot reserved — coming soon!' : site?.desc || ''}</div>
        </div>
        <div class="actions">
          ${isEmpty ? `<span class="badge"><i class="fa-solid fa-hourglass-half"></i> Pending</span>`
                    : `<a class="btn outline" href="${site.url}" target="_blank" rel="noopener">
                         <i class="fa-solid fa-arrow-up-right-from-square"></i> <span>Open</span>
                       </a>`}
        </div>
      `;
      mount.appendChild(li);
    });
  }
 
  window.CoalDealers = { renderVoteSites };

  document.addEventListener('DOMContentLoaded', () => {
    applyBackgroundTheme();
    bindCopyIP();
    applyEventFavicon(); // Run favicon changer
  });

})();
(function() {
  const isLight = (r, g, b) => {
    // Perceived color brightness formula
    const srgb = [r, g, b].map(v => v / 255).map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
    const L = 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
    return L > 0.5;
  };

  const setThemeFromRGB = (r, g, b) => {
    const root = document.documentElement;
    const light = isLight(r,g,b);
    
    const accent = `rgb(${r}, ${g}, ${b})`;
    root.style.setProperty('--accent', accent);
   
    const contrast = (r*0.299 + g*0.587 + b*0.114) > 186 ? '#0b0f15' : '#f7fbff';
    root.style.setProperty('--accent-contrast', contrast);
    
    if (light) {
      root.style.setProperty('--bg', '#f4f7fb');
      root.style.setProperty('--text', '#0d0f14');
      root.style.setProperty('--muted', '#354155');
      root.style.setProperty('--card-bg', 'rgba(0, 0, 0, 0.04)');
      root.style.setProperty('--card-border', 'rgba(0, 0, 0, 0.12)');
    } else {
      root.style.setProperty('--bg', '#0d0f14');
      root.style.setProperty('--text', '#e9f1ff');
      root.style.setProperty('--muted', '#a9b3c6');
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.06)');
      root.style.setProperty('--card-border', 'rgba(255, 255, 255, 0.12)');
    }
  };

  const extractAverageColor = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const w = canvas.width = 32;
      const h = canvas.height = 32;
      ctx.drawImage(img, 0, 0, w, h);
      let r=0,g=0,b=0,count=0;
      const data = ctx.getImageData(0,0,w,h).data;
      for (let i=0; i<data.length; i+=4) {
        const a = data[i+3];
        if (a === 0) continue; // Skip transparent pixels
        r += data[i];
        g += data[i+1];
        b += data[i+2];
        count++;
      }
      if (!count) return resolve({ r: 88, g: 196, b: 181 }); // fallback accent
      resolve({ r: Math.round(r/count), g: Math.round(g/count), b: Math.round(b/count) });
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });

  async function applyBackgroundTheme() {
    const body = document.body;
    const bg = body.dataset.bg;
    if (bg) {
      body.style.backgroundImage = `url("${bg}")`;
      try {
        const { r, g, b } = await extractAverageColor(bg);
        setThemeFromRGB(r, g, b);
      } catch {
        setThemeFromRGB(88, 196, 181); // Fallback accent
      }
    }
  }

  function bindCopyIP() {
    const btn = document.querySelector('[data-copy-ip]');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const ip = btn.getAttribute('data-copy-ip');
      const originalHTML = btn.innerHTML;
      try {
        await navigator.clipboard.writeText(ip);
        btn.classList.add('success');
        btn.innerHTML = '<i class="fa-solid fa-check"></i><span>Copied</span>';
        setTimeout(() => {
          btn.classList.remove('success');
          btn.innerHTML = originalHTML;
        }, 1500);
      } catch {
        // Fallback for older browsers
        prompt('Copy this IP:', ip);
      }
    });
  }

  // ---------------------------------------------
  // AUTO-CHANGING FAVICON BASED ON DATE / EVENTS
  // ---------------------------------------------
  function applyEventFavicon() {
    const link = document.getElementById("dynamic-favicon");
    if (!link) return; // If missing, skip safely

    const now = new Date();
    const m = now.getMonth() + 1; // 1–12
    const d = now.getDate();

    // Default favicon
    let icon = "assets/favicon.png";

    // Pride Month (June)
    if (m === 6) {
      icon = "assets/favicon-pride.png";
    }

    // Halloween (October)
    if (m === 10) {
      icon = "assets/favicon-halloween.png";
    }

    // Christmas Season (Dec 1–26)
    if (m === 12 && d <= 26) {
      icon = "assets/favicon-christmas.png";
    }

    // Apply selected icon
    link.href = icon;
  }

  // Exposed function for vote.html
  function renderVoteSites(sites) {
    const mount = document.getElementById('vote-list');
    if (!mount || !Array.isArray(sites)) return;
    mount.innerHTML = '';
    sites.forEach((site, idx) => {
      const li = document.createElement('div');
      li.className = 'vote-item';
      const isEmpty = !site?.url;
      li.innerHTML = `
        <div class="index">${idx + 1}</div>
        <div class="info">
          <div class="name">${site?.name || 'Coming soon'}</div>
          <div class="desc">${isEmpty ? 'Slot reserved — coming soon!' : site?.desc || ''}</div>
        </div>
        <div class="actions">
          ${isEmpty ? `<span class="badge"><i class="fa-solid fa-hourglass-half"></i> Pending</span>`
                    : `<a class="btn outline" href="${site.url}" target="_blank" rel="noopener">
                         <i class="fa-solid fa-arrow-up-right-from-square"></i> <span>Open</span>
                       </a>`}
        </div>
      `;
      mount.appendChild(li);
    });
  }
 
  window.CoalDealers = { renderVoteSites };

  document.addEventListener('DOMContentLoaded', () => {
    applyBackgroundTheme();
    bindCopyIP();
    applyEventFavicon(); // Run favicon changer
  });

})();
