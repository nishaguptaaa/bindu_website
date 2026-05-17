// ============================
// YOGA WITH BINDU — form.js
// Multi-step form logic + Google Sheets submission
// ============================

// ============================================================
// GOOGLE APPS SCRIPT URL
// After setting up Google Apps Script, paste your Web App URL here:
// ============================================================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzVERtHPOtN7W_I_SYwhDqQpB1WtHfLgckUlyG3F39TUq8dQN5sz5DSstEDjApTqE9S/exec';

// Track current step and selected service
let currentStep = 'step1';
let selectedService = null;
const totalSteps = 5;
let currentStepNum = 1;

// Step order map
const stepOrder = {
  'step1': { next: 'step2', prev: null, num: 1 },
  'step2': { next: null, prev: 'step1', num: 2 }, // next depends on service
  'step3reiki': { next: 'step4', prev: 'step2', num: 3 },
  'step3yoga':  { next: 'step4', prev: 'step2', num: 3 },
  'step4': { next: 'step5', prev: null, num: 4 }, // prev depends on service
  'step5': { next: 'stepSuccess', prev: 'step4', num: 5 },
};

// Update progress bar
function updateProgress(stepNum) {
  const pct = ((stepNum - 1) / (totalSteps - 1)) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('stepLabel').textContent = `Step ${stepNum} of ${totalSteps}`;
}

// Show a step
function showStep(stepId, stepNum) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.getElementById(stepId).classList.add('active');
  currentStep = stepId;
  currentStepNum = stepNum;
  updateProgress(stepNum);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Switch waiver content based on service when reaching step 5
  if (stepId === 'step5') {
    const isDots = selectedService === 'dots';
    document.getElementById('waiverHeaderFull').style.display = isDots ? 'none' : 'block';
    document.getElementById('waiverHeaderDots').style.display = isDots ? 'block' : 'none';
    document.getElementById('waiverTextFull').style.display = isDots ? 'none' : 'block';
    document.getElementById('waiverTextDots').style.display = isDots ? 'block' : 'none';
    document.getElementById('waiverCheckboxLabel').textContent = isDots
      ? 'I have read the event agreement above and agree to its terms.'
      : 'I have read the full waiver and agree to its terms. I understand this is a legally binding agreement.';
    document.getElementById('submitNote').textContent = isDots
      ? 'After submitting, Bindu will be in touch within 1–2 business days to discuss your event and provide a custom quote.'
      : 'After submitting, Bindu will be in touch within 1–2 business days to confirm your session details.';
    document.getElementById('submitBtn').textContent = isDots
      ? 'Submit Inquiry'
      : 'Submit Registration';
  }
}

// Next step
function nextStep(from) {
  if (!validateStep(from)) return;

  if (from === 1 || from === 'step1') {
    showStep('step2', 2);
  } else if (from === 2 || from === 'step2') {
    if (!selectedService) {
      alert('Please select a service to continue.');
      return;
    }
    if (selectedService === 'reiki') {
      showStep('step3reiki', 3);
    } else if (selectedService === 'yoga') {
      showStep('step3yoga', 3);
    } else if (selectedService === 'dots') {
      showStep('step3dots', 3);
    }
  } else if (from === '3reiki' || from === 'step3reiki') {
    showStep('step4', 4);
  } else if (from === '3yoga' || from === 'step3yoga') {
    showStep('step4', 4);
  } else if (from === '3dots' || from === 'step3dots') {
    // Dots skips payment — go straight to waiver
    showStep('step5', 5);
  } else if (from === 4 || from === 'step4') {
    showStep('step5', 5);
  }
}

// Previous step
function prevStep(from) {
  if (from === 2 || from === 'step2') {
    showStep('step1', 1);
  } else if (from === '3reiki' || from === 'step3reiki') {
    showStep('step2', 2);
  } else if (from === '3yoga' || from === 'step3yoga') {
    showStep('step2', 2);
  } else if (from === '3dots' || from === 'step3dots') {
    showStep('step2', 2);
  } else if (from === 4 || from === 'step4') {
    if (selectedService === 'reiki') {
      showStep('step3reiki', 3);
    } else {
      showStep('step3yoga', 3);
    }
  } else if (from === 5 || from === 'step5') {
    if (selectedService === 'dots') {
      showStep('step3dots', 3);
    } else {
      showStep('step4', 4);
    }
  }
}

// Service selection
function selectService(service) {
  selectedService = service;
  document.getElementById('selectedService').value = service;

  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
  if (service === 'reiki') {
    document.getElementById('serviceReiki').classList.add('selected');
  } else if (service === 'yoga') {
    document.getElementById('serviceYoga').classList.add('selected');
  } else if (service === 'dots') {
    document.getElementById('serviceDots').classList.add('selected');
  }
}

