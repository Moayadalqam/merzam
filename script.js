// Wood Location - Mirzaam 2025
// Simple Form Handling

document.addEventListener('DOMContentLoaded', init);

function init() {
    checkSubmissionSuccess();
    setupPhoneInput();
    setupFieldValidation();
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
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i === 3 || i === 6) formatted += ' ';
            formatted += value[i];
        }
        e.target.value = formatted;
    });
}

// Field Validation
function setupFieldValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });
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

    parent.classList.toggle('error', !isValid);
    return isValid;
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
        const firstInput = document.getElementById('name');
        if (firstInput) firstInput.focus();
    }
}

window.resetForm = resetForm;
