
function setStatus(form, message, type) {
  const status = form.querySelector('.form-status');
  if (!status) return;
  status.textContent = message;
  status.className = 'form-status mt-3 ' + type;
}


document.querySelectorAll('[data-demo-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    setStatus(form, 'Your message was submitted in this demo (not sent to a server).', 'success');
  });
  form.addEventListener('input', () => setStatus(form, '', ''));
});

function updateField(field, showFeedback) {
  const valid = field.checkValidity();
  field.classList.toggle('is-valid', showFeedback && valid);
  field.classList.toggle('is-invalid', showFeedback && !valid);
  return valid;
}

document.querySelectorAll('[data-live-form]').forEach(form => {
  const fields = [...form.querySelectorAll('input, textarea')];
  fields.forEach(field => {
    field.addEventListener('input', () => {
      updateField(field, true);
      setStatus(form, '', '');
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const valid = fields.map(field => updateField(field, true)).every(Boolean);
    setStatus(form, valid ? 'All fields are valid! Demo form submitted.' : 'Please correct the highlighted fields.', valid ? 'success' : 'error');
  });
});

const registrationForm = document.querySelector('[data-registration-form]');
if (registrationForm) {
  const fields = [...registrationForm.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select')];
  const password = registrationForm.querySelector('#password');
  const confirmPassword = registrationForm.querySelector('#confirmPassword');
  const genderInputs = [...registrationForm.querySelectorAll('[name="gender"]')];
  const genderError = registrationForm.querySelector('#genderError');

  function checkPasswords() {
    confirmPassword.setCustomValidity(confirmPassword.value && confirmPassword.value !== password.value ? 'Passwords do not match' : '');
  }

  function refreshField(field) {
    checkPasswords();
    updateField(field, true);
    if (field === password && confirmPassword.value) updateField(confirmPassword, true);
  }

  fields.forEach(field => field.addEventListener('input', () => {
    refreshField(field);
    setStatus(registrationForm, '', '');
  }));

  genderInputs.forEach(field => field.addEventListener('change', () => {
    genderError.textContent = '';
    setStatus(registrationForm, '', '');
  }));

  registrationForm.addEventListener('submit', event => {
    event.preventDefault();
    checkPasswords();
    const fieldsOk = fields.map(field => updateField(field, true)).every(Boolean);
    const genderOk = genderInputs.some(field => field.checked);
    genderError.textContent = genderOk ? '' : 'Please select a gender.';
    const valid = fieldsOk && genderOk;
    setStatus(registrationForm, valid ? 'Registration data is valid! This demo does not create a real account.' : 'Please fix the highlighted fields before submitting.', valid ? 'success' : 'error');
  });

  registrationForm.addEventListener('reset', () => {
    fields.forEach(field => field.classList.remove('is-valid', 'is-invalid'));
    confirmPassword.setCustomValidity('');
    genderError.textContent = '';
    setStatus(registrationForm, '', '');
  });
}
