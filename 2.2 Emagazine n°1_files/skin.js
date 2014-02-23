jQuery(document).ready(function() {
	// Init pageslide (right menu).
	jQuery('.open').pageslide({ direction: 'left' });

	// Init fancybox.
	if(!/iPhone|iPod|Android|opera mini|blackberry|palm os|palm|hiptop|avantgo|plucker|xiino|blazer|elaine|iris|3g_t|windows ce|opera mobi|windows phone|windows ce; smartphone;|windows ce;iemobile/i.test(navigator.userAgent)){
		jQuery('a.fancybox-iframe, a.highlighting-iframe').fancybox({
			'transitionIn'  : 'elastic',
			'transitionOut' : 'elastic',
			'speedIn'   	: 600, 
			'speedOut'    	: 200,
			'type'      	: 'iframe' 
		});
	}

	jQuery('a.lightbox').fancybox({
		'transitionIn'  : 'elastic',
		'transitionOut' : 'elastic',
		'speedIn'   	: 600, 
		'speedOut'    	: 200
	});


	// Header menu.
	var headerMenu = jQuery('.swiper-nav').swiper();

	// Resize the content area height to prevent a bug (the header menu height).
	function fixPagesHeight() {
		jQuery('.swiper-pages').css('height', jQuery(window).height() - headerMenu.height);
	}

	jQuery(window).on('resize', function(){
		fixPagesHeight();
	});

	fixPagesHeight();

	// Swiper horizontal initialization.
	jQuery.pages = jQuery('.swiper-pages').swiper({
		keyboardControl:	true,
		resizeReInit:		true,
		onSlideChangeEnd: function() {
			jQuery(resizeFixForSwiper);
			lazyLoad();
		}
	});

	// Swiper vertical initialization.
	var swiperScroll = [];
	jQuery('.scroll-container').each(function() {
		var id = jQuery(this).parents('.swiper-slide').attr('id');
		id = id.substring(id.indexOf('-') + 1);

		swiperScroll[id] = jQuery(this).swiper({
			mode:				'vertical',
			scrollContainer:	true,
			mousewheelControl:	true,
			keyboardControl:	true,
			resizeReInit:		true,
			scrollbar: {
				container: jQuery(this).find('.swiper-scrollbar')[0]
			}
		});
	});

	jQuery('#content ul li a').on('click', function() {
		jQuery.pageslide.close();
		var href = jQuery(this).attr('href');
		swipeByHref(href);
	});

	// Arrow navigation.
	jQuery('a.page-nav-img').on('click', function(e) {
		e.preventDefault();
		if(jQuery(this).hasClass('previous')) {
			jQuery.pages.swipePrev();
		}
		if(jQuery(this).hasClass('next')) {
			jQuery.pages.swipeNext();
		}
	});

	// Init main menu.
	var items = jQuery('.slideRight, .slideLeft');
	var content = jQuery('.content');
	var open = function() {
		jQuery(items).removeClass('close').addClass('open');
	}
	var close = function() { 
		jQuery(items).removeClass('open').addClass('close');
	}
	jQuery('#navToggle').click(function(){
		if (content.hasClass('open')) { jQuery(close); }
		else { jQuery(open); }
	});
	content.click(function(){
		if (content.hasClass('open')) { jQuery(close) }
	});

	// Activate TB tooltip which must be done explicitly since this is an opt-in plugin.
	jQuery('.navbar-top li a').tooltip();

	function swipeByHref(href) {
		if (href.indexOf('#') != -1) {
			var uid = href.substring(href.indexOf('#') + 1);
			swipeToUid(uid);
		}
	}

	function swipeToUid(uid) {
		var slide = jQuery('#slide-' + uid);
		if (slide.length > 0) {
			jQuery.pages.swipeTo(slide.index());
		}
	}

	function lazyLoad() {
		var id = jQuery.pages.activeSlide().id;
		id = id.substring(id.indexOf('-') + 1);
		window.location.hash = id;

		jQuery('.swiper-pages.swiper-container > .swiper-wrapper > .swiper-slide-active img.lazy').each(function() {
			src = jQuery(this).attr('data-original');
			jQuery(this).removeAttr('data-original');
			jQuery(this).attr('src', src);
			jQuery(this).on('load', function() {
				jQuery(this).removeClass('lazy');
				jQuery(this).addClass('img-responsive');
			});
		});

		container = document.querySelector('.swiper-pages.swiper-container > .swiper-wrapper > .swiper-slide-active');
		waitImagesLoading(container, resizeFixForSwiper);
		container = document.querySelector('.swiper-pages.swiper-container > .swiper-wrapper > .swiper-slide-active .article-list');
		waitImagesLoading(container, refreshMasonry);
	}

	function waitImagesLoading(container, callBackFunction) {
		if (container !== 'undefined') {
			var imagesNumber = jQuery(container).find('img.lazy').length;
			var imagesLoadedNumber = 0;

			jQuery(container).find('img.lazy').on('load', function() {
				imagesLoadedNumber++;
				if (imagesLoadedNumber == imagesNumber) {
					jQuery(callBackFunction(container));
				}
			});
		}
	}

	var resizeFixForSwiper = function() {
		id = jQuery.pages.activeSlide().id;
		id = id.substring(id.indexOf('-') + 1);
		swiperScroll[id].resizeFix();
	}

	jQuery(window).resize(function() {
		jQuery(resizeFixForSwiper);
	});

	var refreshMasonry = function(container) {
		msnry = new Masonry(container, {
			itemSelector: '.col-md-3',
			columnWidth: container.querySelector('.col-md-3')
		});

		msnry.on('layoutComplete', function() {
			jQuery(resizeFixForSwiper);
		});

		msnry.layout();
	}

	var href = jQuery(location).attr('href');
	swipeByHref(href);

	lazyLoad();
});