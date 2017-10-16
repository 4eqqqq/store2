/**
 * Minicart PayPal-link interception
 * 05.04.2016
 * 
 * [ 	Minicart.js is modified - disabled cart-window popup when adding/changeing items;
 * 		html/css theme changed. ]
 * 		
 * Insert these lines in HTML
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>
 * <script src="plugins/minicart/dist/minicart.js"></script>
 * <script src="minicart-customizer.js"></script> 
 * 
 */

(function () {

	var defaultOptions = {
		shopcart_position	: 'right',		// {string}	Shopcart orientation [right | center | left]
		site_width			: 1150,			// {int}	px, Site outer conatiner width (most wide)
		side_offset			: 20,			// {int}	px, Site outer container side offset
		shopcart_top_offset	: 120,			// {int}	px, Top offset

		gift_icon_color		: '#FFF',		// {string} Color in hex|name (css)
		gift_back_color		: '#f97352',	// {string} Color in hex|name (css)
		gift_icon_size		: 15,			// {int}	px, Gift icon size

		shopcart_icon_color	: '#FFF',		// {string} Color in hex|name (css)
		shopcart_back_color	: '#000',		// {string} Color in hex|name (css)
		shopcart_icon_size	: 50,			// {int}	px, Shopcart icon size

		sc_count_color		: '#FFF',		// {string} Color in hex|name (css)
		sc_count_back_color	: '#f97352',	// {string} Color in hex|name (css)
		sc_count_size		: 12,			// {int}	px, Shopcart counter icon size

		returnURL 			: window.location.origin + window.location.pathname + '?success',
		cancel_returnURL	: window.location.origin + window.location.pathname + '?failure',

		shopcartCSSLink		: '<link rel="stylesheet" href="minicart-theme.css" type="text/css">',
		giftCardHtml		: '<i id="giftcard-to-shopcart" class="shoppingcart-icons">&#xe308;</i>',
		shopcartHtml		: '<i id="mc-shopcart" role="button" class="shoppingcart-icons">&#xe1df;<span id="mc-shopcart-qty"></span></div></i>',
		checkout_button		: 'Check Out with'
	}

	var options = defaultOptions;
	var initDone  = false;
	var addAction = false;
	var shopcart;
	var shopcartWidth;
	var shopcartOrientation;

	// $('head').append(options.shopcartCSSLink);

	/********************************************************************
	 * Shopcart Refresher
	 * @param  {boolean} needBlinking If badge must be blinked twice
	 *******************************************************************/
	function shopcartRefresh(needBlinking) {
		var totalQty = 0;
		paypal.minicart.cart.items().forEach(function(item){
			totalQty += item._data.quantity;
		});
		if(needBlinking == true) {
			$('#mc-shopcart').find('span').fadeTo('fast', 0.25).fadeTo('fast', 1).fadeTo('fast', 0.25).fadeTo('fast', 1);
		}
		if(totalQty > 0) {
			$('#mc-shopcart').fadeIn();	$('#mc-shopcart-qty').text(totalQty ? totalQty : '');

		}
	else {
			$('#mc-shopcart-qty').fadeOut();
			$('#mc-shopcart').fadeOut();
		}
	}

	/********************************************************************
	 * PalPay query-string parser
	 * @param  {string} queryString Query part of PayPal-styled URL
	 *******************************************************************/
	function parseQueryString(queryString) {
		var result = {};
		decodeURIComponent(queryString).split("&").forEach(function(part) {
			var item = part.split("=");
			result[item[0]] =  (item[1] ||"").replace(/\+/g, ' ');
		});
		return result;
	}

	/**
	 * Shopcart set side offset
	 * 
	 * Renew position for shopcart widget, when started | resizing window.
	 * 
	 */
	function shopcartSetSideOffset() {
		var side_offset;

		if (window.innerWidth <= options.site_width) {side_offset =  options.side_offset; }
		else {side_offset = (window.innerWidth - options.site_width) / 2 + options.side_offset; }

		switch (shopcartOrientation) {
			case 0	: shopcart.css({'left' : side_offset + 'px', 'right' : 'initial'}); break
			case 1	: shopcart.css({'left' : 'initial', 'right' : side_offset + 'px'});
		}
	}

	/**
	 * Initialization
	 * 
	 */

	function init() {
		if (initDone || !document.body) return;

		switch (options.shopcart_position) {
			case 'left': shopcartOrientation = 0; break
			case 'right': shopcartOrientation = 1; break
			default: console.log('Shopcart position (orientation) is wrong'); return;
		}

		paypal.minicart.render({
			strings:{
				button: options.checkout_button + (options.checkout_button?' ':'') + '<img src="https://cdnjs.cloudflare.com/ajax/libs/minicart/3.0.1/paypal_65x18.png" width="65" height="18" alt="PayPal" />',
			}
		});

		if(window.location.href == options.returnURL) {
			paypal.minicart.reset();
			window.location = window.location.origin + window.location.pathname;
		}

		$('body').append(options.shopcartHtml);
		shopcart = $('#mc-shopcart');
		shopcart.css({
			'top'				: options.shopcart_top_offset + 'px',
			'font-size'			: options.shopcart_icon_size + 'px',
			'color'				: options.shopcart_icon_color,
			'background-color'	: options.shopcart_back_color,
		});
		shopcart.find('span').css({
			'font-size'			: options.sc_count_size + 'px',
			'color'				: options.sc_count_color,
			'background-color'	: options.sc_count_back_color,
		});
		shopcartWidth = shopcart.outerWidth();
		shopcartSetSideOffset();

		$('body').append('<style>#giftcard-to-shopcart {font-size: ' + options.gift_icon_size + 'px; color: ' + options.gift_icon_color + '; background-color: ' + options.gift_back_color + '}</style>');

	    initDone = true;

		$(window).resize(function(){
			shopcartSetSideOffset();
		});

		shopcartRefresh();

		$('#mc-shopcart').click(function (e) {
			e.stopPropagation();
			paypal.minicart.view.show();
			paypal.minicart.view.redraw();
		});

		$(document)
		.on('click','[href*="cmd=_cart"]a[href*="www.paypal.com/cgi-bin/webscr"]',function (e) {
			e.stopPropagation();
			e.preventDefault();
			
			addAction = true;

			var href = $(this).prop('href');
			var linkParams = parseQueryString(href.substring( href.indexOf('?') + 1 ));
			
			console.log(linkParams);

			result = paypal.minicart.cart.add({
				'amount'		: linkParams.amount,
				'bn'			: linkParams.bn,
				'business'		: linkParams.business,
				'currency_code'	: linkParams.currency_code,
				'item_name'		: linkParams.item_name,
				'item_number'	: linkParams.item_number,
				'shipping'		: linkParams.shipping,
				'shipping2'		: linkParams.shipping2,
				'return'		: options.returnURL,
				'cancel_return'	: options.cancel_returnURL,
				'notifyURL'		: options.notifyURL
			}); 

			if(result !== false) {

				if(shopcart) {
					shopcart.fadeIn();

					$('body').append(options.giftCardHtml);

					var giftcardGhost = $('body i#giftcard-to-shopcart')
					.offset({
						top: e.pageY - 10,
						left: e.pageX - 10
					})
					.animate({
						'top': shopcart.offset().top + 25,
						'left': shopcart.offset().left + 20,
					}, 1800, 'easeInOutCubic')
					.fadeOut(function () {
						shopcartRefresh(true);
						$(giftcardGhost).detach()
					});
				}
			}

			addAction = false;
		});

		paypal.minicart.cart.on('change', function (e) {
			if(!addAction)
				shopcartRefresh(true);
		});

		paypal.minicart.cart.on('remove', function () {
			shopcartRefresh(true);
		});
	}


	/***********************************************
	 * PUBLIC INTERFACE
	 ***********************************************/
	function mcShopcart(optionsToSet) {
	    for (var key in optionsToSet)
	        if (defaultOptions.hasOwnProperty(key)) 
	            options[key] = optionsToSet[key];

		if ($('a[href*="www.paypal.com/cgi-bin/webscr"]').length) 
			$(document).ready(function () {
				init();
			});
	}

	if((typeof paypal === 'undefined') || (typeof paypal.minicart === 'undefined'))
		return -1;

	if (window.mcShopcartOptions)
	    mcShopcart(window.mcShopcartOptions)

	if (typeof define === 'function' && define.amd)
	    define(function() {
	        return mcShopcart;
	    });
	else if ('object' == typeof exports)
	    module.exports = mcShopcart;
	else
	    window.mcShopcart = mcShopcart;

})(jQuery);

mcShopcart(typeof shopcartSettings === 'undefined' ? null : shopcartSettings);

// mcShopcart({
// 	site_width			: 1150,			// {int}	px, Site outer conatiner width (most wide)
// 	side_offset			: 20,			// {int}	px, Site outer container side offset
// 	shopcart_position	: 'right',		// {string}	Shopcart orientation [left | right]

// 	shopcart_icon_color	: '#BDF',		// {string} Color in hex|name (css)
// 	shopcart_back_color	: '#51E',		// {string} Color in hex|name (css)
// 	shopcart_icon_size	: 50,			// {int}	px, Shopcart icon size

// 	sc_count_color		: '#ECF',		// {string} Color in hex|name (css)
// 	sc_count_back_color	: '#975',		// {string} Color in hex|name (css)
// 	sc_count_size		: 12,			// {int}	px, Shopcart counter icon size

// 	gift_icon_color		: '#1A1',		// {string} Color in hex|name (css)
// 	gift_back_color		: '#9EB',		// {string} Color in hex|name (css)
// 	gift_icon_size		: 30,			// {int}	px, Gift icon size
// });
