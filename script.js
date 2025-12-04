// =============================================
// Wood Location - Mirzaam 2025
// Simple & User-Friendly Form Handling
// =============================================

document.addEventListener('DOMContentLoaded', init);

function init() {
    setupPhoneInput();
    setupFormSubmission();
    setupFieldValidation();
    setupTabNavigation();
    setupQRCodeGeneration();
    setupFormPersistence();
    createProgressIndicator();
}

// =============================================
// Progress Indicator
// =============================================
function createProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = '<div class="progress-bar"></div>';
    document.body.appendChild(progressContainer);
    
    return {
        show: () => {
            progressContainer.classList.add('active');
            setTimeout(() => {
                progressContainer.querySelector('.progress-bar').style.width = '100%';
            }, 10);
        },
        hide: () => {
            progressContainer.querySelector('.progress-bar').style.width = '0%';
            setTimeout(() => {
                progressContainer.classList.remove('active');
            }, 300);
        }
    };
}

const progressIndicator = createProgressIndicator();

// =============================================
// Tab Navigation
// =============================================
function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const formTab = document.getElementById('formTab');
    const qrTab = document.getElementById('qrTab');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Add switching animation
            formTab.classList.add('switching');
            qrTab.classList.add('switching');
            
            // Show/hide tabs after animation
            setTimeout(() => {
                if (tabName === 'form') {
                    formTab.style.display = 'block';
                    qrTab.style.display = 'none';
                } else {
                    formTab.style.display = 'none';
                    qrTab.style.display = 'block';
                }
                
                // Remove animation class
                setTimeout(() => {
                    formTab.classList.remove('switching');
                    qrTab.classList.remove('switching');
                }, 20);
            }, 300);
        });
    });
}

// =============================================
// QR Code Generation
// =============================================
function setupQRCodeGeneration() {
    // Auto-detect current URL
    const urlInput = document.getElementById('urlInput');
    if (urlInput && !urlInput.value) {
        urlInput.value = window.location.origin;
    }
    
    // Allow Enter key to generate
    if (urlInput) {
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateQR();
            }
        });
    }
}

let currentQRCode = null;

function generateQR() {
    const urlInput = document.getElementById('urlInput');
    const qrContainer = document.getElementById('qrcode');
    const placeholder = document.getElementById('qrPlaceholder');
    const downloadBtn = document.getElementById('downloadBtn');
    const generateBtn = document.getElementById('generateBtn');
    const successNote = document.getElementById('successNote');
    
    if (!urlInput || !qrContainer) return;
    
    let url = urlInput.value.trim();
    
    if (!url) {
        showNotification('Please enter a URL', 'error');
        return;
    }
    
    // Add https if not present
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
        urlInput.value = url;
    }
    
    // Show loading state
    generateBtn.classList.add('loading');
    generateBtn.disabled = true;
    progressIndicator.show();
    
    // Clear previous QR code
    qrContainer.innerHTML = '';
    placeholder.style.display = 'none';
    
    // Simulate processing time for better UX
    setTimeout(() => {
        try {
            currentQRCode = new QRCode(qrContainer, {
                text: url,
                width: 250,
                height: 250,
                colorDark: '#1a1412',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
            
            downloadBtn.disabled = false;
            successNote.classList.add('show');
            
            // Haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            showNotification('QR Code generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating QR code:', error);
            showNotification('Error generating QR code. Please try again.', 'error');
        } finally {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
            progressIndicator.hide();
        }
    }, 800);
}

function downloadQR() {
    if (!currentQRCode) return;
    
    const qrImage = document.querySelector('#qrcode img');
    if (!qrImage) return;
    
    progressIndicator.show();
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = qrImage.src;
    link.download = 'wood-location-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    showNotification('QR Code downloaded!', 'success');
    progressIndicator.hide();
}

// =============================================
// Notification System
// =============================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// =============================================
// Form Data Persistence
// =============================================
function setupFormPersistence() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Load saved data on page load
    loadFormData();
    
    // Save data on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => saveFormData());
        input.addEventListener('change', () => saveFormData());
    });
    
    // Clear saved data on successful submission
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('show')) {
                clearSavedFormData();
            }
        });
    });
    
    const successElement = document.getElementById('success');
    if (successElement) {
        observer.observe(successElement, { attributes: true, attributeFilter: ['class'] });
    }
}

