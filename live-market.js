// Live Market Simulation & Real-time Updates
const marketData = {
  lastUpdate: new Date(),
  holdings: {
    'SPY': { price: 512.34, change: 1.23, changePercent: 0.24 },
    'VXUS': { price: 58.92, change: -0.15, changePercent: -0.25 },
    'BND': { price: 72.18, change: 0.05, changePercent: 0.07 },
    'VTI': { price: 245.67, change: 0.89, changePercent: 0.36 },
    'VGT': { price: 487.23, change: 2.14, changePercent: 0.44 },
    'AAPL': { price: 178.45, change: 1.32, changePercent: 0.75 },
    'MSFT': { price: 412.89, change: 2.67, changePercent: 0.65 },
    'GOOGL': { price: 138.21, change: -0.45, changePercent: -0.32 }
  }
};

function simulateMarketMovement() {
  Object.keys(marketData.holdings).forEach(symbol => {
    const stock = marketData.holdings[symbol];
    const volatility = 0.002;
    const randomChange = (Math.random() - 0.5) * volatility;

    stock.price = parseFloat((stock.price * (1 + randomChange)).toFixed(2));
    stock.change = parseFloat((stock.price * randomChange).toFixed(2));
    stock.changePercent = parseFloat((randomChange * 100).toFixed(2));
  });

  marketData.lastUpdate = new Date();
}

function startLiveMarketUpdates() {
  setInterval(() => {
    simulateMarketMovement();
    updateDashboardPrices();
    updateLastRefreshTime();
  }, 8000);
}

function updateDashboardPrices() {
  document.querySelectorAll('[data-symbol]').forEach(elem => {
    const symbol = elem.dataset.symbol;
    const stock = marketData.holdings[symbol];

    if (!stock) return;

    const priceElem = elem.querySelector('.stock-price');
    const changeElem = elem.querySelector('.stock-change');

    if (priceElem) {
      const oldPrice = parseFloat(priceElem.textContent.replace('$', ''));
      priceElem.textContent = `$${stock.price.toFixed(2)}`;

      if (stock.price > oldPrice) {
        priceElem.classList.add('price-flash-up');
        setTimeout(() => priceElem.classList.remove('price-flash-up'), 600);
      } else if (stock.price < oldPrice) {
        priceElem.classList.add('price-flash-down');
        setTimeout(() => priceElem.classList.remove('price-flash-down'), 600);
      }
    }

    if (changeElem) {
      const sign = stock.change >= 0 ? '+' : '';
      changeElem.textContent = `${sign}${stock.change.toFixed(2)} (${sign}${stock.changePercent.toFixed(2)}%)`;
      changeElem.className = `stock-change ${stock.change >= 0 ? 'up' : 'down'}`;
    }
  });
}

function updateLastRefreshTime() {
  const elem = document.getElementById('lastMarketUpdate');
  if (!elem) return;

  const now = new Date();
  const seconds = Math.floor((now - marketData.lastUpdate) / 1000);

  if (seconds < 60) {
    elem.textContent = `Updated ${seconds}s ago`;
  } else {
    elem.textContent = `Updated ${Math.floor(seconds / 60)}m ago`;
  }
}

function getMarketStatus() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  if (day === 0 || day === 6) {
    return { status: 'closed', message: 'Markets Closed - Weekend' };
  }

  if (hour >= 9 && hour < 16) {
    return { status: 'open', message: 'Markets Open' };
  } else if (hour >= 16 && hour < 20) {
    return { status: 'after-hours', message: 'After Hours Trading' };
  } else {
    return { status: 'closed', message: 'Markets Closed' };
  }
}

function updateMarketStatusBadge() {
  const badge = document.getElementById('marketStatusBadge');
  if (!badge) return;

  const { status, message } = getMarketStatus();
  badge.textContent = message;
  badge.className = `market-status-badge ${status}`;
}

function calculatePortfolioValue(userHoldings) {
  let totalValue = 0;
  let totalChange = 0;

  userHoldings.forEach(holding => {
    const stock = marketData.holdings[holding.symbol];
    if (stock) {
      const value = stock.price * holding.shares;
      totalValue += value;
      totalChange += (stock.change * holding.shares);
    }
  });

  return {
    value: totalValue,
    change: totalChange,
    changePercent: (totalChange / (totalValue - totalChange)) * 100
  };
}

function getComparisonMetrics() {
  const userReturn = 12.3;

  return {
    vsBenchmark: {
      value: userReturn - 10.2,
      label: 'vs S&P 500'
    },
    vsPeers: {
      percentile: 72,
      label: 'Better than 72% of beginners'
    },
    projectedGrowth: {
      oneYear: calculateProjection(4820, 12.3, 1),
      fiveYear: calculateProjection(4820, 12.3, 5)
    }
  };
}

function calculateProjection(currentValue, returnRate, years) {
  const monthlyContribution = 100;
  const monthlyRate = returnRate / 100 / 12;
  const months = years * 12;

  let futureValue = currentValue * Math.pow(1 + monthlyRate, months);

  for (let i = 0; i < months; i++) {
    futureValue += monthlyContribution * Math.pow(1 + monthlyRate, months - i);
  }

  return Math.round(futureValue);
}

function showAchievementNotification(achievement) {
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-icon">${achievement.icon}</div>
    <div class="achievement-content">
      <div class="achievement-title">Achievement Unlocked!</div>
      <div class="achievement-desc">${achievement.title}</div>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

function checkAndUnlockAchievements() {
  const achievements = [
    { id: 'first_positive_day', icon: '🎉', title: 'First Positive Day', condition: () => true },
    { id: 'week_streak', icon: '🔥', title: '7-Day Streak', condition: () => false },
    { id: 'beat_market', icon: '📈', title: 'Beat the Market', condition: () => true }
  ];

  achievements.forEach(achievement => {
    if (achievement.condition()) {
      const unlocked = localStorage.getItem(`achievement_${achievement.id}`);
      if (!unlocked) {
        localStorage.setItem(`achievement_${achievement.id}`, 'true');
        setTimeout(() => showAchievementNotification(achievement), Math.random() * 3000);
      }
    }
  });
}

if (typeof window !== 'undefined') {
  window.marketData = marketData;
  window.startLiveMarketUpdates = startLiveMarketUpdates;
  window.getMarketStatus = getMarketStatus;
  window.updateMarketStatusBadge = updateMarketStatusBadge;
  window.calculatePortfolioValue = calculatePortfolioValue;
  window.getComparisonMetrics = getComparisonMetrics;
  window.calculateProjection = calculateProjection;
  window.showAchievementNotification = showAchievementNotification;
  window.checkAndUnlockAchievements = checkAndUnlockAchievements;
}
