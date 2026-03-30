// Campus Mode - Social Investing for Students
const campusData = {
  weeklyChallenge: {
    title: 'Most Consistent Investor',
    description: 'Who can maintain their investment streak the longest?',
    endsIn: '3 days',
    prize: 'Featured on Leaderboard + Pro Free Month'
  },
  leaderboard: [
    { rank: 1, name: 'Alex Chen', school: 'Stanford', return: 18.4, streak: 21, avatar: '👨‍🎓' },
    { rank: 2, name: 'Sarah Kim', school: 'MIT', return: 16.2, streak: 18, avatar: '👩‍🎓' },
    { rank: 3, name: 'Mike Johnson', school: 'Berkeley', return: 14.8, streak: 15, avatar: '👨‍💼' },
    { rank: 4, name: 'You', school: 'Your University', return: 12.3, streak: 14, avatar: '🎯', isUser: true },
    { rank: 5, name: 'Emma Davis', school: 'UCLA', return: 11.9, streak: 12, avatar: '👩‍🔬' },
    { rank: 6, name: 'James Wilson', school: 'USC', return: 10.5, streak: 10, avatar: '👨‍💻' },
    { rank: 7, name: 'Lisa Martinez', school: 'UCSD', return: 9.8, streak: 9, avatar: '👩‍🎨' },
    { rank: 8, name: 'David Brown', school: 'Harvard', return: 9.2, streak: 8, avatar: '👨‍🔬' }
  ],
  insights: {
    topStrategy: 'Dollar-cost averaging into VTI',
    averageReturn: 11.4,
    activeUsers: 847,
    totalInvested: 284000
  }
};

function renderCampusLeaderboard() {
  const container = document.getElementById('campusLeaderboard');
  if (!container) return;

  const html = campusData.leaderboard.map(user => `
    <div class="leaderboard-row ${user.isUser ? 'user-row' : ''}">
      <div class="leaderboard-rank">
        ${user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : `#${user.rank}`}
      </div>
      <div class="leaderboard-avatar">${user.avatar}</div>
      <div class="leaderboard-info">
        <div class="leaderboard-name">${user.name}${user.isUser ? ' (You)' : ''}</div>
        <div class="leaderboard-school">${user.school}</div>
      </div>
      <div class="leaderboard-stats">
        <div class="leaderboard-return ${user.return >= 0 ? 'positive' : 'negative'}">
          +${user.return}%
        </div>
        <div class="leaderboard-streak">${user.streak} 🔥</div>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
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
}