// Validation
function validateStep(step) {
  let valid = true;

  if (step === 1 || step === 'step1') {
    const fields = ['email', 'fullName', 'address', 'phone', 'dob', 'medicalCare'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        el.classList.add('field-error');
        valid = false;
      } else {
        el.classList.remove('field-error');
      }
    });
    if (!valid) {
      // Scroll to first error
      const firstError = document.querySelector('.field-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  if (step === '3reiki') {
    const intention = document.getElementById('reikiIntention');
    const reikiSession = document.querySelector('input[name="reikiSession"]:checked');
    const reikiBefore = document.querySelector('input[name="reikiBefore"]:checked');

    if (!reikiBefore) { valid = false; }
    if (!intention.value.trim()) { intention.classList.add('field-error'); valid = false; }
    else { intention.classList.remove('field-error'); }
    if (!reikiSession) { valid = false; }

    if (!valid) alert('Please complete all required fields before continuing.');
  }

  if (step === '3dots') {
    const eventType = document.querySelector('input[name="eventType"]:checked');
    const eventGuests = document.getElementById('eventGuests');
    const eventDate = document.getElementById('eventDate');
    const eventLocation = document.getElementById('eventLocation');

    if (!eventType) { valid = false; }
    if (!eventGuests.value.trim()) { eventGuests.classList.add('field-error'); valid = false; }
    else { eventGuests.classList.remove('field-error'); }
    if (!eventDate.value.trim()) { eventDate.classList.add('field-error'); valid = false; }
    else { eventDate.classList.remove('field-error'); }
    if (!eventLocation.value.trim()) { eventLocation.classList.add('field-error'); valid = false; }
    else { eventLocation.classList.remove('field-error'); }

    if (!valid) alert('Please complete all required fields before continuing.');
  }

  if (step === '3yoga') {
    const yogaSession = document.querySelector('input[name="yogaSession"]:checked');
    if (!yogaSession) {
      valid = false;
      alert('Please select a session to continue.');
    }
  }

  if (step === 4 || step === 'step4') {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
      valid = false;
      alert('Please select a payment method to continue.');
    }
  }

  return valid;
}

// Show/hide cash note field
document.addEventListener('change', function(e) {
  if (e.target.name === 'paymentMethod') {
    const cashField = document.getElementById('cashNoteField');
    if (e.target.value === 'Check or cash') {
      cashField.style.display = 'flex';
    } else {
      cashField.style.display = 'none';
    }
  }
});

// Collect all form data
function collectFormData() {
  const data = {
    timestamp: new Date().toLocaleString(),
    email: document.getElementById('email').value,
    fullName: document.getElementById('fullName').value,
    address: document.getElementById('address').value,
    phone: document.getElementById('phone').value,
    dateOfBirth: document.getElementById('dob').value,
    medicalCare: document.getElementById('medicalCare').value,
    service: selectedService === 'reiki' ? 'Reiki' : selectedService === 'yoga' ? 'Yoga & Meditation' : 'Dots With Bindu — Event Inquiry',
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || '',
    cashNote: document.getElementById('cashNote')?.value || '',
    waiverDate: document.getElementById('waiverDate').value,
    electronicSignature: document.getElementById('signature').value,
    waiverAgreed: document.getElementById('waiverAgree').checked ? 'Yes' : 'No',
  };

  if (selectedService === 'reiki') {
    data.reikiSessionBefore = document.querySelector('input[name="reikiBefore"]:checked')?.value || '';
    data.reikiIntention = document.getElementById('reikiIntention').value;
    data.reikiSession = document.querySelector('input[name="reikiSession"]:checked')?.value || '';
  } else if (selectedService === 'yoga') {
    data.yogaSession = document.querySelector('input[name="yogaSession"]:checked')?.value || '';
    data.yogaNotes = document.getElementById('yogaNotes').value;
  } else if (selectedService === 'dots') {
    data.eventType = document.querySelector('input[name="eventType"]:checked')?.value || '';
    data.eventGuests = document.getElementById('eventGuests').value;
    data.eventDate = document.getElementById('eventDate').value;
    data.eventLocation = document.getElementById('eventLocation').value;
    data.eventNotes = document.getElementById('eventNotes').value;
  }

  return data;
}

// Submit form
async function submitForm() {
  // Final validation
  const signature = document.getElementById('signature').value.trim();
  const waiverDate = document.getElementById('waiverDate').value;
  const waiverAgree = document.getElementById('waiverAgree').checked;

  if (!signature || !waiverDate || !waiverAgree) {
    alert('Please complete the date, electronic signature, and waiver agreement checkbox before submitting.');
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  const formData = collectFormData();

  try {
    // Use FormData with URLSearchParams for Google Apps Script compatibility
    const params = new URLSearchParams();
    Object.keys(formData).forEach(key => {
      params.append(key, formData[key]);
    });

    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    // Show success
    showStep('stepSuccess', 6);
    document.getElementById('formProgress').style.display = 'none';
    document.getElementById('stepLabel').style.display = 'none';

    // Update success message for dots
    if (selectedService === 'dots') {
      document.getElementById('successTitle').textContent = 'Inquiry Received';
      document.getElementById('successMsg1').textContent = 'Thank you for your interest in a Dots With Bindu event! Bindu will be in touch within 1–2 business days to discuss your event and provide a custom quote.';
      document.getElementById('successMsg2').textContent = 'In the meantime, feel free to reach out directly at doyogawithbindu@gmail.com or 774-253-5571.';
    }

  } catch (error) {
    console.error('Submission error:', error);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Registration';
    alert('There was an issue submitting your form. Please try again or contact Bindu directly at yogawithbindu@gmail.com.');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  showStep('step1', 1);

  // Pre-fill today's date for waiver
  const today = new Date().toISOString().split('T')[0];
  const waiverDate = document.getElementById('waiverDate');
  if (waiverDate) waiverDate.value = today;
});