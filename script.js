// VoiceGlobe - Speech Recognition Application

class VoiceGlobe {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.speechText = '';
        
        this.initializeElements();
        this.initializeSpeechRecognition();
        this.bindEvents();
        this.checkBrowserSupport();
    }

    initializeElements() {
        this.toggleButton = document.getElementById('toggleButton');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.speechTextBox = document.getElementById('speechTextBox');
        this.inputLanguage = document.getElementById('inputLanguage');
    }

    initializeSpeechRecognition() {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            this.showError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.inputLanguage.value;

        // Event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI();
            this.updateStatus('Listening... Speak now!', 'listening');
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                // Add to speech text
                this.speechText += finalTranscript + ' ';
                this.updateSpeechText();
            }

            if (interimTranscript) {
                this.updateSpeechText(interimTranscript);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.handleRecognitionError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI();
            this.updateStatus('Click to start speech recognition', '');
        };
    }

    bindEvents() {
        // Toggle button
        this.toggleButton.addEventListener('click', () => {
            this.toggleSpeechRecognition();
        });

        // Language change events
        this.inputLanguage.addEventListener('change', () => {
            if (this.recognition) {
                this.recognition.lang = this.inputLanguage.value;
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case ' ':
                        e.preventDefault();
                        this.toggleSpeechRecognition();
                        break;
                    case 'c':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.clearAll();
                        }
                        break;
                }
            }
        });
    }

    toggleSpeechRecognition() {
        if (!this.recognition) {
            this.showError('Speech recognition is not available.');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.startSpeechRecognition();
        }
    }

    async startSpeechRecognition() {
        try {
            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
            
            this.recognition.start();
        } catch (error) {
            console.error('Microphone access error:', error);
            this.showError('Microphone access denied. Please allow microphone access and try again.');
        }
    }

    updateSpeechText(interimText = '') {
        const displayText = this.speechText + (interimText ? ` <span class="highlight">${interimText}</span>` : '');
        this.speechTextBox.innerHTML = displayText || '<p class="text-muted mb-0">Your speech will appear here...</p>';
    }

    updateUI() {
        const button = this.toggleButton;
        const icon = button.querySelector('i');
        const text = button.querySelector('span') || button.childNodes[button.childNodes.length - 1];

        if (this.isListening) {
            button.classList.add('recording');
            button.classList.remove('btn-primary');
            icon.className = 'bi bi-stop-circle-fill me-2';
            text.textContent = 'Stop Recording';
        } else {
            button.classList.remove('recording');
            button.classList.add('btn-primary');
            icon.className = 'bi bi-mic-fill me-2';
            text.textContent = 'Start Speaking';
        }
    }

    updateStatus(message, className = '') {
        this.statusIndicator.textContent = message;
        this.statusIndicator.className = `mt-2 text-muted ${className}`;
    }

    handleRecognitionError(error) {
        let errorMessage = 'Speech recognition error occurred.';
        
        switch (error) {
            case 'no-speech':
                errorMessage = 'No speech detected. Please try speaking again.';
                break;
            case 'audio-capture':
                errorMessage = 'Microphone not found. Please check your microphone.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please allow microphone access.';
                break;
            case 'network':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            case 'service-not-allowed':
                errorMessage = 'Speech recognition service not allowed.';
                break;
        }

        this.showError(errorMessage);
        this.updateStatus(errorMessage, 'error');
    }

    showError(message) {
        // Create a temporary error alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
        alertDiv.innerHTML = `
            <i class="bi bi-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    clearAll() {
        this.speechText = '';
        this.updateSpeechText();
        this.updateStatus('All content cleared', '');
    }

    checkBrowserSupport() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            this.toggleButton.disabled = true;
            this.toggleButton.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Not Supported';
            this.showError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VoiceGlobe();
    
    // Add some helpful console messages
    console.log('🎤 VoiceGlobe initialized successfully!');
    console.log('💡 Tips:');
    console.log('   - Press Ctrl+Space to start/stop recording');
    console.log('   - Press Ctrl+Shift+C to clear all content');
    console.log('   - Make sure to allow microphone access when prompted');
}); 