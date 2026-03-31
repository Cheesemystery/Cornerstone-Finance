function toggleSetting(toggleElement) {
  toggleElement.classList.toggle('active');
  const isActive = toggleElement.classList.contains('active');
  showToast(isActive ? 'Notification enabled' : 'Notification disabled');
}

function confirmLogout() {
  if (confirm('Are you sure you want to sign out?')) {
    localStorage.removeItem('cornerstone_user_email');
    localStorage.removeItem('shown_achievements');
    currentUser = null;

    if (window.stateManager) {
      window.stateManager.returnToLanding();
    }

    showToast('Signed out successfully');
  }
}

function loadSettingsEmail() {
  const email = localStorage.getItem('cornerstone_user_email');
  const emailElement = document.getElementById('settingsEmail');
  if (emailElement && email) {
    emailElement.textContent = email;
  }
}

if (typeof window !== 'undefined') {
  window.toggleSetting = toggleSetting;
  window.confirmLogout = confirmLogout;
  window.loadSettingsEmail = loadSettingsEmail;

  document.addEventListener('DOMContentLoaded', function() {
    loadSettingsEmail();
  });
}
