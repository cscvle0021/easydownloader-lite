document.addEventListener('DOMContentLoaded', function() {
    const videoUrlInput = document.getElementById('videoUrl');
    const fetchBtn = document.getElementById('fetchBtn');
    const videoInfoDiv = document.getElementById('videoInfo');
    const thumbnailImg = document.getElementById('thumbnail');
    const videoTitle = document.getElementById('videoTitle');
    const formatSelect = document.getElementById('formatSelect');
    const downloadBtn = document.getElementById('downloadBtn');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const errorMessage = document.querySelector('.error-message');

    fetchBtn.addEventListener('click', fetchVideoInfo);
    downloadBtn.addEventListener('click', downloadVideo);

    async function fetchVideoInfo() {
        const url = videoUrlInput.value.trim();
        
        if (!url) {
            showError('Please enter a video URL');
            return;
        }

        try {
            showLoading();
            hideError();
            
            const response = await fetch(`/info?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            
            if (response.ok) {
                displayVideoInfo(data);
            } else {
                showError(data.error || 'Failed to fetch video info');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('An error occurred while fetching video info');
        } finally {
            hideLoading();
        }
    }

    function displayVideoInfo(data) {
        thumbnailImg.src = data.thumbnail;
        videoTitle.textContent = data.title;
        
        // Clear previous options
        formatSelect.innerHTML = '<option value="">Choose a format</option>';
        
        // Add new options
        data.formats.forEach(format => {
            const option = document.createElement('option');
            option.value = format.itag;
            option.textContent = `${format.quality} (${format.container})`;
            formatSelect.appendChild(option);
        });
        
        videoInfoDiv.classList.remove('hidden');
    }

    function downloadVideo() {
        const url = videoUrlInput.value.trim();
        const itag = formatSelect.value;
        
        if (!url || !itag) {
            showError('Please select a format to download');
            return;
        }

        // Open download in new tab
        window.open(`/download?url=${encodeURIComponent(url)}&itag=${itag}`, '_blank');
    }

    function showLoading() {
        loadingDiv.classList.remove('hidden');
        videoInfoDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
    }

    function hideLoading() {
        loadingDiv.classList.add('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorDiv.classList.remove('hidden');
        videoInfoDiv.classList.add('hidden');
    }

    function hideError() {
        errorDiv.classList.add('hidden');
    }
});