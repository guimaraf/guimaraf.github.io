document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dropZone = document.getElementById('dropZone');
    const videoInput = document.getElementById('videoInput');
    const uploadSection = document.getElementById('uploadSection');
    const editorSection = document.getElementById('editorSection');
    const video = document.getElementById('videoPreview');
    const slider = document.getElementById('videoSlider');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const prevFrameBtn = document.getElementById('prevFrameBtn');
    const nextFrameBtn = document.getElementById('nextFrameBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const exportBtn = document.getElementById('exportBtn');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Constants
    const FPS = 30; // Assuming 30fps for stepping (can be adjusted or detected)
    const FRAME_STEP = 1 / FPS;

    // Helper to format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    };

    // Load Video
    const handleFile = (file) => {
        if (!file || !file.type.startsWith('video/')) return;
        
        const url = URL.createObjectURL(file);
        video.src = url;
        
        video.onloadedmetadata = () => {
            uploadSection.classList.add('hidden');
            editorSection.classList.remove('hidden');
            
            slider.max = video.duration;
            slider.value = 0;
            totalTimeEl.textContent = formatTime(video.duration);
            currentTimeEl.textContent = "00:00.00";
            
            // Set canvas size to match video resolution
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        };
    };

    // Event Listeners for File Upload
    dropZone.addEventListener('click', () => videoInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-color)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--border-color)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    videoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    // Video Controls
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playIcon.textContent = '⏸';
        } else {
            video.pause();
            playIcon.textContent = '▶';
        }
    });

    video.addEventListener('timeupdate', () => {
        if (!isDragging) {
            slider.value = video.currentTime;
        }
        currentTimeEl.textContent = formatTime(video.currentTime);
    });

    video.addEventListener('ended', () => {
        playIcon.textContent = '▶';
    });

    // Slider Interaction
    let isDragging = false;

    slider.addEventListener('input', () => {
        isDragging = true;
        video.currentTime = slider.value;
        currentTimeEl.textContent = formatTime(slider.value);
    });

    slider.addEventListener('change', () => {
        isDragging = false;
        video.currentTime = slider.value;
    });

    // Frame Stepping
    prevFrameBtn.addEventListener('click', () => {
        video.pause();
        playIcon.textContent = '▶';
        video.currentTime = Math.max(0, video.currentTime - FRAME_STEP);
    });

    nextFrameBtn.addEventListener('click', () => {
        video.pause();
        playIcon.textContent = '▶';
        video.currentTime = Math.min(video.duration, video.currentTime + FRAME_STEP);
    });

    // Export Logic
    exportBtn.addEventListener('click', () => {
        if (!video.videoWidth) return;

        // Draw current frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to PNG and download
        const timestamp = formatTime(video.currentTime).replace(':', '-').replace('.', '_');
        const filename = `fred-frame-${timestamp}.png`;

        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png', 1.0); // Highest quality
        link.click();
    });
});
