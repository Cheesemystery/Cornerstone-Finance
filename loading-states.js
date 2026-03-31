function showLoadingState(container) {
  if (!container) return;

  const loadingHTML = `
    <div class="loading-state" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px;">
      <div class="loading-spinner" style="width:48px; height:48px; border:4px solid var(--border); border-top-color:var(--green); border-radius:50%; animation:spin 1s linear infinite;"></div>
      <div style="margin-top:16px; font-size:13px; color:var(--text-muted);">Loading...</div>
    </div>
  `;

  container.innerHTML = loadingHTML;
}

function showSkeletonLoader(container, type = 'cards') {
  if (!container) return;

  let skeletonHTML = '';

  if (type === 'cards') {
    skeletonHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
        ${Array(4).fill().map(() => `
          <div class="skeleton-card">
            <div class="skeleton-loader skeleton-text" style="width:60%; margin-bottom:16px;"></div>
            <div class="skeleton-loader skeleton-price"></div>
            <div class="skeleton-loader skeleton-text" style="width:40%;"></div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (type === 'table') {
    skeletonHTML = `
      <div class="skeleton-card" style="padding:20px;">
        ${Array(5).fill().map(() => `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div style="flex:1;">
              <div class="skeleton-loader skeleton-text" style="width:40%; margin-bottom:8px;"></div>
              <div class="skeleton-loader skeleton-text" style="width:60%;"></div>
            </div>
            <div class="skeleton-loader skeleton-price"></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  container.innerHTML = skeletonHTML;
}

function addSmoothTransitions() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .tab-panel {
      animation: slideInContent 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes slideInContent {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    button:active {
      transform: scale(0.97);
    }

    .metric-box, .trending-card, .watchlist-card {
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .h-row:active, .ht-row:active {
      transform: scale(0.99);
    }
  `;
  document.head.appendChild(style);
}

function simulateDataLoad(callback, duration = 800) {
  setTimeout(callback, duration);
}

if (typeof window !== 'undefined') {
  window.showLoadingState = showLoadingState;
  window.showSkeletonLoader = showSkeletonLoader;
  window.simulateDataLoad = simulateDataLoad;

  document.addEventListener('DOMContentLoaded', function() {
    addSmoothTransitions();
  });
}
