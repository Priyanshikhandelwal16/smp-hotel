/**
 * Shri Moturam Prasadam - Main JS Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Audio Player (Spiritual Ambiance) ---
  const musicToggle = document.getElementById('music-toggle');
  const bgMusic = document.getElementById('bg-music');
  const musicText = document.querySelector('.music-text');

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play()
          .then(() => {
            musicToggle.classList.add('playing');
            if (musicText) musicText.textContent = 'Spiritual Music: ON';
          })
          .catch(error => {
            console.error('Audio playback failed:', error);
          });
      } else {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        if (musicText) musicText.textContent = 'Spiritual Music: OFF';
      }
    });
  }

  // --- Sticky Navigation & Active Link Highlight ---
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy active class toggling
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run once initially

  // --- Mobile Navigation Menu ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const menuLinks = document.querySelectorAll('.nav-menu .nav-link, .nav-menu .btn');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileNavToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when the mobile close cross button is clicked
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // --- Smooth Scrolling with Sticky Nav Offset ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight + 5;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Menu Tabs Handling ---
  const tabButtons = document.querySelectorAll('.menu-tab-btn');
  const menuPanels = document.querySelectorAll('.menu-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update active states for buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/Hide corresponding menu panels
      menuPanels.forEach(panel => {
        if (panel.id === `${targetTab}-panel`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // --- Gallery Filter and Lightbox ---
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  // Filter gallery items
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox view
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore page scrolling
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // --- Customer Reviews Slide Show ---
  const slider = document.querySelector('.reviews-slider');
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.getElementById('review-prev');
  const nextBtn = document.getElementById('review-next');
  let currentSlide = 0;

  const showSlide = (idx) => {
    if (!slider || slides.length === 0) return;
    
    if (idx >= slides.length) {
      currentSlide = 0;
    } else if (idx < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = idx;
    }
    
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
  };

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });

    // Auto rotate reviews every 7 seconds
    let reviewInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 7000);

    // Reset timer on manual click
    const resetInterval = () => {
      clearInterval(reviewInterval);
      reviewInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 7000);
    };

    prevBtn.addEventListener('click', resetInterval);
    nextBtn.addEventListener('click', resetInterval);
  }

  // --- Reservation Modals ---
  const bookingModal = document.getElementById('booking-modal');
  const modalClose = document.getElementById('modal-close');
  const openModalBtns = document.querySelectorAll('.open-booking');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (bookingModal) {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose && bookingModal) {
    modalClose.addEventListener('click', () => {
      bookingModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // --- Forms Submissions (Simulated Divine Success popup) ---
  const bookingForm = document.getElementById('booking-form');
  const modalBookingForm = document.getElementById('modal-booking-form');
  const contactForm = document.getElementById('contact-form');

  const handleFormSubmit = (form, formType) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect data
      const formData = new FormData(form);
      const dataObj = {};
      formData.forEach((value, key) => {
        dataObj[key] = value;
      });

      console.log(`${formType} submitted:`, dataObj);

      // Hide form fields & Show custom success popup
      const formWrapper = form.closest('.form-wrapper') || form.parentElement;
      const successMsg = formWrapper.querySelector('.form-success-msg');
      
      if (successMsg) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (formType === 'Modal Booking') {
        // Modal specific response
        const modalContainer = bookingModal.querySelector('.modal-container');
        const modalSuccess = modalContainer.querySelector('.form-success-msg');
        if (modalSuccess) {
          form.style.display = 'none';
          modalSuccess.style.display = 'block';
        }
      }
    });
  };

  if (bookingForm) handleFormSubmit(bookingForm, 'Visit Us Booking');
  if (modalBookingForm) handleFormSubmit(modalBookingForm, 'Modal Booking');
  if (contactForm) handleFormSubmit(contactForm, 'Contact Form');

  // --- Micro-Animations: Reveal Scroll Observer ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
});
