const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

function setInvalid(field, bad) {
  field.classList.toggle('invalid', bad);
}

function initContact() {
  var form = document.getElementById('leadForm');
  var success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name,
      email = form.email,
      phone = form.phone,
      message = form.message;
    var ok = true;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    setInvalid(name.closest('.field'), !name.value.trim());
    if (!name.value.trim()) ok = false;
    setInvalid(email.closest('.field'), !emailOk);
    if (!emailOk) ok = false;
    setInvalid(phone.closest('.field'), phone.value.trim().length < 6);
    if (phone.value.trim().length < 6) ok = false;
    setInvalid(message.closest('.field'), !message.value.trim());
    if (!message.value.trim()) ok = false;
    if (!ok) {
      var firstBad = form.querySelector('.field.invalid input, .field.invalid textarea');
      if (firstBad) firstBad.focus();
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    fetch(STRAPI_URL + '/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          name: name.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          message: message.value.trim(),
          submittedAt: new Date().toISOString(),
        },
      }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        form.style.display = 'none';
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function () {
        if (submitBtn) submitBtn.disabled = false;
        alert("Sorry, something went wrong sending your enquiry. Please try again or call us directly.");
      });
  });

  Array.prototype.forEach.call(form.querySelectorAll('input,textarea'), function (el) {
    el.addEventListener('input', function () {
      el.closest('.field').classList.remove('invalid');
    });
  });
}

document.addEventListener('astro:page-load', initContact);
