/* ============================================================
   Lishayy — Contact form validation
   Client-side validation with inline error messages.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { el: form.name,    validate: v => v.trim().length >= 2,                 msg: 'Please enter your name (min 2 characters).' },
    email:   { el: form.email,   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email address.' },
    phone:   { el: form.phone,   validate: v => v.trim() === '' || /^[\d\s()+-]{7,}$/.test(v), msg: 'Please enter a valid phone number.' },
    subject: { el: form.subject, validate: v => v.trim() !== '',                      msg: 'Please select a subject.' },
    message: { el: form.message, validate: v => v.trim().length >= 10,                 msg: 'Your message must be at least 10 characters.' }
  };

  function validateField(key) {
    const f = fields[key];
    if (!f || !f.el) return true;
    const ok = f.validate(f.el.value);
    f.el.classList.toggle('invalid', !ok);
    return ok;
  }

  // Live validation on blur / input
  Object.keys(fields).forEach(key => {
    const f = fields[key];
    if (!f.el) return;
    f.el.addEventListener('blur', () => validateField(key));
    f.el.addEventListener('input', () => {
      if (f.el.classList.contains('invalid')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    Object.keys(fields).forEach(key => { if (!validateField(key)) valid = false; });

    const feedback = document.getElementById('form-feedback');

    if (!valid) {
      showToast('Please fix the highlighted fields.', 'fa-triangle-exclamation');
      const firstInvalid = form.querySelector('.invalid');
      firstInvalid && firstInvalid.focus();
      return;
    }

    // Success (static site — no backend submission)
    feedback.className = 'form-feedback success show';
    feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${fields.name.el.value.trim()}! Your message has been received. We'll reply within 24 hours.`;
    showToast('Message sent successfully!', 'fa-paper-plane');
    form.reset();
    setTimeout(() => feedback.classList.remove('show'), 6000);
  });
});