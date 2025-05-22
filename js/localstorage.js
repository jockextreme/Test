document.addEventListener('DOMContentLoaded', () => {
    const volumeControl = document.getElementById('volume');

    // Load volume from local storage
    const storedVolume = localStorage.getItem('gameVolume');
    if (storedVolume !== null) {
        volumeControl.value = storedVolume;
        console.log('Volume loaded:', storedVolume);
    }

    // Save volume to local storage on change
    volumeControl.addEventListener('input', () => {
        localStorage.setItem('gameVolume', volumeControl.value);
        console.log('Volume saved:', volumeControl.value);
        // Update your game audio volume here (if implemented)
    });
});

function saveLocalData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Data saved to local storage: ${key}`, data);
    } catch (error) {
        console.error('Error saving to local storage:', error);
    }
}

function loadLocalData(key) {
    try {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.error('Error loading from local storage:', error);
        return null;
    }
}
  
