class WatchTimeAnalytics {
    constructor() {
        this.watchTime = 0;
        this.interval = null;
        this.initTracking();
    }

    initTracking() {
        const video = document.getElementById('main-video');
        
        video.addEventListener('play', () => {
            this.interval = setInterval(() => {
                this.watchTime += 5;
                this.saveAnalytics();
            }, 5000);
        });

        video.addEventListener('pause', () => {
            clearInterval(this.interval);
            this.saveAnalytics();
        });
    }

    saveAnalytics() {
        localStorage.setItem('watchTime', this.watchTime);
        // Send to analytics server
        fetch('/api/analytics', {
            method: 'POST',
            body: JSON.stringify({
                watchTime: this.watchTime,
                userId: '...'
            })
        });
    }
}

new WatchTimeAnalytics();
