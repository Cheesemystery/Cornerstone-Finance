// Campus Mode - Social Investing for Students
const campusData = {
  weeklyChallenge: {
    title: 'Most Consistent Investor',
    description: 'Who can maintain their investment streak the longest?',
    endsIn: '3 days',
    prize: 'Featured on Leaderboard + Pro Free Month'
  },
  leaderboard: [
    { rank: 1, name: 'Alex Chen', school: 'Stanford', college: 'stanford', return: 18.4, streak: 35, avatar: '👨‍🎓', movement: 0, strategy: 'Growth', sparkline: [12, 13.5, 14, 15.2, 16.8, 17.5, 18.4] },
    { rank: 2, name: 'Sarah Kim', school: 'MIT', college: 'mit', return: 16.2, streak: 22, avatar: '👩‍🎓', movement: 1, strategy: 'Index', sparkline: [10, 11.2, 12.5, 13, 14.8, 15.5, 16.2] },
    { rank: 3, name: 'Mike Johnson', school: 'Berkeley', college: 'berkeley', return: 14.8, streak: 18, avatar: '👨‍💼', movement: -1, strategy: 'Dividend', sparkline: [9, 10, 11.5, 12, 13.2, 14.1, 14.8] },
    { rank: 4, name: 'You', school: 'Your University', college: 'other', return: 12.3, streak: 14, avatar: '🎯', isUser: true, movement: 2, strategy: 'Growth', sparkline: [7, 8.5, 9, 10.2, 11, 11.8, 12.3] },
    { rank: 5, name: 'Emma Davis', school: 'UCLA', college: 'ucla', return: 11.9, streak: 12, avatar: '👩‍🔬', movement: 0, strategy: 'Index', sparkline: [7.2, 8, 8.9, 9.5, 10.4, 11.2, 11.9] },
    { rank: 6, name: 'James Wilson', school: 'USC', college: 'usc', return: 10.5, streak: 9, avatar: '👨‍💻', movement: -2, strategy: 'Speculative', sparkline: [6, 7.5, 8, 9.2, 8.8, 10, 10.5] },
    { rank: 7, name: 'Lisa Martinez', school: 'UCSD', college: 'ucsd', return: 9.8, streak: 7, avatar: '👩‍🎨', movement: 1, strategy: 'Dividend', sparkline: [5.5, 6.5, 7.2, 8, 8.5, 9.2, 9.8] },
    { rank: 8, name: 'David Brown', school: 'Harvard', college: 'harvard', return: 9.2, streak: 6, avatar: '👨‍🔬', movement: 0, strategy: 'Growth', sparkline: [5, 6, 6.8, 7.5, 8, 8.7, 9.2] },
    { rank: 9, name: 'Priya Patel', school: 'Columbia', college: 'columbia', return: 8.7, streak: 4, avatar: '👩‍💼', movement: 1, strategy: 'Index', sparkline: [4.5, 5.5, 6.2, 7, 7.5, 8.1, 8.7] },
    { rank: 10, name: 'Tyler Brooks', school: 'Dartmouth', college: 'dartmouth', return: 8.1, streak: 3, avatar: '👨‍🎓', movement: -1, strategy: 'Speculative', sparkline: [3.5, 4.8, 5.5, 6, 7, 7.6, 8.1] },
    { rank: 14, name: 'Jordan Lee', school: 'NYU', college: 'nyu', return: 6.4, streak: 2, avatar: '👩‍💻', movement: 0, strategy: 'Growth', sparkline: [2, 3, 3.8, 4.5, 5.2, 5.9, 6.4] },
    { rank: 27, name: 'Marcus Webb', school: 'Howard', college: 'howard', return: 4.9, streak: 1, avatar: '👨‍🎓', movement: 2, strategy: 'Dividend', sparkline: [1, 1.8, 2.5, 3.2, 3.8, 4.3, 4.9] }
  ],
  collegeLeaderboard: [
    { rank: 1, school: 'Stanford', avgReturn: 16.8, members: 42, logo: 'S' },
    { rank: 2, school: 'MIT', avgReturn: 15.1, members: 38, logo: 'M' },
    { rank: 3, school: 'Harvard', avgReturn: 13.9, members: 55, logo: 'H' },
    { rank: 4, school: 'Berkeley', avgReturn: 12.5, members: 61, logo: 'B' },
    { rank: 5, school: 'UCLA', avgReturn: 11.3, members: 49, logo: 'U' },
    { rank: 6, school: 'Columbia', avgReturn: 10.7, members: 33, logo: 'C' },
    { rank: 7, school: 'NYU', avgReturn: 9.8, members: 44, logo: 'N' },
    { rank: 8, school: 'Howard', avgReturn: 9.2, members: 28, logo: 'HU' },
    { rank: 9, school: 'USC', avgReturn: 8.6, members: 37, logo: 'U' },
    { rank: 10, school: 'Dartmouth', avgReturn: 7.9, members: 22, logo: 'D' }
  ],
  insights: {
    topStrategy: 'Dollar-cost averaging into VTI',
    averageReturn: 11.4,
    activeUsers: 847,
    totalInvested: 284000
  }
};

