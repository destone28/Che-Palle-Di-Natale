/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CHE PALLE DI NATALE - MAIN JAVASCRIPT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

// ━━━ DOM CONTENT LOADED ━━━
document.addEventListener('DOMContentLoaded', function() {

  // Initialize all features
  initMobileMenu();
  initSmoothScroll();
  // initLightbox(); // Disabled - gallery no longer clickable
  initAccordion();
  initFormValidation();
  initSnowfall();
  initCookieConsent();

});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOBILE MENU TOGGLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');

      // Animate hamburger icon
      const spans = menuToggle.querySelectorAll('span');
      if (nav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
      } else {
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      }
    });

    // Close menu when clicking a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          nav.classList.remove('active');
          const spans = menuToggle.querySelectorAll('span');
          spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
          });
        }
      });
    });
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SMOOTH SCROLL FOR ANCHOR LINKS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIGHTBOX GALLERY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initLightbox() {
  // Create lightbox element if it doesn't exist
  let lightbox = document.querySelector('.lightbox');

  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <img src="" alt="Lightbox Image">
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  // Add click events to gallery items
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);

  // Close on background click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FAQ ACCORDION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isActive = this.classList.contains('active');

      // Close all other accordions
      faqQuestions.forEach(q => {
        q.classList.remove('active');
        q.nextElementSibling.classList.remove('active');
      });

      // Toggle current accordion
      if (!isActive) {
        this.classList.add('active');
        answer.classList.add('active');
      }
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FORM VALIDATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initFormValidation() {
  const forms = document.querySelectorAll('.form');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Remove previous error messages
      const existingAlerts = form.querySelectorAll('.alert');
      existingAlerts.forEach(alert => alert.remove());

      // Validate form
      const isValid = validateForm(form);

      if (isValid) {
        // Show success message
        showAlert(form, 'success', getSuccessMessage(form));

        // Reset form after 2 seconds
        setTimeout(() => {
          form.reset();
        }, 2000);

        // TODO: Integrate with backend or Google Forms
        // For now, we just show success message
        console.log('Form submitted successfully');

        // Example: Send to Google Forms
        // const formData = new FormData(form);
        // fetch('YOUR_GOOGLE_FORM_URL', {
        //   method: 'POST',
        //   body: formData
        // });

      } else {
        // Show error message
        showAlert(form, 'error', 'Per favore, compila tutti i campi obbligatori correttamente.');
      }
    });
  });
}

// ━━━ Validate Form Fields ━━━
function validateForm(form) {
  let isValid = true;

  // Get all required fields
  const requiredFields = form.querySelectorAll('[required]');

  requiredFields.forEach(field => {
    // Remove previous error styling
    field.style.borderColor = '';

    // Check if field is empty
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = '#C41E3A';
      return;
    }

    // Validate email
    if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value)) {
        isValid = false;
        field.style.borderColor = '#C41E3A';
      }
    }

    // Validate phone (basic Italian format)
    if (field.type === 'tel') {
      const phonePattern = /^[+]?[\d\s\-()]{8,}$/;
      if (!phonePattern.test(field.value)) {
        isValid = false;
        field.style.borderColor = '#C41E3A';
      }
    }

    // Validate checkboxes (privacy, etc)
    if (field.type === 'checkbox') {
      if (!field.checked) {
        isValid = false;
        field.style.outline = '2px solid #C41E3A';
      } else {
        field.style.outline = '';
      }
    }
  });

  return isValid;
}