function saveFormData() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem('woodLocationFormData', JSON.stringify(data));
}

function loadFormData() {
    const savedData = localStorage.getItem('woodLocationFormData');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        for (let [key, value] of Object.entries(data)) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        }
    } catch (error) {
        console.error('Error loading saved form data:', error);
    }
}

function clearSavedFormData() {
    localStorage.removeItem('woodLocationFormData');
}

// =============================================
// Phone Number Formatting
// =============================================
function setupPhoneInput() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', (e) => {
        // Keep only numbers
        let value = e.target.value.replace(/\D/g, '');
        
        // Max 12 digits for international numbers
        value = value.substring(0, 12);
        
        // Format with spaces for readability
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        
        e.target.value = formatted;
    });

    // Also format on paste
    phoneInput.addEventListener('paste', (e) => {
        setTimeout(() => {
            let value = phoneInput.value.replace(/\D/g, '').substring(0, 12);
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            phoneInput.value = formatted;
        }, 10);
    });
}

// =============================================
// Form Submission
// =============================================
function setupFormSubmission() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const btn = document.getElementById('submitBtn');
    const success = document.getElementById('success');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        if (!validateForm(form)) return;
        
        // Show loading
        btn.classList.add('loading');
        btn.disabled = true;
        progressIndicator.show();
        
        // Get form data
        const formData = new FormData(form);
        
        // Get country code and phone
        const countryCode = document.getElementById('countryCode');
        const phoneInput = document.getElementById('phone');
        
        if (countryCode && phoneInput) {
            const code = countryCode.value;
            const phone = phoneInput.value.replace(/\s/g, '');
            const fullPhone = code + ' ' + phone;
            
            // Update phone field with full number
            // Check which name the phone field has
            if (formData.has('رقم الجوال')) {
                formData.set('رقم الجوال', fullPhone);
            }
            if (formData.has('Phone')) {
                formData.set('Phone', fullPhone);
            }
        }
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success!
                form.classList.add('hidden');
                success.classList.add('show');
                
                showNotification('Form submitted successfully!', 'success');
                
                // Haptic feedback on mobile
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
            } else {
                // Check if it's a redirect (FormSubmit activation)
                const text = await response.text();
                if (text.includes('FormSubmit') || response.status === 200) {
                    form.classList.add('hidden');
                    success.classList.add('show');
                    showNotification('Form submitted successfully!', 'success');
                } else {
                    throw new Error('Form submission failed');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error submitting form. Please try again.', 'error');
            // Try submitting normally as fallback
            form.submit();
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
            progressIndicator.hide();
        }
    });
}

// =============================================
// Field Validation
// =============================================
function setupFieldValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Remove error on input
        input.addEventListener('input', () => {
            const field = input.closest('.field');
            if (field) field.classList.remove('error');
        });
        
        // Validate on blur
        input.addEventListener('blur', () => {
            validateField(input);
        });
    });
}

function validateForm(form) {
    const fields = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Focus first error
    if (!isValid) {
        const firstError = form.querySelector('.field.error input, .field.error select, .field.error textarea');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
}

function validateField(field) {
    const parent = field.closest('.field');
    if (!parent) return true;
    
    let isValid = true;
    
    // Required check
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
        }
    }
    
    // Phone validation (at least 6 digits)
    if (field.id === 'phone' && field.value) {
        const digits = field.value.replace(/\D/g, '');
        if (digits.length < 6) {
            isValid = false;
        }
    }
    
    // Update UI
    if (!isValid) {
        parent.classList.add('error');
    } else {
        parent.classList.remove('error');
    }
    
    return isValid;
}

// =============================================
// Reset Form
// =============================================
function resetForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('success');
    
    if (form && success) {
        form.reset();
        form.classList.remove('hidden');
        success.classList.remove('show');
        
        // Clear any errors
        document.querySelectorAll('.field.error').forEach(f => {
            f.classList.remove('error');
        });
        
        // Clear saved data
        clearSavedFormData();
        
        // Focus first field
        const firstInput = document.getElementById('name');
        if (firstInput) firstInput.focus();
        
        showNotification('Form reset successfully', 'info');
    }
}

// Make functions available globally
window.resetForm = resetForm;
window.generateQR = generateQR;
window.downloadQR = downloadQR;
