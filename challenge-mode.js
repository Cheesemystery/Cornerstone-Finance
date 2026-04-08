// Portfolio Challenge Mode — Countdown & Leaderboard Toggle

(function () {
  const CHALLENGE_END = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  })();

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now = new Date();
    const diff = Math.max(0, CHALLENGE_END - now);

    const totalSeconds = Math.floor(diff / 1000);
    const secs = totalSeconds % 60;
    const totalMins = Math.floor(totalSeconds / 60);
    const mins = totalMins % 60;
    const totalHours = Math.floor(totalMins / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');

    if (dEl) dEl.textContent = pad(days);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(mins);
    if (sEl) sEl.textContent = pad(secs);
  }

  function initChallengeCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  var leaderboardExpanded = false;

  function toggleChallengeLeaderboard() {
    leaderboardExpanded = !leaderboardExpanded;
    const hiddenRows = document.querySelectorAll('.ch-lb-row.ch-lb-hidden');
    hiddenRows.forEach(function (row) {
      row.classList.toggle('visible', leaderboardExpanded);
    });
    const btn = document.getElementById('ch-view-more');
    if (btn) {
      btn.textContent = leaderboardExpanded ? 'Collapse Leaderboard' : 'View Full Leaderboard';
    }
  }

  if (typeof window !== 'undefined') {
    window.toggleChallengeLeaderboard = toggleChallengeLeaderboard;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initChallengeCountdown);
    } else {
      initChallengeCountdown();
    }
  }
})();
