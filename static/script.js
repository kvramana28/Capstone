
document.addEventListener('DOMContentLoaded', () => {
    const pestPredictorForm = document.getElementById('pestPredictorForm');
    const imageUploader = document.getElementById('imageUploader');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const analyzeButton = document.getElementById('analyzeButton');
    
    const spinner = document.getElementById('spinner');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const resultContainer = document.getElementById('resultContainer');
    
    // Camera elements
    const openCameraButton = document.getElementById('openCameraButton');
    const cameraModal = document.getElementById('cameraModal');
    const cameraVideo = document.getElementById('cameraVideo');
    const closeCameraButton = document.getElementById('closeCameraButton');
    const captureButton = document.getElementById('captureButton');
    const cameraCanvas = document.getElementById('cameraCanvas');
    const capturedImageContainer = document.getElementById('capturedImageContainer');
    const capturedImg = document.getElementById('capturedImg');
    const videoContainer = document.getElementById('videoContainer');
    const captureControls = document.getElementById('captureControls');
    const retakeButton = document.getElementById('retakeButton');
    const usePhotoButton = document.getElementById('usePhotoButton');
    const cameraError = document.getElementById('cameraError');
    let stream = null;


    const updatePreview = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewPlaceholder.classList.add('hidden');
                previewImage.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
            analyzeButton.disabled = false;
        }
    };

    if(imageUploader) {
        imageUploader.addEventListener('change', (e) => {
            const file = e.target.files[0];
            updatePreview(file);
            clearResultAndError();
        });
    }

    if(pestPredictorForm) {
        pestPredictorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const file = imageUploader.files[0];
            if (!file) {
                showError('Please select an image first.');
                return;
            }

            const formData = new FormData();
            formData.append('image', file);
            
            setLoading(true);

            try {
                const response = await fetch('/predict', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Server responded with status ${response.status}`);
                }

                const result = await response.json();
                displayResult(result);
            } catch (err) {
                showError(err.message || 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        });
    }

    const setLoading = (isLoading) => {
        if (isLoading) {
            spinner.classList.remove('hidden');
            analyzeButton.disabled = true;
            analyzeButton.textContent = 'Analyzing...';
            clearResultAndError();
        } else {
            spinner.classList.add('hidden');
            analyzeButton.disabled = !imageUploader.files[0];
            analyzeButton.textContent = 'Analyze Crop';
        }
    };

    const clearResultAndError = () => {
        errorContainer.classList.add('hidden');
        resultContainer.classList.add('hidden');
        resultContainer.innerHTML = '';
    };

    const showError = (message) => {
        errorMessage.textContent = message;
        errorContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');
    };
    
    const displayResult = (result) => {
        const isHealthy = result.pest_detected.toLowerCase() === 'healthy';
        const titleBgColor = isHealthy ? 'bg-green-100' : 'bg-orange-100';
        const titleTextColor = isHealthy ? 'text-green-800' : 'text-orange-800';
        const borderColor = isHealthy ? 'border-green-300' : 'border-orange-300';
        const icon = isHealthy ? `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>` : `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>`;

        const formattedAction = (result.recommended_action || '')
            .split(/-\s/g)
            .map(item => item.trim())
            .filter(item => item.length > 0)
            .map(item => `
                <li class="flex items-start space-x-3">
                    <svg class="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>${item}</span>
                </li>`
            ).join('');

        const resultHTML = `
            <div class="bg-white rounded-2xl shadow-xl border ${borderColor} overflow-hidden">
                <div class="p-4 ${titleBgColor} flex items-center space-x-4">
                    ${icon}
                    <div>
                        <h2 class="text-2xl font-bold ${titleTextColor}">${result.pest_detected}</h2>
                        <p class="font-semibold ${titleTextColor} opacity-80">Confidence: ${result.confidence}</p>
                    </div>
                </div>
                <div class="p-6 space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-2">Description</h3>
                        <p class="text-gray-600 leading-relaxed">${result.description}</p>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Recommended Actions</h3>
                        <ul class="space-y-3 text-gray-600">${formattedAction}</ul>
                    </div>
                </div>
            </div>`;
        
        resultContainer.innerHTML = resultHTML;
        resultContainer.classList.remove('hidden');
        errorContainer.classList.add('hidden');
    };
    
    // --- Camera Logic ---
    const startCamera = async () => {
        stopCamera(); // Stop any existing stream
        cameraError.classList.add('hidden');
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
            cameraVideo.srcObject = stream;
        } catch (err) {
            console.error("Camera Error:", err);
            try {
                // Fallback for devices without a rear camera
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                cameraVideo.srcObject = stream;
            } catch (fallbackErr) {
                 cameraError.textContent = "Could not access the camera. Please check permissions and try again.";
                 cameraError.classList.remove('hidden');
            }
        }
    };
    
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    };

    if(openCameraButton) {
        openCameraButton.addEventListener('click', () => {
            cameraModal.classList.remove('hidden');
            retakePhoto();
            startCamera();
        });
    }

    if(closeCameraButton) {
        closeCameraButton.addEventListener('click', () => {
            cameraModal.classList.add('hidden');
            stopCamera();
        });
    }

    const capturePhoto = () => {
        cameraCanvas.width = cameraVideo.videoWidth;
        cameraCanvas.height = cameraVideo.videoHeight;
        cameraCanvas.getContext('2d').drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
        const dataUrl = cameraCanvas.toDataURL('image/jpeg');
        capturedImg.src = dataUrl;

        videoContainer.classList.add('hidden');
        captureControls.classList.add('hidden');
        capturedImageContainer.classList.remove('hidden');
    };

    const retakePhoto = () => {
        videoContainer.classList.remove('hidden');
        captureControls.classList.remove('hidden');
        capturedImageContainer.classList.add('hidden');
    };

    const usePhoto = () => {
        cameraCanvas.toBlob((blob) => {
            const file = new File([blob], "camera-shot.jpg", { type: "image/jpeg" });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            imageUploader.files = dataTransfer.files;
            
            updatePreview(file);
            clearResultAndError();
            
            cameraModal.classList.add('hidden');
            stopCamera();
        }, 'image/jpeg');
    };

    if(captureButton) captureButton.addEventListener('click', capturePhoto);
    if(retakeButton) retakeButton.addEventListener('click', retakePhoto);
    if(usePhotoButton) usePhotoButton.addEventListener('click', usePhoto);

});
