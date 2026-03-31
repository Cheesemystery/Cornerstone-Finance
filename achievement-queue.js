class AchievementQueue {
  constructor() {
    this.queue = [];
    this.isShowing = false;
    this.delay = 2500;
  }

  add(achievement) {
    this.queue.push(achievement);
    if (!this.isShowing) {
      this.showNext();
    }
  }

  showNext() {
    if (this.queue.length === 0) {
      this.isShowing = false;
      return;
    }

    this.isShowing = true;
    const achievement = this.queue.shift();

    this.displayAchievement(achievement);

    setTimeout(() => {
      this.showNext();
    }, this.delay);
  }

  displayAchievement(achievement) {
    const existingNotif = document.querySelector('.achievement-notification');
    if (existingNotif) {
      existingNotif.remove();
    }

    const notif = document.createElement('div');
    notif.className = 'achievement-notification';
    notif.innerHTML = `
      <div class="achievement-icon">${achievement.icon || '🎉'}</div>
      <div class="achievement-content">
        <div class="achievement-title">${achievement.title}</div>
        ${achievement.description ? `<div class="achievement-desc">${achievement.description}</div>` : ''}
      </div>
      <div class="achievement-points">+${achievement.points || 10} XP</div>
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
      notif.classList.add('visible');
    }, 10);

    setTimeout(() => {
      notif.classList.remove('visible');
      setTimeout(() => {
        notif.remove();
      }, 400);
    }, this.delay - 600);
  }

  clear() {
    this.queue = [];
    this.isShowing = false;
    const existingNotif = document.querySelector('.achievement-notification');
    if (existingNotif) {
      existingNotif.remove();
    }
  }
}

const achievementQueue = new AchievementQueue();

function showAchievementNotification(achievement) {
  achievementQueue.add(achievement);
}

function checkAndUnlockAchievements() {
  const userEmail = localStorage.getItem('cornerstone_user_email');
  if (!userEmail) return;

  const achievements = [
    { icon: '🎯', title: 'First Login', description: 'Welcome back!', points: 10 },
    { icon: '📊', title: 'Portfolio Viewer', description: 'Checked your dashboard', points: 5 },
    { icon: '🔥', title: '7-Day Streak', description: 'Building consistency!', points: 25 }
  ];

  const shownAchievements = JSON.parse(localStorage.getItem('shown_achievements') || '[]');

  achievements.forEach((ach, index) => {
    const achId = `ach_${index}`;
    if (!shownAchievements.includes(achId)) {
      achievementQueue.add(ach);
      shownAchievements.push(achId);
    }
  });

  localStorage.setItem('shown_achievements', JSON.stringify(shownAchievements));
}

if (typeof window !== 'undefined') {
  window.achievementQueue = achievementQueue;
  window.showAchievementNotification = showAchievementNotification;
  window.checkAndUnlockAchievements = checkAndUnlockAchievements;
}