const collegeColors = {
  stanford: '#8C1515',
  mit: '#A31F34',
  berkeley: '#003262',
  ucla: '#2D68C4',
  usc: '#990000',
  ucsd: '#00629B',
  harvard: '#A51C30',
  columbia: '#B9D9EB',
  dartmouth: '#00693E',
  nyu: '#57068c',
  howard: '#003A63',
  other: '#2D9A7E'
};

const strategyColors = {
  Growth: { bg: '#E8F5F0', text: '#2D9A7E', border: '#B8E0D4' },
  Dividend: { bg: '#FFF3E8', text: '#C87B5B', border: '#F5D5C0' },
  Speculative: { bg: '#FEF3CD', text: '#B8860B', border: '#F5E08A' },
  Index: { bg: '#E8F0FE', text: '#1A6DC4', border: '#B8D0F8' }
};

function getStreakDisplay(streak) {
  if (streak >= 30) return '🔥🔥🔥';
  if (streak >= 7) return '🔥🔥';
  return '🔥';
}

function getAvatarOverlay(rank) {
  if (rank === 1) return `<div class="avatar-overlay rank-1-overlay"><span class="rank-crown">♛</span></div>`;
  if (rank <= 3) return `<div class="avatar-overlay rank-crown-overlay"><span class="rank-crown-small">♛</span></div>`;
  if (rank <= 10) return `<div class="avatar-overlay rank-gold-badge">★</div>`;
  if (rank <= 50) return `<div class="avatar-overlay rank-silver-badge">✦</div>`;
  return '';
}

