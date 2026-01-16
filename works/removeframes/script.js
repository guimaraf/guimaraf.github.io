document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const videoInput = document.getElementById('video-input');
    const videoPreview = document.getElementById('video-preview');
    const uploadSection = document.getElementById('upload-section');
    const previewSection = document.getElementById('preview-section');
    const processingSection = document.getElementById('processing-section');
    const downloadSection = document.getElementById('download-section');
    const extractBtn = document.getElementById('extract-btn');
    const resetBtn = document.getElementById('reset-btn');
    const newExtractionBtn = document.getElementById('new-extraction-btn');
    const downloadBtn = document.getElementById('download-btn');
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');
    const errorMessage = document.getElementById('error-message');

    // Constants
    const MAX_SIZE_MB = 20;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    let currentZipBlob = null;

    // --- Event Listeners ---

    videoInput.addEventListener('change', handleFileSelect);

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadSection.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    uploadSection.addEventListener('drop', handleDrop, false);

    extractBtn.addEventListener('click', startExtraction);
    resetBtn.addEventListener('click', resetApp);
    newExtractionBtn.addEventListener('click', resetApp);

    downloadBtn.addEventListener('click', () => {
        if (currentZipBlob) {
            saveAs(currentZipBlob, 'frames-fred-extract.zip');
        }
    });

    // --- Helper Functions ---

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFileSelect({ target: { files: files } });
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        errorMessage.textContent = '';

        if (!file) return;

        // Validation
        if (file.size > MAX_SIZE_BYTES) {
            errorMessage.textContent = `Erro: O arquivo é muito grande (${(file.size / 1024 / 1024).toFixed(2)} MB). O limite é ${MAX_SIZE_MB} MB.`;
            return;
        }

        if (!file.type.startsWith('video/')) {
            errorMessage.textContent = 'Erro: Por favor envie um arquivo de vídeo válido.';
            return;
        }

        // Load Video
        const url = URL.createObjectURL(file);
        videoPreview.src = url;

        // Show Preview Section
        uploadSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
    }

    function resetApp() {
        videoInput.value = '';
        videoPreview.pause();
        videoPreview.removeAttribute('src'); // clear source
        currentZipBlob = null;

        // Reset UI
        errorMessage.textContent = '';
        progressBar.style.width = '0%';

        uploadSection.classList.remove('hidden');
        previewSection.classList.add('hidden');
        processingSection.classList.add('hidden');
        downloadSection.classList.add('hidden');
    }

    async function startExtraction() {
        previewSection.classList.add('hidden');
        processingSection.classList.remove('hidden');

        const zip = new JSZip();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const duration = videoPreview.duration;

        // Let's assume a reasonable framerate if we can't detect it, or just scan through
        // Using Seek method. 
        // Note: 'seek' is slow. For a 20MB video locally it should be okay.
        // We will try to capture at roughly 10 fps to avoid thousands of frames for short videos, 
        // or one frame per second? 
        // User said "Extrair todos os frames". 
        // "Todos os frames" usually implies the native framerate.
        // However, HTML Video element doesn't expose strict FPS easily. 
        // We will step by 1/30 (approx 30fps) as a safe default or try to be more granular.

        // A more robust way used in web tools is `requestVideoFrameCallback` but it plays the video.
        // For "fast" extraction we often seek.
        // Let's use a step of 0.04 (approx 25fps) to be safe for standard videos.
        // Or better: Use video width/height from the element.

        canvas.width = videoPreview.videoWidth;
        canvas.height = videoPreview.videoHeight;

        const frameRate = 30; // Assuming 30fps for simplicity in this V1
        const interval = 1 / frameRate;
        let currentTime = 0;
        let frameCount = 0;

        // We need to wait for video to be ready at that timestamp
        const seekResolve = () => {
            return new Promise(resolve => {
                const onSeek = () => {
                    videoPreview.removeEventListener('seeked', onSeek);
                    resolve();
                };
                videoPreview.addEventListener('seeked', onSeek);
                videoPreview.currentTime = currentTime;
            });
        };

        try {
            while (currentTime < duration) {
                await seekResolve();

                // Draw to canvas
                ctx.drawImage(videoPreview, 0, 0, canvas.width, canvas.height);

                // Compress to PNG blob
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                const fileName = `frame_${String(frameCount).padStart(5, '0')}.png`;

                zip.file(fileName, blob);

                // Update Progress
                const percent = Math.min(100, Math.round((currentTime / duration) * 100));
                progressBar.style.width = `${percent}%`;
                statusText.textContent = `Processando frame ${frameCount}... (${percent}%)`;

                currentTime += interval;
                frameCount++;
            }

            // Finalize Zip
            statusText.textContent = 'Compactando arquivos...';
            const content = await zip.generateAsync({ type: 'blob' });
            currentZipBlob = content;

            // Show Download
            processingSection.classList.add('hidden');
            downloadSection.classList.remove('hidden');

        } catch (err) {
            console.error(err);
            alert('Ocorreu um erro durante a extração: ' + err.message);
            resetApp();
        }
    }
});
