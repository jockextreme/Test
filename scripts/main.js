// scripts/main.js
class MainApp {
  constructor() {
    this.initializeModules();
    this.setupEventListeners();
    this.checkAgeVerification();
    this.initializeVideoPlayer();
  }

  initializeModules() {
    this.modules = {
      copyright: new CopyrightProtection(),
      ads: new AdManager(),
      analytics: new WatchTimeAnalytics(),
      reactions: new LiveReactions()
    };
  }

  setupEventListeners() {
    // Theme Toggle
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      this.toggleDarkMode();
    });

    // Video Controls
    const videoPlayer = document.getElementById('mainVideoPlayer');
    videoPlayer.addEventListener('play', () => this.handleVideoPlay());
    videoPlayer.addEventListener('pause', () => this.handleVideoPause());
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    this.modules.ads.refreshAds(); // Refresh ads for dark mode
  }

  checkAgeVerification() {
    if (!localStorage.getItem('ageVerified')) {
      document.getElementById('ageGate').style.display = 'flex';
      document.getElementById('mainContent').style.display = 'none';
    }
  }

  initializeVideoPlayer() {
    // Initialize video.js player
    this.player = videojs('mainVideoPlayer', {
      controls: true,
      autoplay: false,
      preload: 'auto',
      responsive: true
    });
  }

  handleVideoPlay() {
    this.modules.analytics.startTracking();
    this.modules.ads.scheduleMidRollAd();
    this.modules.copyright.applyWatermark();
  }

  handleVideoPause() {
    this.modules.analytics.pauseTracking();
    this.modules.ads.pauseAds();
  }

  // Age verification handler
  verifyAge(confirmed) {
    if (confirmed) {
      localStorage.setItem('ageVerified', 'true');
      document.getElementById('ageGate').style.display = 'none';
      document.getElementById('mainContent').style.display = 'block';
      this.initializePage();
    } else {
      window.location.href = 'https://example.com/exit';
    }
  }

  initializePage() {
    // Lazy load non-critical components
    import('./lazy-modules.js').then(modules => {
      modules.initializeRecommendations();
    });
  }
}

// Error handling
window.addEventListener('error', (e) => {
  console.error('Application Error:', e.error);
  // Send error to analytics
  if (window.analytics) {
    analytics.trackError(e.error);
  }
});

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  const app = new MainApp();
  
  // Expose core functionality to browser console
  window.debugApp = {
    reloadAds: () => app.modules.ads.refreshAds(),
    showAnalytics: () => app.modules.analytics.showDashboard(),
    toggleTheme: () => app.toggleDarkMode()
  };
});
