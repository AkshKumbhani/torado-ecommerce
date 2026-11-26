jQuery(function ($) {
    'use strict';
	
	// Header Sticky
	$(window).on('scroll',function() {
		if ($(this).scrollTop() > 30){  
			$('.ts-navbar-area').addClass("is-sticky");
		}
		else{
			$('.ts-navbar-area').removeClass("is-sticky");
		}
	});

	// Mean Menu
	jQuery('.mean-menu').meanmenu({
		meanScreenWidth: "1199"
	});
	
	// Others Option For Responsive JS
	$(".ts-others-option-for-responsive .dot-menu").on("click", function(){
		$(".ts-others-option-for-responsive .container .container").toggleClass("active");
	});
	
	// Note Form JS
	$('.note-content').on('click', function() {
		$('.note-form').addClass('active-note-form');
	});
	$('.note-form .close').on('click', function() {
		$('.note-form').removeClass('active-note-form');
	});

	// Shipping Form JS
	$('.shipping-content').on('click', function() {
		$('.shipping-form').addClass('active-shipping-form');
	});
	$('.shipping-form .close').on('click', function() {
		$('.shipping-form').removeClass('active-shipping-form');
	});
	
	// Input Plus & Minus Number JS
	$('.input-counter').each(function() {
		var spinner = jQuery(this),
		input = spinner.find('input[type="text"]'),
		btnUp = spinner.find('.plus-btn'),
		btnDown = spinner.find('.minus-btn'),
		min = input.attr('min'),
		max = input.attr('max');
		
		btnUp.on('click', function() {
			var oldValue = parseFloat(input.val());
			if (oldValue >= max) {
				var newVal = oldValue;
			} else {
				var newVal = oldValue + 1;
			}
			spinner.find("input").val(newVal);
			spinner.find("input").trigger("change");
		});
		btnDown.on('click', function() {
			var oldValue = parseFloat(input.val());
			if (oldValue <= min) {
				var newVal = oldValue;
			} else {
				var newVal = oldValue - 1;
			}
			spinner.find("input").val(newVal);
			spinner.find("input").trigger("change");
		});
	});

	// Filter Dropdown JS
	$(".filter-option").each(function() {
        var each = $(this)
        each.find(".filter-name").html(each.find(".filter-dropdown-menu a:nth-child(1)").text());
        var allOptions = $(".filter-dropdown-menu").children('a');
        each.find(".filter-dropdown-menu").on("click", "a", function() {
            allOptions.removeClass('selected');
            $(this).addClass('selected');
            $(this).closest(".filter-option").find(".filter-name").html($(this).text());
        });
    })

	// EM Hot Deals Countdown
	$('.countdown').downCount({
		date: '08/27/2027 12:00:00',
		offset: -5
	}, function () {
		alert('WOOT WOOT, done!');
	});

	// TS Products Collection Slides
	$('.ts-products-collection-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: false,
		smartSpeed: 500,
		margin: 20,
		autoplayHoverPause: true,
		autoplay: false,
		autoHeight: true,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		],
		responsive: {
			0: {
				items: 1
			},
			576: {
				items: 1
			},
			768: {
				items: 2
			},
			1024: {
				items: 3
			},
			1200: {
				items: 4
			},
		}
	});

	// TS Customize Slides JS
	$('.ts-customize-slides').owlCarousel({
		loop: true,
		margin: 0,
		nav: true,
		thumbs: true,
		thumbsPrerendered: true,
		items: 1,
		dots: false,
		autoplay: true,
		
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>",
		],
	});

	// TS Flash Sale Slides
	$('.ts-flash-sale-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: false,
		smartSpeed: 500,
		margin: 20,
		autoplayHoverPause: true,
		autoplay: false,
		autoHeight: true,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		],
		responsive: {
			0: {
				items: 1
			},
			576: {
				items: 1
			},
			768: {
				items: 2
			},
			1024: {
				items: 2
			},
			1200: {
				items: 3
			},
		}
	});

	// TS Reviews Slides
	$('.ts-reviews-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: false,
		smartSpeed: 500,
		margin: 20,
		autoplayHoverPause: true,
		autoplay: false,
		autoHeight: true,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		],
		responsive: {
			0: {
				items: 1
			},
			576: {
				items: 1
			},
			768: {
				items: 2
			},
			1024: {
				items: 2
			},
			1200: {
				items: 3
			},
			1600: {
				items: 4
			},
		}
	});
	$('.ts-reviews-wrap-slides').owlCarousel({
		loop: true,
		nav: true,
		dots: false,
		smartSpeed: 500,
		margin: 20,
		autoplayHoverPause: true,
		autoplay: false,
		autoHeight: true,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		],
		responsive: {
			0: {
				items: 1
			},
			576: {
				items: 1
			},
			768: {
				items: 2
			},
			1024: {
				items: 2
			},
			1200: {
				items: 3
			},
		}
	});

	// TS Product Details Image Slider JS
	$('.ts-product-details-image-slider').owlCarousel({
		loop: true,
		margin: 0,
		dots: false,
		nav: false,
		mouseDrag: true,
		thumbs: true,
		thumbsPrerendered: true,
		items: 1,
		autoHeight: true,
		autoplay: true,
		autoplayHoverPause: true,
	});

	// TS Brands Slides
	$('.ts-brands-slides').owlCarousel({
		loop: true,
		nav: false,
		dots: false,
		smartSpeed: 500,
		margin: 25,
		autoplayHoverPause: true,
		autoplay: false,
		autoHeight: true,
		
		responsive: {
			0: {
				items: 2
			},
			576: {
				items: 3
			},
			768: {
				items: 4
			},
			1024: {
				items: 5
			},
			1200: {
				items: 8
			},
			1600: {
				items: 9
			},
		}
	});

	// TS Products Sidebar Collapse Accordion
    $(function() {
        $('.collapse-widget').find('.collapse-widget-title').on('click', function(){
            // Adds Active Class
            $(this).toggleClass('active');
            // Adds Open Class
            $('.collapse-widget').toggleClass('open');
            // Expand or Collapse This Panel
            $(this).next().slideToggle('800');
        });
    });

	// EM Show More Products Widget JS
	$(".widget_list_fabric .ts-show-more-btn span").on("click", function(){
		$(".widget_list_fabric li").toggleClass("active");
	});
	$(".widget_reviews .ts-show-more-btn span").on("click", function(){
		$(".widget_reviews li").toggleClass("active");
	});
	$(".widget_availability .ts-show-more-btn span").on("click", function(){
		$(".widget_availability li").toggleClass("active");
	});
	$(".widget_tags .ts-show-more-btn span").on("click", function(){
		$(".widget_tags li").toggleClass("active");
	});

	// Odometer JS
    $('.odometer').appear(function(e) {
        var odo = $(".odometer");
        odo.each(function() {
            var countNumber = $(this).attr("data-count");
            $(this).html(countNumber);
        });
    });

	// Popup Video
	$('.popup-youtube').magnificPopup({
		disableOn: 320,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false
	});

	// FAQ Categories List Active
	$(".ts-categories-list li a").mouseover(function(){
		$('.ts-categories-list li a.active').removeClass('active');
		$(this).addClass('active');
	});

	// FAQ Accordion
    $(function() {
        $('.accordion').find('.accordion-title').on('click', function(){
            // Adds Active Class
            $(this).toggleClass('active');
            // Expand or Collapse This Panel
            $(this).next().slideToggle('fast');
            // Hide The Other Panels
            $('.accordion-content').not($(this).next()).slideUp('fast');
            // Removes Active Class From Other Titles
            $('.accordion-title').not($(this)).removeClass('active');		
        });
    });

	// Subscribe form
	$(".newsletter-form").validator().on("submit", function (event) {
		if (event.isDefaultPrevented()) {
			formErrorSub();
			submitMSGSub(false, "Please enter your email correctly.");
		} 
		else {
			event.preventDefault();
		}
	});
	function callbackFunction (resp) {
		if (resp.result === "success") {
			formSuccessSub();
		}
		else {
			formErrorSub();
		}
	}
	function formSuccessSub(){
		$(".newsletter-form")[0].reset();
		submitMSGSub(true, "Thank you for subscribing!");
		setTimeout(function() {
			$("#validator-newsletter").addClass('hide');
		}, 4000)
	}
	function formErrorSub(){
		$(".newsletter-form").addClass("animated shake");
		setTimeout(function() {
			$(".newsletter-form").removeClass("animated shake");
		}, 1000)
	}
	function submitMSGSub(valid, msg){
		if(valid){
			var msgClasses = "validation-success";
		} 
		else {
			var msgClasses = "validation-danger";
		}
		$("#validator-newsletter").removeClass().addClass(msgClasses).text(msg);
	}
	// AJAX MailChimp
	$(".newsletter-form").ajaxChimp({
		url: "https://envytheme.us20.list-manage.com/subscribe/post?u=60e1ffe2e8a68ce1204cd39a5&amp;id=42d6d188d9", // Your url MailChimp
		callback: callbackFunction
	});

	// Go to Top
	$(window).on('scroll', function(){
		var scrolled = $(window).scrollTop();
		if (scrolled > 600) $('.go-top').addClass('active');
		if (scrolled < 600) $('.go-top').removeClass('active');
	});  
	$('.go-top').on('click', function() {
		$("html, body").animate({ scrollTop: "0" },  500);
	});

	// Live Demo Script
	window.addEventListener("load", function () {
		setTimeout(function () {
		const s = document.createElement("script");
			s.src = "https://themes.envytheme.com/tools/torado-preview-api/";
			document.body.appendChild(s);
		}, 1000);
	});

}(jQuery));