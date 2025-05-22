document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.image-container img');
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    const lightboxContent = document.createElement('div');
    lightboxContent.classList.add('lightbox-content');
    const closeButton = document.createElement('span');
    closeButton.classList.add('lightbox-close');
    closeButton.innerHTML = '&times;'; // The 'X' symbol

    lightbox.appendChild(closeButton);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);

    images.forEach(img => {
        img.addEventListener('click', function() {
            const imgClone = document.createElement('img');
            imgClone.src = this.src;
            lightboxContent.innerHTML = '';
            lightboxContent.appendChild(imgClone);
            lightbox.style.display = 'flex';
        });
    });

    closeButton.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', function(event) {
        if (event.target === this) { // Close lightbox if clicked outside the image
            lightbox.style.display = 'none';
        }
    });

    // Intersection Observer for scroll-based animations
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.is
  
