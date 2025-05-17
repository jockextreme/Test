const API_KEY = "625156d0d268e4633b97980c0dc859d0";
const API_BASE_URL = "https://api.zetsu.xyz/javhd";

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const searchQuery = document.getElementById('searchQuery');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const videoDetailDiv = document.getElementById('videoDetail');
    const detailContentDiv = document.getElementById('detailContent');
    const backBtn = document.getElementById('backBtn');
    
    searchBtn.addEventListener('click', performSearch);
    searchQuery.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    backBtn.addEventListener('click', function() {
        videoDetailDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
    });
    
    function performSearch() {
        const query = searchQuery.value.trim();
        if (!query) return;
        
        loadingDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
        
        const url = `${API_BASE_URL}?action=search&query=${encodeURIComponent(query)}&apikey=${API_KEY}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                loadingDiv.style.display = 'none';
                resultsDiv.style.display = 'block';
                
                if (data && data.length > 0) {
                    displayResults(data);
                } else {
                    resultsDiv.innerHTML = '<p class="text-center">No results found. Try a different search term.</p>';
                }
            })
            .catch(error => {
                loadingDiv.style.display = 'none';
                resultsDiv.style.display = 'block';
                resultsDiv.innerHTML = `<p class="text-center text-danger">Error: ${error.message}</p>`;
                console.error('Error:', error);
            });
    }
    
    function displayResults(videos) {
        resultsDiv.innerHTML = '';
        
        videos.forEach(video => {
            const col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6';
            
            const card = document.createElement('div');
            card.className = 'video-card';
            card.innerHTML = `
                <img src="${video.thumbnail}" class="video-thumbnail" alt="${video.title}">
                <div class="p-3">
                    <div class="video-title">${video.title}</div>
                    <div class="video-duration">${video.duration || 'N/A'}</div>
                    <button class="btn btn-sm btn-outline-primary mt-2 view-detail" data-url="${video.url}">View Details</button>
                </div>
            `;
            
            col.appendChild(card);
            resultsDiv.appendChild(col);
        });
        
        // Add event listeners to detail buttons
        document.querySelectorAll('.view-detail').forEach(button => {
            button.addEventListener('click', function() {
                const videoUrl = this.getAttribute('data-url');
                fetchVideoDetails(videoUrl);
            });
        });
    }
    
    function fetchVideoDetails(videoUrl) {
        loadingDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
        
        const url = `${API_BASE_URL}?action=detail&url=${encodeURIComponent(videoUrl)}&apikey=${API_KEY}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                loadingDiv.style.display = 'none';
                videoDetailDiv.style.display = 'block';
                displayVideoDetails(data);
            })
            .catch(error => {
                loadingDiv.style.display = 'none';
                resultsDiv.style.display = 'block';
                alert(`Error fetching details: ${error.message}`);
                console.error('Error:', error);
            });
    }
    
    function displayVideoDetails(details) {
        detailContentDiv.innerHTML = `
            <h2>${details.title}</h2>
            <div class="row mt-4">
                <div class="col-md-4">
                    <img src="${details.thumbnail}" class="img-fluid rounded" alt="${details.title}">
                </div>
                <div class="col-md-8">
                    <p><strong>Duration:</strong> ${details.duration || 'N/A'}</p>
                    <p><strong>Actress:</strong> ${details.actress || 'N/A'}</p>
                    <p><strong>Release Date:</strong> ${details.release_date || 'N/A'}</p>
                    <p><strong>Tags:</strong> ${details.tags ? details.tags.join(', ') : 'N/A'}</p>
                    ${details.video_url ? `<a href="${details.video_url}" target="_blank" class="btn btn-primary mt-3">Watch Video</a>` : ''}
                </div>
            </div>
            ${details.screenshots ? `
                <div class="mt-4">
                    <h4>Screenshots</h4>
                    <div class="row">
                        ${details.screenshots.map(screenshot => `
                            <div class="col-md-3 col-6 mb-3">
                                <img src="${screenshot}" class="img-fluid rounded" alt="Screenshot">
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }
});
