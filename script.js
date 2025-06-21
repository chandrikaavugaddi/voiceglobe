// VoiceGlobe - Speech Recognition & Translation Application

class VoiceGlobe {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.originalText = '';
        this.englishText = '';
        this.translationQueue = [];
        this.isTranslating = false;
        
        this.initializeElements();
        this.initializeSpeechRecognition();
        this.bindEvents();
        this.checkBrowserSupport();
    }

    initializeElements() {
        this.toggleButton = document.getElementById('toggleButton');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.originalTextBox = document.getElementById('originalTextBox');
        this.englishTextBox = document.getElementById('englishTextBox');
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
                // Add to original language text
                this.originalText += finalTranscript + ' ';
                this.updateOriginalText();
                // Translate to English
                this.translateToEnglish(finalTranscript.trim());
            }

            if (interimTranscript) {
                this.updateOriginalText(interimTranscript);
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

    updateOriginalText(interimText = '') {
        const displayText = this.originalText + (interimText ? ` <span class="highlight">${interimText}</span>` : '');
        this.originalTextBox.innerHTML = displayText || '<p class="text-muted mb-0">Your speech will appear here in original language...</p>';
    }

    async translateToEnglish(text) {
        if (!text.trim()) return;

        // Add to translation queue
        this.translationQueue.push(text);
        
        if (this.isTranslating) return;
        
        this.isTranslating = true;
        this.updateEnglishStatus('Translating...');

        try {
            const sourceLang = this.getSourceLanguageCode();

            // Try multiple LibreTranslate endpoints for better reliability
            const endpoints = [
                'https://libretranslate.de/translate',
                'https://translate.argosopentech.com/translate',
                'https://libretranslate.com/translate'
            ];

            let translationResult = null;
            let lastError = null;

            for (const endpoint of endpoints) {
                try {
                    console.log(`Trying translation endpoint: ${endpoint}`);
                    
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            q: text,
                            source: sourceLang,
                            target: 'en',
                            format: 'text'
                        }),
                        signal: AbortSignal.timeout(10000)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    const data = await response.json();
                    
                    if (data.translatedText) {
                        translationResult = data.translatedText;
                        console.log(`Translation successful from ${endpoint}`);
                        break;
                    } else {
                        throw new Error('No translation text received');
                    }

                } catch (error) {
                    console.warn(`Translation failed for ${endpoint}:`, error);
                    lastError = error;
                    continue;
                }
            }

            if (translationResult) {
                this.englishText += translationResult + ' ';
                this.updateEnglishText();
                this.updateStatus('Translation completed successfully', '');
            } else {
                throw new Error(`All translation endpoints failed. Last error: ${lastError?.message || 'Unknown error'}`);
            }

        } catch (error) {
            console.error('Translation error:', error);
            
            let errorMessage = 'Translation failed. ';
            
            if (error.name === 'AbortError') {
                errorMessage += 'Request timed out. Please check your internet connection.';
            } else if (error.message.includes('HTTP 429')) {
                errorMessage += 'Rate limit exceeded. Please wait a moment and try again.';
            } else if (error.message.includes('HTTP 503') || error.message.includes('HTTP 502')) {
                errorMessage += 'Translation service temporarily unavailable. Please try again later.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Network error. Please check your internet connection.';
            } else {
                errorMessage += 'Please try again in a moment.';
            }
            
            this.showError(errorMessage);
            this.updateStatus('Translation failed - check error message above', 'error');
            
            // Add the original text to English box with a note
            this.englishText += `[Translation failed: ${text}] `;
            this.updateEnglishText();
        } finally {
            this.isTranslating = false;
            this.updateEnglishStatus('');
            
            // Process next item in queue with a delay
            if (this.translationQueue.length > 0) {
                const nextText = this.translationQueue.shift();
                setTimeout(() => this.translateToEnglish(nextText), 500);
            }
        }
    }

    getSourceLanguageCode() {
        const inputLang = this.inputLanguage.value;
        // Extract language code from speech recognition format (e.g., "en-US" -> "en")
        return inputLang.split('-')[0];
    }

    updateEnglishText() {
        this.englishTextBox.innerHTML = this.englishText || '<p class="text-muted mb-0">English translation will appear here...</p>';
    }

    updateEnglishStatus(status) {
        if (status) {
            this.englishTextBox.innerHTML = `<p class="text-muted mb-0"><span class="loading"></span> ${status}</p>`;
        }
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
        this.originalText = '';
        this.englishText = '';
        this.translationQueue = [];
        this.updateOriginalText();
        this.updateEnglishText();
        this.updateStatus('All content cleared', '');
    }

    checkBrowserSupport() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            this.toggleButton.disabled = true;
            this.toggleButton.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Not Supported';
            this.showError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        }

        // Check for fetch API (for translation)
        if (!window.fetch) {
            this.showError('Translation feature requires a modern browser with fetch API support.');
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
