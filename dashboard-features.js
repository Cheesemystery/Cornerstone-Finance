// Dashboard Interactive Features & Easter Eggs

// Portfolio Value Click Counter (Easter Egg: 3 clicks = confetti)
let portfolioClickCount = 0;
let portfolioClickTimer = null;

function initPortfolioValueClick() {
  const portfolioValue = document.querySelector('.portfolio-main-value');
  if (!portfolioValue) return;

  portfolioValue.addEventListener('click', function() {
    portfolioClickCount++;
    portfolioValue.classList.add('celebrate');

    setTimeout(() => portfolioValue.classList.remove('celebrate'), 600);

    clearTimeout(portfolioClickTimer);
    portfolioClickTimer = setTimeout(() => {
      portfolioClickCount = 0;
    }, 2000);

    if (portfolioClickCount === 3) {
      launchConfetti();
      showToast('🎉 You found an easter egg!');
      portfolioClickCount = 0;
    }
  });
}

// Confetti Animation
function launchConfetti() {
  const colors = ['#2D9A7E', '#5B9BD5', '#D4A853', '#E07B39', '#C87B5B'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.3 + 's';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }, i * 30);
  }
}

// What-If Simulator
function initWhatIfSimulator() {
  const monthlySlider = document.getElementById('simMonthly');
  const yearsSlider = document.getElementById('simYears');
  const returnSlider = document.getElementById('simReturn');

  if (!monthlySlider || !yearsSlider || !returnSlider) return;

  const monthlyValue = document.getElementById('simMonthlyValue');
  const yearsValue = document.getElementById('simYearsValue');
  const returnValue = document.getElementById('simReturnValue');
  const resultValue = document.getElementById('simResultValue');

  function updateSimulation() {
    const monthly = parseFloat(monthlySlider.value);
    const years = parseFloat(yearsSlider.value);
    const returnRate = parseFloat(returnSlider.value) / 100;

    monthlyValue.textContent = `$${monthly}`;
    yearsValue.textContent = `${years} years`;
    returnValue.textContent = `${returnSlider.value}%`;

    // Compound interest calculation
    const months = years * 12;
    const monthlyRate = returnRate / 12;
    let futureValue = 0;

    for (let i = 0; i < months; i++) {
      futureValue = (futureValue + monthly) * (1 + monthlyRate);
    }

    // Add current portfolio value
    const currentValue = 4820;
    futureValue += currentValue * Math.pow(1 + returnRate, years);

    resultValue.textContent = `$${Math.round(futureValue).toLocaleString()}`;
  }

  monthlySlider.addEventListener('input', updateSimulation);
  yearsSlider.addEventListener('input', updateSimulation);
  returnSlider.addEventListener('input', updateSimulation);

  updateSimulation();
}

// Smart Alerts System
const smartAlerts = [
  {
    type: 'success',
    icon: '🎯',
    title: 'Great timing!',
    message: 'Your SPY position is up 2.1% today. It\'s now 3.5% above your average buy price.',
    action: 'View Details →'
  },
  {
    type: 'warning',
    icon: '⚠️',
    title: 'Rebalancing needed',
    message: 'Tech sector is now 42% of your portfolio. Consider diversifying to reduce risk.',
    action: 'Rebalance Now →'
  },
  {
    type: 'info',
    icon: '💡',
    title: 'New research available',
    message: 'Analysts upgraded AAPL with a $200 price target. You own 5 shares.',
    action: 'Read Report →'
  }
];

function renderSmartAlerts() {
  const container = document.getElementById('smartAlertsContainer');
  if (!container) return;

  smartAlerts.forEach((alert, index) => {
    setTimeout(() => {
      const alertEl = document.createElement('div');
      alertEl.className = `alert-card alert-${alert.type}`;
      alertEl.innerHTML = `
        <div class="alert-icon">${alert.icon}</div>
        <div class="alert-content">
          <div class="alert-title">${alert.title}</div>
          <div class="alert-message">${alert.message}</div>
          <div class="alert-action">${alert.action}</div>
        </div>
        <div class="alert-dismiss" onclick="dismissAlert(this)">×</div>
      `;

      container.appendChild(alertEl);
    }, index * 200);
  });
}

function dismissAlert(btn) {
  const alert = btn.closest('.alert-card');
  alert.style.animation = 'slideOutRight 0.3s ease forwards';
  setTimeout(() => alert.remove(), 300);
}

// Sector Heat Map Data
const sectorData = [
  { name: 'Tech', change: 2.4, temp: 'hot' },
  { name: 'Finance', change: 1.1, temp: 'warm' },
  { name: 'Health', change: 0.8, temp: 'cool' },
  { name: 'Energy', change: -1.2, temp: 'cold' },
  { name: 'Consumer', change: 1.8, temp: 'warm' },
  { name: 'Industry', change: 0.5, temp: 'cool' },
  { name: 'Materials', change: -0.3, temp: 'cool' },
  { name: 'Utilities', change: 0.2, temp: 'cool' }
];

