/*
  VÉRITÉ DERMA CLINIC - Luxury Aesthetic Template
  JavaScript Functionality
*/

document.addEventListener('DOMContentLoaded', function () {
  // Mobile Navigation Controls
  const navToggle = document.getElementById('nav-toggle') || document.querySelector('.nav-toggle');
  const navClose = document.getElementById('nav-close') || document.querySelector('.nav-close');
  const navMenu = document.getElementById('nav-menu') || document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  // Helper to close navigation drawer
  function closeNavMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Toggle menu open/close on hamburger click
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.contains('active');
      if (isOpen) {
        closeNavMenu();
      } else {
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Close menu on 'X' button click
  if (navClose) {
    navClose.addEventListener('click', function () {
      closeNavMenu();
    });
  }

  // Close menu when clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      closeNavMenu();
    });
  });

  // Active Navigation State (based on current page)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(item => {
    const href = item.getAttribute('href');
    if (href) {
      const pageName = href.split('#')[0];
      if (pageName && currentPage.includes(pageName)) {
        item.classList.add('active');
      }
    }
  });

  // Appointment Modal Functionality
  const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalDialog = document.querySelector('.modal-dialog');
  const modalCloseBtn = document.querySelector('.modal-close');
  const modalForm = document.getElementById('appointment-form');

  if (modalBackdrop && modalDialog) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalDialog.classList.contains('active')) {
        closeModal();
      }
    });

    if (modalForm) {
      modalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
          submitForm();
        }
      });
    }
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Modal Functions
  function openModal() {
    modalBackdrop.classList.add('active');
    modalDialog.classList.add('active');
    document.body.classList.add('modal-open');

    modalDialog.lastFocusedElement = document.activeElement;

    const firstInput = modalDialog.querySelector('.form-input');
    if (firstInput) {
      firstInput.focus();
    }
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    modalDialog.classList.remove('active');
    document.body.classList.remove('modal-open');

    if (modalDialog.lastFocusedElement) {
      modalDialog.lastFocusedElement.focus();
    }
  }

  function validateForm() {
    let isValid = true;
    const form = modalForm;

    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());

    const inputs = form.querySelectorAll('.form-input[required], .form-select[required]');
    inputs.forEach(input => {
      if (!input.value.trim()) {
        showError(input, 'This field is required');
        isValid = false;
      }
    });

    const emailInput = form.querySelector('#email');
    if (emailInput && emailInput.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }
    }

    const dateInput = form.querySelector('#date');
    if (dateInput && dateInput.value) {
      const selectedDate = new Date(dateInput.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        showError(dateInput, 'Please select a future date');
        isValid = false;
      }
    }

    const timeInput = form.querySelector('#time');
    if (timeInput && !timeInput.value) {
      showError(timeInput, 'Please select a time');
      isValid = false;
    }

    const serviceCheckboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    if (serviceCheckboxes.length === 0) {
      const servicesLabel = form.querySelector('.form-label[for="services"]') || form;
      showError(servicesLabel, 'Please select at least one service');
      isValid = false;
    }

    return isValid;
  }

  function showError(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    element.parentNode.insertBefore(errorDiv, element.nextSibling);

    if (element.classList.contains('form-input') ||
      element.classList.contains('form-select') ||
      element.classList.contains('form-textarea')) {
      element.classList.add('error');
    }
  }

  function submitForm() {
    const formData = new FormData(modalForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const selectedServices = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.nextElementSibling?.textContent?.trim() || cb.value)
      .join(', ') || 'None';

    const modalBody = modalDialog.querySelector('.modal-body');
    modalBody.innerHTML = `
      <div class="text-center">
        <h3>Appointment Request Prepared</h3>
        <p>Your appointment request has been successfully prepared. This demo form is not connected to a booking system.</p>
        <p><strong>Details:</strong></p>
        <ul class="text-left" style="max-width: 300px; margin: 0 auto;">
          <li>Name: ${data['first-name'] || ''} ${data['last-name'] || ''}</li>
          <li>Email: ${data.email || ''}</li>
          <li>Contact: ${data.contact || ''}</li>
          <li>Date: ${data.date || ''}</li>
          <li>Time: ${data.time || ''}</li>
          <li>Services: ${selectedServices}</li>
        </ul>
        <button class="btn btn-outline mt-5" id="close-success">Close</button>
      </div>
    `;

    const closeBtn = document.getElementById('close-success');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
  }

  // Scroll to top button functionality
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function () {
      const homeSection = document.getElementById('home');
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Results Slider Functionality (With Spam & Overscroll Protection)
  const track = document.querySelector('.results-track');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (track && prevBtn && nextBtn) {
    const getScrollDistance = () => {
      const card = track.querySelector('.result-card');
      if (!card) return 300;

      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 20;
      return card.offsetWidth + gap;
    };

    const navigateSlider = (direction) => {
      const distance = getScrollDistance();
      const maxScroll = track.scrollWidth - track.clientWidth;

      // Calculate the nearest card index based on current scroll position
      const currentIndex = Math.round(track.scrollLeft / distance);
      const targetIndex = currentIndex + direction;

      // Clamp target scroll between 0 and maxScroll
      let targetScroll = targetIndex * distance;
      targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

      track.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    };

    nextBtn.addEventListener('click', () => navigateSlider(1));
    prevBtn.addEventListener('click', () => navigateSlider(-1));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('appointment-modal');
    const appointmentForm = document.getElementById('appointment-form');

    // Function to open modal
    window.openAppointmentModal = function () {
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    // Function to close modal
    window.closeAppointmentModal = function () {
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    // Close listeners (Close buttons & Backdrop)
    document.querySelectorAll('[data-close-modal]').forEach(trigger => {
      trigger.addEventListener('click', closeAppointmentModal);
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.getAttribute('aria-hidden') === 'false') {
        closeAppointmentModal();
      }
    });

    // Form Submission Handling
    if (appointmentForm) {
      appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(appointmentForm);
        const selectedServices = formData.getAll('services');

        if (selectedServices.length === 0) {
          alert('Please select at least one service to proceed.');
          return;
        }

        // Submission logic (e.g., API fetch or email trigger)
        alert('Thank you! Your appointment request has been submitted successfully.');
        appointmentForm.reset();
        closeAppointmentModal();
      });
    }
  });
});