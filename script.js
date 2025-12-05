// Wood Location - Mirzaam 2025
// Clean Form Handling

document.addEventListener('DOMContentLoaded', init);

function init() {
    checkSubmissionSuccess();
    setupPhoneInput();
    setupFormSubmission();
    setupFieldValidation();
    setupFormPersistence();
}

// Check if returning from successful FormSubmit submission
function checkSubmissionSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submitted') === 'true') {
        const form = document.getElementById('contactForm');
        const success = document.getElementById('success');
        if (form && success) {
            form.classList.add('hidden');
            success.classList.add('show');
            clearSavedFormData();
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

// Phone Input - Numbers only with formatting
function setupPhoneInput() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 12);

        // Format: XXX XXX XXXX
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i === 3 || i === 6) formatted += ' ';
            formatted += value[i];
        }
        e.target.value = formatted;
    });

    phoneInput.addEventListener('paste', (e) => {
        setTimeout(() => {
            let value = phoneInput.value.replace(/\D/g, '').substring(0, 12);
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i === 3 || i === 6) formatted += ' ';
                formatted += value[i];
            }
            phoneInput.value = formatted;
        }, 10);
    });
}

// Form Submission - Native POST to FormSubmit
function setupFormSubmission() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const btn = document.getElementById('submitBtn');

    form.addEventListener('submit', (e) => {
        // Only validate - don't prevent default
        if (!validateForm(form)) {
            e.preventDefault();
            return;
        }

        // Show loading and let form submit naturally
        btn.classList.add('loading');
        btn.disabled = true;
        clearSavedFormData();
        
        // Form will submit to FormSubmit and redirect back
    });
}

// Field Validation
function setupFieldValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const field = input.closest('.field');
            if (field) field.classList.remove('error');
        });

        input.addEventListener('blur', () => validateField(input));
    });
}

function validateForm(form) {
    const fields = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    let isValid = true;

    fields.forEach(field => {
        if (!validateField(field)) isValid = false;
    });

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

    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
    }

    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) isValid = false;
    }

    if (field.id === 'phone' && field.value) {
        const digits = field.value.replace(/\D/g, '');
        if (digits.length < 6) isValid = false;
    }

    parent.classList.toggle('error', !isValid);
    return isValid;
}

// Form Persistence
function setupFormPersistence() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    loadFormData();

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', saveFormData);
        input.addEventListener('change', saveFormData);
    });
}

function saveFormData() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    localStorage.setItem('woodLocationForm', JSON.stringify(data));
}

function loadFormData() {
    const saved = localStorage.getItem('woodLocationForm');
    if (!saved) return;

    try {
        const data = JSON.parse(saved);
        const form = document.getElementById('contactForm');
        if (!form) return;

        for (let [key, value] of Object.entries(data)) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) input.value = value;
        }
    } catch (e) {
        console.error('Error loading form data:', e);
    }
}

function clearSavedFormData() {
    localStorage.removeItem('woodLocationForm');
}

// Notifications
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Reset Form
function resetForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('success');

    if (form && success) {
        form.reset();
        form.classList.remove('hidden');
        success.classList.remove('show');

        document.querySelectorAll('.field.error').forEach(f => f.classList.remove('error'));
        clearSavedFormData();

        const firstInput = document.getElementById('name');
        if (firstInput) firstInput.focus();
    }
}

window.resetForm = resetForm;
