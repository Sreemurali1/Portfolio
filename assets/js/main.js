/**
* Sreemurali Sekar K - Portfolio Redesign Script
* Theme: Slate & Teal (Premium Developer)
* Layout: Single-Page Vertically Scrolling
*/
!(function($) {
  "use strict";

  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Navigation active state on scroll (ScrollSpy)
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, .mobile-nav');

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function() {
      var top = $(this).offset().top,
          bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 300) {
        $(".nav-menu ul:first li:first, .mobile-nav ul:first li:first").addClass('active');
      }
    });
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  }

  // Close mobile navigation on click
  $(document).on('click', '.mobile-nav a', function(e) {
    if ($('body').hasClass('mobile-nav-active')) {
      $('body').removeClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').fadeOut();
    }
  });

  // Smooth scroll behavior fallback for clicks
  $(document).on('click', '.nav-menu a, .mobile-nav a', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var hash = this.hash;
      var target = $(hash);
      if (target.length) {
        // Let the browser handle standard anchor behavior.
        // Update active class
        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }
      }
    }
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section
  $('.skills-content').waypoint(function() {
    $('.progress .progress-bar').each(function() {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

  // Portfolio isotope and filter
  $(window).on('load', function() {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });
  });

  // Initiate venobox (lightbox feature used in portfolio)
  $(document).ready(function() {
    $('.venobox').venobox();
  });

  // Web3Forms AJAX contact form submission
  $('#contact-form').on('submit', function(e) {
    e.preventDefault();
    
    var $form = $(this);
    var $submitBtn = $('#submit-btn');
    var $btnText = $submitBtn.find('.btn-text');
    var $btnSpinner = $submitBtn.find('.btn-spinner');
    var $statusMsg = $('#form-status');
    
    // Reset status
    $statusMsg.addClass('hidden').removeClass('success error').text('');
    
    // Disable submit button and show spinner
    $submitBtn.prop('disabled', true);
    $btnText.text('Sending...');
    $btnSpinner.removeClass('hidden');
    
    // Serialize data
    var formData = new FormData(this);
    
    // Convert to JSON object for Web3Forms API
    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    var json = JSON.stringify(object);
    
    // Submit via AJAX
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async function(response) {
      var jsonRes = await response.json();
      if (response.status == 200) {
        $statusMsg.addClass('success').removeClass('hidden').text('Thank you! Your message has been sent successfully.');
        $form[0].reset();
      } else {
        console.log(response);
        $statusMsg.addClass('error').removeClass('hidden').text(jsonRes.message || 'Something went wrong. Please try again later.');
      }
    })
    .catch(function(error) {
      console.log(error);
      $statusMsg.addClass('error').removeClass('hidden').text('Failed to send message. Please check your connection and try again.');
    })
    .finally(function() {
      // Re-enable submit button
      $submitBtn.prop('disabled', false);
      $btnText.text('Send Message');
      $btnSpinner.addClass('hidden');
    });
  });

})(jQuery);