function renderSectorHeatmap() {
  const container = document.getElementById('sectorHeatmap');
  if (!container) return;

  sectorData.forEach(sector => {
    const cell = document.createElement('div');
    cell.className = `heatmap-cell ${sector.temp}`;
    cell.innerHTML = `
      <div class="heatmap-cell-name">${sector.name}</div>
      <div class="heatmap-cell-value">${sector.change > 0 ? '+' : ''}${sector.change}%</div>
    `;

    cell.addEventListener('click', function() {
      showToast(`${sector.name} sector: ${sector.change > 0 ? 'Gaining' : 'Losing'} momentum`);
    });

    container.appendChild(cell);
  });
}

// Market Pulse Updates
function updateMarketPulse() {
  const pulseItems = document.querySelectorAll('.pulse-item');

  pulseItems.forEach(item => {
    const valueEl = item.querySelector('.pulse-item-value');
    const trendEl = item.querySelector('.pulse-item-trend');

    if (!valueEl) return;

    // Simulate small changes
    const currentValue = parseFloat(valueEl.textContent.replace(/[^0-9.-]/g, ''));
    const change = (Math.random() - 0.5) * 0.5;
    const newValue = currentValue + change;

    // Animate the change
    valueEl.style.transition = 'none';
    valueEl.style.transform = 'scale(1.1)';
    valueEl.style.color = change > 0 ? 'var(--green)' : 'var(--terracotta)';

    setTimeout(() => {
      valueEl.textContent = valueEl.textContent.includes('$')
        ? `$${newValue.toFixed(2)}`
        : `${newValue.toFixed(1)}%`;

      valueEl.style.transition = 'all 0.3s ease';
      valueEl.style.transform = 'scale(1)';

      setTimeout(() => {
        valueEl.style.color = 'var(--text)';
      }, 600);
    }, 50);

    if (trendEl) {
      trendEl.className = `pulse-item-trend ${change > 0 ? 'up' : 'down'}`;
      trendEl.textContent = `${change > 0 ? '+' : ''}${change.toFixed(2)}`;
    }
  });
}

// Holdings Card Interactive Details
function initHoldingCards() {
  const cards = document.querySelectorAll('.holding-card');

  cards.forEach(card => {
    card.addEventListener('click', function() {
      const symbol = this.dataset.symbol;
      showHoldingDetail(symbol);
    });
  });
}

function showHoldingDetail(symbol) {
  // Quick info popup
  const detail = {
    'SPY': {
      name: 'S&P 500 ETF',
      shares: 8,
      avgCost: 495.20,
      current: 512.34,
      allocation: '50%'
    },
    'VXUS': {
      name: 'International Stock ETF',
      shares: 20,
      avgCost: 59.50,
      current: 58.92,
      allocation: '25%'
    },
    'BND': {
      name: 'Total Bond Market',
      shares: 17,
      avgCost: 71.80,
      current: 72.18,
      allocation: '25%'
    }
  };

  const info = detail[symbol];
  if (!info) return;

  const gain = ((info.current - info.avgCost) / info.avgCost * 100).toFixed(2);
  const gainAmount = ((info.current - info.avgCost) * info.shares).toFixed(2);

  showToast(`
    ${symbol}: ${info.shares} shares
    Gain: ${gain > 0 ? '+' : ''}${gain}% ($${gainAmount > 0 ? '+' : ''}${gainAmount})
    Allocation: ${info.allocation}
  `);
}

// Beginner Tips System
const beginnerTips = [
  "Diversification means spreading your money across different types of investments to reduce risk.",
  "Dollar-cost averaging: investing fixed amounts regularly helps smooth out market volatility.",
  "Your portfolio health score reflects how well-balanced and diversified your investments are.",
  "Index funds like SPY track entire market segments, giving you broad exposure with one investment.",
  "The heat map shows which sectors are 'hot' (gaining) or 'cold' (losing) today."
];

let currentTipIndex = 0;

function showRandomTip() {
  const tipContainer = document.getElementById('beginnerTipContainer');
  if (!tipContainer) return;

  const tip = beginnerTips[currentTipIndex];
  tipContainer.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--green-light);border-radius:10px;border:1px solid var(--green);">
      <span style="font-size:20px;">💡</span>
      <div style="flex:1;font-size:12px;color:var(--text);">${tip}</div>
      <button onclick="nextTip()" style="background:var(--green);color:white;border:none;padding:6px 12px;border-radius:6px;font-size:11px;cursor:pointer;">Next Tip</button>
    </div>
  `;

  currentTipIndex = (currentTipIndex + 1) % beginnerTips.length;
}

function nextTip() {
  showRandomTip();
}

// Initialize all features
function initDashboardFeatures() {
  initPortfolioValueClick();
  initWhatIfSimulator();
  renderSmartAlerts();
  renderSectorHeatmap();
  initHoldingCards();

  // Show beginner tip on dashboard load
  setTimeout(showRandomTip, 2000);

  // Update market pulse every 10 seconds
  setInterval(updateMarketPulse, 10000);
}

// Export functions
if (typeof window !== 'undefined') {
  window.initDashboardFeatures = initDashboardFeatures;
  window.dismissAlert = dismissAlert;
  window.nextTip = nextTip;
  window.launchConfetti = launchConfetti;
}
