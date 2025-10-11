function setupContactForm() {
  console.log('Contact form script loaded and running setupContactForm...');
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) {
    console.error('Form not found.');
    return;
  }

  if (contactForm.dataset.listenerAttached) {
    console.log('Listener already attached.');
    return;
  }
  contactForm.dataset.listenerAttached = 'true';

  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submission intercepted.');

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const formData = new FormData(contactForm);
    const formDataObject = Object.fromEntries(formData.entries());
    formDataObject.noWebsite = document.getElementById('noWebsite').checked;
    formDataObject.emailConsent = document.getElementById('emailConsent').checked;

    fetch('https://formspree.io/f/manpyjqj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formDataObject)
    })
    .then(response => {
      if (response.ok) {
        document.querySelector('.contact-form-section').classList.add('hidden');
        document.getElementById('success-message').classList.remove('hidden');
      } else {
        response.json().then(data => {
          alert(data.errors ? data.errors.map(e => e.message).join(', ') : 'Ocorreu um erro.');
        });
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar';
      }
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      alert('Ocorreu um erro de rede.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar';
    });
  });

  const noWebsiteCheckbox = document.getElementById('noWebsite');
  const websiteInput = document.getElementById('website');
  if (noWebsiteCheckbox && websiteInput) {
    noWebsiteCheckbox.addEventListener('change', function() {
      websiteInput.disabled = this.checked;
      websiteInput.style.opacity = this.checked ? '0.5' : '1';
      if (this.checked) websiteInput.value = '';
    });
  }
}

document.addEventListener('astro:page-load', setupContactForm);
setupContactForm();
