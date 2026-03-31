const AppState = {
  LOGGED_OUT: 'logged_out',
  DEMO: 'demo',
  LOGGED_IN: 'logged_in'
};

class StateManager {
  constructor() {
    this.currentState = AppState.LOGGED_OUT;
    this.listeners = [];
  }

  setState(newState) {
    if (this.currentState === newState) return;

    const oldState = this.currentState;
    this.currentState = newState;

    this.updateUI();
    this.notifyListeners(oldState, newState);
  }

  getState() {
    return this.currentState;
  }

  isLoggedIn() {
    return this.currentState === AppState.LOGGED_IN;
  }

  isDemoMode() {
    return this.currentState === AppState.DEMO;
  }

  isLoggedOut() {
    return this.currentState === AppState.LOGGED_OUT;
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(oldState, newState) {
    this.listeners.forEach(callback => callback(oldState, newState));
  }

  updateUI() {
    const hero = document.querySelector('.hero');
    const chatSection = document.querySelector('.chat-section');
    const featuresSection = document.querySelector('.features-section');
    const missionSection = document.querySelector('.mission-section');
    const aiAnchorSection = document.querySelector('.ai-anchor-section');
    const dashboardApp = document.querySelector('.dashboard-app');
    const footer = document.querySelector('footer');
    const demoOverlay = document.getElementById('demoOverlay');
    const demoBanner = document.getElementById('demoBanner');

    if (this.currentState === AppState.LOGGED_OUT) {
      if (hero) hero.style.display = 'flex';
      if (chatSection) chatSection.style.display = 'block';
      if (featuresSection) featuresSection.classList.add('hidden-section');
      if (missionSection) missionSection.style.display = 'block';
      if (aiAnchorSection) aiAnchorSection.style.display = 'block';
      if (footer) footer.style.display = 'flex';
      if (dashboardApp) {
        dashboardApp.style.display = 'none';
      }
      if (demoOverlay) demoOverlay.style.display = 'none';
      if (demoBanner) demoBanner.style.display = 'none';
    }
    else if (this.currentState === AppState.DEMO) {
      if (hero) hero.style.display = 'none';
      if (chatSection) chatSection.style.display = 'none';
      if (featuresSection) featuresSection.style.display = 'none';
      if (missionSection) missionSection.style.display = 'none';
      if (aiAnchorSection) aiAnchorSection.style.display = 'none';
      if (footer) footer.style.display = 'none';
      if (dashboardApp) {
        dashboardApp.style.display = 'flex';
        dashboardApp.style.minHeight = '100vh';
        dashboardApp.style.marginTop = '60px';
      }
      if (demoOverlay) {
        demoOverlay.style.display = 'flex';
        demoOverlay.style.pointerEvents = 'none';
      }
      if (demoBanner) demoBanner.style.display = 'flex';

      this.disableDashboardInteractions();
    }
    else if (this.currentState === AppState.LOGGED_IN) {
      if (hero) hero.style.display = 'none';
      if (chatSection) chatSection.style.display = 'none';
      if (featuresSection) featuresSection.style.display = 'none';
      if (missionSection) missionSection.style.display = 'none';
      if (aiAnchorSection) aiAnchorSection.style.display = 'none';
      if (footer) footer.style.display = 'none';
      if (dashboardApp) {
        dashboardApp.style.display = 'flex';
        dashboardApp.style.minHeight = '100vh';
        dashboardApp.style.marginTop = '60px';
      }
      if (demoOverlay) demoOverlay.style.display = 'none';
      if (demoBanner) demoBanner.style.display = 'none';

      this.enableDashboardInteractions();
    }
  }

  disableDashboardInteractions() {
    const clickableElements = document.querySelectorAll(
      '.dash-nav-item, .metric-box, .h-row, .ht-row, .trending-card, .watchlist-card, .holding-card, button:not(.demo-cta-btn), input, select'
    );

    clickableElements.forEach(el => {
      if (!el.classList.contains('demo-cta-btn')) {
        el.style.pointerEvents = 'none';
        el.style.cursor = 'not-allowed';
        el.style.opacity = '0.7';
      }
    });
  }

  enableDashboardInteractions() {
    const clickableElements = document.querySelectorAll(
      '.dash-nav-item, .metric-box, .h-row, .ht-row, .trending-card, .watchlist-card, .holding-card, button, input, select'
    );

    clickableElements.forEach(el => {
      el.style.pointerEvents = '';
      el.style.cursor = '';
      el.style.opacity = '';
    });
  }

  enterDemoMode() {
    this.setState(AppState.DEMO);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  enterLoggedInMode() {
    this.setState(AppState.LOGGED_IN);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  returnToLanding() {
    this.setState(AppState.LOGGED_OUT);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }
}

const stateManager = new StateManager();

if (typeof window !== 'undefined') {
  window.AppState = AppState;
  window.stateManager = stateManager;
}