// ━━━ Show Alert Message ━━━
function showAlert(form, type, message) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  form.insertBefore(alert, form.firstChild);

  // Scroll to alert
  alert.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Remove alert after 5 seconds
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// ━━━ Get Success Message Based on Form Type ━━━
function getSuccessMessage(form) {
  // Check form ID or class to determine message
  if (form.id === 'rivenditori-form' || form.closest('.page-rivenditori')) {
    return 'Grazie per l\'interesse! Ti contatteremo entro 24 ore con tutte le informazioni.';
  } else if (form.id === 'agenti-form' || form.closest('.page-agenti')) {
    return 'Candidatura inviata con successo! Valuteremo il tuo profilo e ti ricontatteremo presto.';
  } else {
    return 'Messaggio inviato con successo! Ti risponderemo al più presto.';
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCROLL TO TOP BUTTON (Optional enhancement)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initScrollToTop() {
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.innerHTML = '↑';
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: #C41E3A;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 1000;
  `;

  document.body.appendChild(scrollBtn);

  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollBtn.style.opacity = '1';
    } else {
      scrollBtn.style.opacity = '0';
    }
  });

  // Scroll to top on click
  scrollBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Uncomment to enable scroll to top button
// initScrollToTop();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITY FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SNOWFALL ANIMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function initSnowfall() {
  const snowflakeCount = 50; // Number of snowflakes
  const snowflakeChars = ['❄', '❅', '❆']; // Different snowflake characters

  for (let i = 0; i < snowflakeCount; i++) {
    createSnowflake();
  }

  function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];

    // Random horizontal position
    snowflake.style.left = Math.random() * 100 + '%';

    // Random animation delay
    snowflake.style.animationDelay = Math.random() * 10 + 's';

    // Random size variation
    const size = Math.random() * 0.5 + 0.8; // Between 0.8 and 1.3
    snowflake.style.fontSize = size + 'em';

    document.body.appendChild(snowflake);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GDPR COOKIE CONSENT MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Cookie consent configuration
const COOKIE_CONFIG = {
  consentCookieName: 'cookie_consent',
  consentDuration: 365, // days
  categories: {
    necessary: { name: 'Necessari', required: true, enabled: true },
    analytics: { name: 'Analitici', required: false, enabled: false },
    marketing: { name: 'Marketing', required: false, enabled: false }
  }
};

// Initialize cookie consent system
function initCookieConsent() {
  // Check if user has already made a choice
  const consent = getCookieConsent();

  if (!consent) {
    // Show cookie banner after short delay
    setTimeout(() => {
      showCookieBanner();
    }, 1000);
  } else {
    // Apply saved preferences
    applyCookiePreferences(consent);
  }

  // Add event listener for "Manage Preferences" button in cookie policy page
  const openSettingsBtn = document.getElementById('open-cookie-settings');
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
      showCookieSettings();
    });
  }
}

// Create and show cookie banner
function showCookieBanner() {
  // Check if banner already exists
  if (document.querySelector('.cookie-banner')) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-banner-content">
      <div class="cookie-banner-text">
        <h3>🍪 Questo sito utilizza i cookie</h3>
        <p>Utilizziamo cookie tecnici per garantire il corretto funzionamento del sito. Con il tuo consenso, vorremmo utilizzare anche cookie analitici per migliorare la tua esperienza.</p>
        <p>Per maggiori informazioni, consulta la nostra <a href="privacy-policy.html">Privacy Policy</a> e <a href="cookie-policy.html">Cookie Policy</a>.</p>
      </div>
      <div class="cookie-banner-buttons">
        <button class="btn-reject">Rifiuta</button>
        <button class="btn-customize">Personalizza</button>
        <button class="btn-accept-all">Accetta Tutti</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Trigger animation
  setTimeout(() => {
    banner.classList.add('show');
  }, 100);

  // Add event listeners
  banner.querySelector('.btn-accept-all').addEventListener('click', () => {
    acceptAllCookies();
    hideCookieBanner();
  });

  banner.querySelector('.btn-reject').addEventListener('click', () => {
    rejectOptionalCookies();
    hideCookieBanner();
  });

  banner.querySelector('.btn-customize').addEventListener('click', () => {
    hideCookieBanner();
    showCookieSettings();
  });
}

// Hide cookie banner
function hideCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (banner) {
    banner.classList.remove('show');
    setTimeout(() => {
      banner.remove();
    }, 400);
  }
}

// Show cookie settings modal
function showCookieSettings() {
  // Check if modal already exists
  let modal = document.querySelector('.cookie-settings-modal');

  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'cookie-settings-modal';

    const consent = getCookieConsent() || {};

    modal.innerHTML = `
      <div class="cookie-settings-content">
        <button class="cookie-settings-close">&times;</button>
        <h2>Impostazioni Cookie</h2>
        <p>Gestisci le tue preferenze sui cookie. I cookie necessari sono sempre attivi per garantire il funzionamento del sito.</p>

        <div class="cookie-category">
          <div class="cookie-category-header">
            <div>
              <h3>Cookie Necessari</h3>
              <span class="cookie-category-required">Sempre Attivo</span>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" id="cookie-necessary" checked disabled>
              <span class="cookie-toggle-slider"></span>
            </label>
          </div>
          <p class="cookie-category-description">
            Questi cookie sono essenziali per il funzionamento del sito web e non possono essere disattivati.
            Includono cookie per la gestione delle preferenze sui cookie e la sicurezza del sito.
          </p>
        </div>

        <div class="cookie-category">
          <div class="cookie-category-header">
            <h3>Cookie Analitici</h3>
            <label class="cookie-toggle">
              <input type="checkbox" id="cookie-analytics" ${consent.analytics ? 'checked' : ''}>
              <span class="cookie-toggle-slider"></span>
            </label>
          </div>
          <p class="cookie-category-description">
            Questi cookie ci aiutano a capire come i visitatori interagiscono con il sito raccogliendo
            informazioni in forma anonima. Ci permettono di migliorare l'esperienza utente.
          </p>
        </div>

        <div class="cookie-category">
          <div class="cookie-category-header">
            <h3>Cookie di Marketing</h3>
            <label class="cookie-toggle">
              <input type="checkbox" id="cookie-marketing" ${consent.marketing ? 'checked' : ''}>
              <span class="cookie-toggle-slider"></span>
            </label>
          </div>
          <p class="cookie-category-description">
            Questi cookie vengono utilizzati per mostrarti pubblicità pertinenti ai tuoi interessi.
            Attualmente non utilizziamo cookie di marketing.
          </p>
        </div>

        <div class="cookie-settings-buttons">
          <button class="btn-cancel">Annulla</button>
          <button class="btn-save">Salva Preferenze</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // Show modal
  setTimeout(() => {
    modal.classList.add('show');
  }, 100);

  // Add event listeners
  const closeBtn = modal.querySelector('.cookie-settings-close');
  const cancelBtn = modal.querySelector('.btn-cancel');
  const saveBtn = modal.querySelector('.btn-save');

  const closeModal = () => {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
    }, 300);
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  saveBtn.addEventListener('click', () => {
    const preferences = {
      necessary: true,
      analytics: document.getElementById('cookie-analytics').checked,
      marketing: document.getElementById('cookie-marketing').checked,
      timestamp: new Date().toISOString()
    };

    saveCookieConsent(preferences);
    applyCookiePreferences(preferences);
    closeModal();
  });

  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Accept all cookies
function acceptAllCookies() {
  const preferences = {
    necessary: true,
    analytics: true,
    marketing: true,
    timestamp: new Date().toISOString()
  };

  saveCookieConsent(preferences);
  applyCookiePreferences(preferences);
}

// Reject optional cookies (only necessary)
function rejectOptionalCookies() {
  const preferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString()
  };

  saveCookieConsent(preferences);
  applyCookiePreferences(preferences);
}

// Save cookie consent to localStorage and cookie
function saveCookieConsent(preferences) {
  // Save to localStorage
  localStorage.setItem(COOKIE_CONFIG.consentCookieName, JSON.stringify(preferences));

  // Save consent cookie (necessary cookie, always allowed)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COOKIE_CONFIG.consentDuration);

  document.cookie = `${COOKIE_CONFIG.consentCookieName}=${JSON.stringify(preferences)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}

// Get cookie consent from localStorage or cookie
function getCookieConsent() {
  // Try localStorage first
  const localConsent = localStorage.getItem(COOKIE_CONFIG.consentCookieName);
  if (localConsent) {
    return JSON.parse(localConsent);
  }

  // Fallback to cookie
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_CONFIG.consentCookieName) {
      return JSON.parse(decodeURIComponent(value));
    }
  }

  return null;
}

// Apply cookie preferences (enable/disable tracking scripts)
function applyCookiePreferences(preferences) {
  // Analytics cookies
  if (preferences.analytics) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }

  // Marketing cookies
  if (preferences.marketing) {
    enableMarketing();
  } else {
    disableMarketing();
  }
}

// Enable Google Analytics (if implemented)
function enableAnalytics() {
  // TODO: Implement Google Analytics when needed
  // Example:
  // window.dataLayer = window.dataLayer || [];
  // function gtag(){dataLayer.push(arguments);}
  // gtag('js', new Date());
  // gtag('config', 'GA_MEASUREMENT_ID');

  console.log('Analytics cookies enabled');
}

// Disable Analytics
function disableAnalytics() {
  // TODO: Disable analytics tracking
  // Example:
  // window['ga-disable-GA_MEASUREMENT_ID'] = true;

  console.log('Analytics cookies disabled');
}

// Enable Marketing cookies
function enableMarketing() {
  // TODO: Implement marketing cookies when needed
  console.log('Marketing cookies enabled');
}

// Disable Marketing cookies
function disableMarketing() {
  // TODO: Disable marketing cookies
  console.log('Marketing cookies disabled');
}