function renderSparkline(data, isPositive) {
  const w = 48, h = 20;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 2) - 1;
    return `${x},${y}`;
  }).join(' ');
  const color = isPositive ? '#2D9A7E' : '#C87B5B';
  return `<svg class="sparkline-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function renderCampusLeaderboard() {
  const container = document.getElementById('campusLeaderboard');
  if (!container) return;

  const activeView = container.dataset.view || 'individual';

  if (activeView === 'college') {
    renderCollegeView(container);
  } else {
    renderIndividualView(container);
  }
}

function renderIndividualView(container) {
  const html = campusData.leaderboard.map(user => {
    let movementBadge = '';
    if (user.movement > 0) {
      movementBadge = `<span class="rank-movement up"><span class="rank-arrow">↑</span>${user.movement}</span>`;
    } else if (user.movement < 0) {
      movementBadge = `<span class="rank-movement down"><span class="rank-arrow">↓</span>${Math.abs(user.movement)}</span>`;
    }

    const collegeColor = collegeColors[user.college] || collegeColors.other;
    const strategy = strategyColors[user.strategy] || strategyColors.Growth;
    const sparklineSvg = renderSparkline(user.sparkline, user.return >= 0);
    const streakDisplay = getStreakDisplay(user.streak);
    const avatarOverlay = getAvatarOverlay(user.rank);

    let rankDisplay;
    if (user.rank === 1) rankDisplay = '<span class="medal-gold">1</span>';
    else if (user.rank === 2) rankDisplay = '<span class="medal-silver">2</span>';
    else if (user.rank === 3) rankDisplay = '<span class="medal-bronze">3</span>';
    else rankDisplay = `#${user.rank}`;

    return `
      <div class="leaderboard-row ${user.isUser ? 'user-row' : ''}" style="border-left: 3px solid ${collegeColor};">
        <div class="leaderboard-rank">${rankDisplay}</div>
        <div class="leaderboard-avatar-wrap">
          <div class="leaderboard-avatar">${user.avatar}</div>
          ${avatarOverlay}
        </div>
        <div class="leaderboard-info">
          <div class="leaderboard-name">
            ${user.name}${user.isUser ? ' (You)' : ''} ${movementBadge}
          </div>
          <div class="leaderboard-school-row">
            <span class="leaderboard-school">${user.school}</span>
            <span class="strategy-badge" style="background:${strategy.bg};color:${strategy.text};border:1px solid ${strategy.border};">${user.strategy}</span>
          </div>
        </div>
        <div class="leaderboard-stats">
          <div class="leaderboard-return-row">
            <div class="leaderboard-return ${user.return >= 0 ? 'positive' : 'negative'}">+${user.return}%</div>
            ${sparklineSvg}
          </div>
          <div class="leaderboard-streak">${streakDisplay} <span class="streak-count">${user.streak}d</span></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function renderCollegeView(container) {
  const html = campusData.collegeLeaderboard.map(college => {
    let rankDisplay;
    if (college.rank === 1) rankDisplay = '<span class="medal-gold">1</span>';
    else if (college.rank === 2) rankDisplay = '<span class="medal-silver">2</span>';
    else if (college.rank === 3) rankDisplay = '<span class="medal-bronze">3</span>';
    else rankDisplay = `#${college.rank}`;

    return `
      <div class="leaderboard-row college-row">
        <div class="leaderboard-rank">${rankDisplay}</div>
        <div class="college-logo-badge">${college.logo}</div>
        <div class="leaderboard-info">
          <div class="leaderboard-name">${college.school}</div>
          <div class="leaderboard-school">${college.members} members competing</div>
        </div>
        <div class="leaderboard-stats">
          <div class="leaderboard-return positive">+${college.avgReturn}%</div>
          <div class="leaderboard-streak-label">avg return</div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function switchLeaderboardView(view) {
  const container = document.getElementById('campusLeaderboard');
  if (!container) return;
  container.dataset.view = view;

  document.querySelectorAll('.leaderboard-view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  renderCampusLeaderboard();
}

function renderWeeklyChallenge() {
  const container = document.getElementById('weeklyChallenge');
  if (!container) return;

  container.innerHTML = `
    <div class="weekly-challenge-header">
      <div class="challenge-icon">🏆</div>
      <div class="challenge-info">
        <div class="challenge-title">${campusData.weeklyChallenge.title}</div>
        <div class="challenge-desc">${campusData.weeklyChallenge.description}</div>
      </div>
      <div class="challenge-timer">
        <div class="timer-value">${campusData.weeklyChallenge.endsIn}</div>
        <div class="timer-label">Ends in</div>
      </div>
    </div>
    <div class="challenge-prize">
      <span class="prize-icon">🎁</span> ${campusData.weeklyChallenge.prize}
    </div>
    <button class="challenge-join-btn" onclick="joinWeeklyChallenge()">Join Challenge</button>
  `;
}

function renderCampusInsights() {
  const container = document.getElementById('campusInsights');
  if (!container) return;

  container.innerHTML = `
    <div class="campus-insight-grid">
      <div class="campus-insight-card">
        <div class="insight-value">${campusData.insights.activeUsers}</div>
        <div class="insight-label">Active Students</div>
      </div>
      <div class="campus-insight-card">
        <div class="insight-value">$${(campusData.insights.totalInvested / 1000).toFixed(0)}K</div>
        <div class="insight-label">Total Invested</div>
      </div>
      <div class="campus-insight-card">
        <div class="insight-value">${campusData.insights.averageReturn}%</div>
        <div class="insight-label">Avg Return</div>
      </div>
    </div>
    <div class="top-strategy-card">
      <div class="strategy-label">📊 Most Successful Strategy</div>
      <div class="strategy-value">${campusData.insights.topStrategy}</div>
    </div>
  `;
}

function joinWeeklyChallenge() {
  showToast('You\'re in! Challenge starts Monday at 9am');
  showAchievementNotification({
    icon: '🏆',
    title: 'Joined Weekly Challenge'
  });
}

function showComparisonCard() {
  const userRank = campusData.leaderboard.find(u => u.isUser)?.rank || 4;
  const totalUsers = campusData.leaderboard.length;
  const percentile = Math.round(((totalUsers - userRank) / totalUsers) * 100);

  const modal = document.createElement('div');
  modal.className = 'comparison-modal';
  modal.innerHTML = `
    <div class="comparison-content">
      <button class="modal-close" onclick="this.closest('.comparison-modal').remove()">&times;</button>
      <h3>Your Performance</h3>
      <div class="comparison-stats">
        <div class="comparison-stat">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <div class="stat-value">#${userRank}</div>
            <div class="stat-label">Your Rank</div>
          </div>
        </div>
        <div class="comparison-stat">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <div class="stat-value">Top ${percentile}%</div>
            <div class="stat-label">Percentile</div>
          </div>
        </div>
        <div class="comparison-stat">
          <div class="stat-icon">🚀</div>
          <div class="stat-info">
            <div class="stat-value">+2</div>
            <div class="stat-label">Ranks This Week</div>
          </div>
        </div>
      </div>
      <div class="comparison-message">
        You're performing better than ${percentile}% of student investors. Keep up the consistency to break into the top 3!
      </div>
      <button class="comparison-share-btn" onclick="sharePerformance()">Share Progress 📤</button>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('visible'), 10);
}

function sharePerformance() {
  if (navigator.share) {
    navigator.share({
      title: 'My Investing Progress',
      text: 'I\'m in the top 25% of student investors on Cornerstone!',
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText('I\'m in the top 25% of student investors on Cornerstone!');
    showToast('Copied to clipboard!');
  }
}

function initCampusMode() {
  renderCampusLeaderboard();
  renderWeeklyChallenge();
  renderCampusInsights();

  setInterval(() => {
    const timeLeftElem = document.querySelector('.timer-value');
    if (timeLeftElem) {
      // Update countdown logic here
    }
  }, 60000);
}

if (typeof window !== 'undefined') {
  window.campusData = campusData;
  window.renderCampusLeaderboard = renderCampusLeaderboard;
  window.renderWeeklyChallenge = renderWeeklyChallenge;
  window.renderCampusInsights = renderCampusInsights;
  window.joinWeeklyChallenge = joinWeeklyChallenge;
  window.showComparisonCard = showComparisonCard;
  window.sharePerformance = sharePerformance;
  window.initCampusMode = initCampusMode;
  window.switchLeaderboardView = switchLeaderboardView;
}
