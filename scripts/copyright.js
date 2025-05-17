class CopyrightProtection {
    constructor() {
        this.checkWatermark();
        this.initContentScan();
    }

    checkWatermark() {
        const video = document.getElementById('main-video');
        video.addEventListener('play', () => {
            this.applyDynamicWatermark();
        });
    }

    applyDynamicWatermark() {
        const watermark = document.createElement('div');
        watermark.className = 'dynamic-watermark';
        watermark.textContent = `© ${new Date().getFullYear()} YourSite`;
        document.body.appendChild(watermark);
    }

    async initContentScan() {
        const response = await fetch('/api/copyright-scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: window.location.href })
        });
        
        if(response.status === 403) {
            this.showCopyrightNotice('Content blocked due to copyright claim');
        }
    }

    showCopyrightNotice(message) {
        const notice = document.getElementById('copyright-notice');
        notice.textContent = message;
        notice.style.display = 'block';
    }
}

new CopyrightProtection();
