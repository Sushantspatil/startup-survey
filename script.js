document.getElementById('survey-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check if at least one checkbox is checked for required checkbox groups
    const reasonChecked = document.querySelectorAll('input[name="reason"]:checked').length;
    const concernsChecked = document.querySelectorAll('input[name="concerns"]:checked').length;
    const trustChecked = document.querySelectorAll('input[name="trust_features"]:checked').length;
    
    let isValid = true;
    let firstInvalidElement = null;

    if (reasonChecked === 0) {
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = document.querySelector('input[name="reason"]').closest('.question-group');
        firstInvalidElement.querySelector('label').style.color = 'var(--error)';
    } else {
        document.querySelector('input[name="reason"]').closest('.question-group').querySelector('label').style.color = 'inherit';
    }

    if (concernsChecked === 0) {
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = document.querySelector('input[name="concerns"]').closest('.question-group');
        firstInvalidElement.querySelector('label').style.color = 'var(--error)';
    } else {
        document.querySelector('input[name="concerns"]').closest('.question-group').querySelector('label').style.color = 'inherit';
    }

    if (trustChecked === 0) {
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = document.querySelector('input[name="trust_features"]').closest('.question-group');
        firstInvalidElement.querySelector('label').style.color = 'var(--error)';
    } else {
        document.querySelector('input[name="trust_features"]').closest('.question-group').querySelector('label').style.color = 'inherit';
    }

    if (!isValid) {
        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add a subtle shake animation to the submit button
        const btn = document.querySelector('.btn-submit');
        btn.style.animation = 'none';
        btn.offsetHeight; /* trigger reflow */
        btn.style.animation = 'shake 0.4s';
        return;
    }

    // Collect Data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    // Handle multiple checkboxes
    data.reasons = formData.getAll('reason').join(', ');
    data.concerns = formData.getAll('concerns').join(', ');
    data.trust_features = formData.getAll('trust_features').join(', ');
    
    // Change button text to show loading state
    const btn = document.querySelector('.btn-submit');
    const originalBtnText = btn.innerText;
    btn.innerText = 'Submitting...';
    btn.disabled = true;

    // Send data to Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            // Hide form, show success
            document.getElementById('survey-form').classList.add('hidden');
            document.querySelector('.header').classList.add('hidden');
            
            const successMsg = document.getElementById('success-message');
            successMsg.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.log(response);
            alert("Something went wrong! Please try again.");
            btn.innerText = originalBtnText;
            btn.disabled = false;
        }
    })
    .catch(error => {
        console.log(error);
        alert("Something went wrong! Please try again.");
        btn.innerText = originalBtnText;
        btn.disabled = false;
    });
});

// Remove error styling on checkbox change
document.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', function() {
        const group = this.closest('.question-group');
        group.querySelector('label').style.color = 'inherit';
    });
});

// Add shake keyframes dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}`;
document.head.appendChild(style);
