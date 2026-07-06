document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Preloader
  // ==========================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
    // Fallback if load event doesn't fire
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 2000);
  }

  // ==========================================
  // 2. Monsoon Promo Banner
  // ==========================================
  const promoBanner = document.getElementById('promo-banner');
  const closeBannerBtn = document.getElementById('close-banner');
  
  if (promoBanner && closeBannerBtn) {
    // Check if user dismissed it previously in this session
    if (sessionStorage.getItem('promo_dismissed') === 'true') {
      promoBanner.style.display = 'none';
    } else {
      closeBannerBtn.addEventListener('click', () => {
        promoBanner.style.display = 'none';
        sessionStorage.setItem('promo_dismissed', 'true');
      });
    }
  }

  // ==========================================
  // 3. Mobile Navigation & Hamburger
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });

    // Close menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 4. Sticky Header
  // ==========================================
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ==========================================
  // 5. Scroll Reveal Animation
  // ==========================================
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, stop observing this element
          observer.unobserve(entry.target);
        }
      });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
      root: null, // viewport
      threshold: 0.15, // trigger when 15% in view
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // ==========================================
  // 6. Statistics Counter Animation
  // ==========================================
  const statsSection = document.getElementById('stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statsSection && statNumbers.length > 0) {
    let hasAnimated = false;

    const animateCounters = () => {
      statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds animation
        const startTime = performance.now();

        const updateCounter = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing: easeOutQuad
          const easeProgress = progress * (2 - progress);
          const currentVal = Math.floor(easeProgress * target);
          
          counter.textContent = currentVal.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString() + suffix;
          }
        };

        requestAnimationFrame(updateCounter);
      });
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters();
          hasAnimated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // ==========================================
  // 7. Testimonials Slider (Manual & Auto)
  // ==========================================
  const sliderTrack = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('slider-dots');
  
  if (sliderTrack && slides.length > 0 && dotsContainer) {
    let currentSlide = 0;
    const slideCount = slides.length;
    let autoPlayTimer;

    // Create Navigation Dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    const goToSlide = (index) => {
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;
      
      currentSlide = index;
      sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update Dots active state
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const startAutoPlay = () => {
      autoPlayTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 5000); // Change slide every 5 seconds
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    };

    startAutoPlay();
  }

  // ==========================================
  // 8. Back-To-Top Button & Floating Actions
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 9. Gallery Filter & Lightbox Logic
  // ==========================================
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('lightbox');
  
  if (galleryCards.length > 0) {
    let activeCards = Array.from(galleryCards);
    let currentImgIndex = 0;

    // A. Filter functionality
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        // Filter cards
        galleryCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });

        // Update activeCards list for lightbox navigation
        activeCards = Array.from(galleryCards).filter(card => {
          const cardCat = card.getAttribute('data-category');
          return category === 'all' || cardCat === category;
        });
      });
    });

    // B. Lightbox functionality
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    const updateLightboxImg = (index) => {
      if (index < 0) index = activeCards.length - 1;
      if (index >= activeCards.length) index = 0;
      currentImgIndex = index;

      const selectedCard = activeCards[currentImgIndex];
      const img = selectedCard.querySelector('.gallery-card-img-wrap img');
      const title = selectedCard.querySelector('.gallery-card-title').textContent;
      const category = selectedCard.querySelector('.gallery-card-category').textContent;

      if (lightboxImg) lightboxImg.src = img.src;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxCategory) lightboxCategory.textContent = category;
    };

    galleryCards.forEach((card) => {
      card.addEventListener('click', () => {
        const indexInActive = activeCards.indexOf(card);
        if (indexInActive !== -1) {
          updateLightboxImg(indexInActive);
          if (lightbox) {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
          }
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        if (lightbox) lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
      });
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightboxImg(currentImgIndex - 1);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightboxImg(currentImgIndex + 1);
      });
    }

    // Close on overlay click
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
          lightbox.classList.remove('active');
          document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft') {
          updateLightboxImg(currentImgIndex - 1);
        } else if (e.key === 'ArrowRight') {
          updateLightboxImg(currentImgIndex + 1);
        }
      }
    });
  }

  // ==========================================
  // 10. FAQ Accordion Logic
  // ==========================================
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  if (accordionHeaders.length > 0) {
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');

        // Close all other items
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.accordion-content').style.maxHeight = '0';
          }
        });

        // Toggle clicked item
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  // ==========================================
  // 11. Testimonials Page Carousel (Multi-Slide Support)
  // ==========================================
  const pageSliderTrack = document.getElementById('testimonials-page-track');
  const pageSlides = document.querySelectorAll('.testimonials-page-slide');
  const pageDotsContainer = document.getElementById('testimonials-page-dots');
  const pagePrevBtn = document.getElementById('testimonials-page-prev');
  const pageNextBtn = document.getElementById('testimonials-page-next');

  if (pageSliderTrack && pageSlides.length > 0) {
    let currentPageSlide = 0;
    const pageSlideCount = pageSlides.length;
    let pageAutoPlayTimer;

    // Create Navigation Dots if container exists
    if (pageDotsContainer) {
      pageSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          goToPageSlide(index);
          resetPageAutoPlay();
        });
        pageDotsContainer.appendChild(dot);
      });
    }

    const pageDots = pageDotsContainer ? pageDotsContainer.querySelectorAll('.slider-dot') : [];

    const goToPageSlide = (index) => {
      if (index < 0) index = pageSlideCount - 1;
      if (index >= pageSlideCount) index = 0;
      
      currentPageSlide = index;
      pageSliderTrack.style.transform = `translateX(-${currentPageSlide * 100}%)`;
      
      // Update Dots active state
      if (pageDots.length > 0) {
        pageDots.forEach((dot, idx) => {
          if (idx === currentPageSlide) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    };

    if (pagePrevBtn) {
      pagePrevBtn.addEventListener('click', () => {
        goToPageSlide(currentPageSlide - 1);
        resetPageAutoPlay();
      });
    }

    if (pageNextBtn) {
      pageNextBtn.addEventListener('click', () => {
        goToPageSlide(currentPageSlide + 1);
        resetPageAutoPlay();
      });
    }

    const startPageAutoPlay = () => {
      pageAutoPlayTimer = setInterval(() => {
        goToPageSlide(currentPageSlide + 1);
      }, 5000); // 5 seconds
    };

    const resetPageAutoPlay = () => {
      clearInterval(pageAutoPlayTimer);
      startPageAutoPlay();
    };

    startPageAutoPlay();
  }

  // ==========================================
  // 12. Booking Form Validation & Submission
  // ==========================================
  const bookingForm = document.getElementById('booking-form');
  const successOverlay = document.getElementById('booking-success-overlay');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  if (bookingForm && successOverlay) {
    const inputs = bookingForm.querySelectorAll('.form-input-field[required]');

    // Input-specific instant feedback
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
          input.classList.remove('is-invalid');
        }
      });
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset invalid states
      inputs.forEach(input => {
        input.classList.remove('is-invalid');
      });

      // 1. Check required fields
      inputs.forEach(input => {
        if (input.value.trim() === '') {
          input.classList.add('is-invalid');
          isValid = false;
        }
      });

      // 2. Validate phone number format (Indian phone format, must be 10 digits)
      const phoneInput = document.getElementById('form-phone');
      if (phoneInput) {
        const phoneVal = phoneInput.value.replace(/\D/g, ''); // strip non-digits
        if (phoneVal.length < 10) {
          phoneInput.classList.add('is-invalid');
          isValid = false;
        }
      }

      if (!isValid) {
        // Scroll to the first invalid element
        const firstInvalid = bookingForm.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Populate success confirmation box dynamically
      const formName = document.getElementById('form-name')?.value || '';
      const formPhone = document.getElementById('form-phone')?.value || '';
      const formService = document.getElementById('form-service')?.value || '';
      const formProp = document.getElementById('form-prop')?.value || '';
      const formDate = document.getElementById('form-date')?.value || '';

      document.getElementById('summary-name').textContent = formName;
      document.getElementById('summary-phone').textContent = formPhone;
      document.getElementById('summary-service').textContent = formService;
      document.getElementById('summary-prop').textContent = formProp;
      document.getElementById('summary-date').textContent = formDate;

      // Show the Success popup
      successOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll

      // Reset the form
      bookingForm.reset();
    });

    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener('click', () => {
        successOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
      });
    }

    // Close success box on overlay click
    successOverlay.addEventListener('click', (e) => {
      if (e.target === successOverlay) {
        successOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

});
