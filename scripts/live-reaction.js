class LiveReactions {
    constructor() {
        this.reactionSocket = new WebSocket('wss://your-socket-server.com');
        this.initReactions();
    }

    initReactions() {
        this.setupUI();
        this.setupSocket();
    }

    setupUI() {
        const reactions = ['❤️', '🔥', '😮', '👏'];
        const container = document.createElement('div');
        container.className = 'reaction-buttons';
        
        reactions.forEach(reaction => {
            const button = document.createElement('button');
            button.textContent = reaction;
            button.addEventListener('click', () => this.sendReaction(reaction));
            container.appendChild(button);
        });
        
        document.body.appendChild(container);
    }

    sendReaction(reaction) {
        this.reactionSocket.send(JSON.stringify({
            type: 'reaction',
            content: reaction,
            timestamp: Date.now()
        }));
    }

    setupSocket() {
        this.reactionSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.displayReaction(data.content);
        };
    }

    displayReaction(reaction) {
        const animation = document.createElement('div');
        animation.className = 'reaction-animation';
        animation.textContent = reaction;
        document.body.appendChild(animation);
        
        setTimeout(() => animation.remove(), 1000);
    }
}

new LiveReactions();
