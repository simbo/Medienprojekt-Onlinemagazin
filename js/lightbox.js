/**
 * Simple Lightbox Script
 * Author: Simon Lepel
 * License: GPL
 */

var lightbox = {
	default_options: {
		width: 600,
		opacity: 0.9,
		fadeSpeed: 200,
		instantOverlay: false,
		cssClass: ''
	},
	options: {
	},
	win: $(window),
	overlay: $('<div id="lb-overlay" />'),
	container: $('<div id="lb-container" />'),
	init: function() {
		$('body').append(lightbox.overlay.css('display','none')).append(lightbox.container.css('display','none'));
		$(window).resize(lightbox.fit);
	},
	set: function(content,options) {
		if( typeof options == 'object' ) {
			lightbox.options.width = typeof options.width == 'number' ? options.width : lightbox.default_options.width;
			lightbox.options.opacity = typeof options.opacity == 'number' ? options.opacity : lightbox.default_options.opacity;
			lightbox.options.fadeSpeed = typeof options.fadeSpeed == 'number' ? options.fadeSpeed : lightbox.default_options.fadeSpeed;
			lightbox.options.instantOverlay = typeof options.instantOverlay == 'boolean' ? options.instantOverlay : lightbox.default_options.instantOverlay;
			lightbox.options.cssClass = typeof options.cssClass == 'string' ? options.cssClass : lightbox.default_options.cssClass;
		}
		else
			lightbox.options = lightbox.default_options;
		lightbox.container.attr('class',lightbox.options.cssClass).html(content).find('.lb-close').unbind('click').click(lightbox.hide);
		lightbox.fit();
		lightbox.show();
	},
	fit: function() {
		var wt = lightbox.win.scrollTop(),
			wl = lightbox.win.scrollLeft(),
			wh = lightbox.win.height(),
			ww = lightbox.win.width();
		$(lightbox.container).css({
			width: lightbox.options.width,
			left: wl+ww/2-lightbox.options.width/2,
			top: wt+wh/10*2
		});
	},
	show: function() {
		var wt = lightbox.win.scrollTop(),
			wh = lightbox.win.height();
		$('html').css('overflow','hidden');
		if( lightbox.options.instantOverlay )
			lightbox.overlay.show();
		else	
			lightbox.overlay.fadeTo(lightbox.options.fadeSpeed,lightbox.options.opacity);
		lightbox.container.css({top:wt+wh,display:'block'}).animate({top:wt+wh/10*2},lightbox.options.fadeSpeed);
	},
	hide: function() {
		var wt = lightbox.win.scrollTop(),
			wh = lightbox.win.height();
		$('html').css({'overflow-y':'scroll','overflow-x':'auto'});
		lightbox.overlay.fadeOut(lightbox.options.fadeSpeed);
		lightbox.container.animate({top:wt+wh},600,function(){ lightbox.container.css('display','none') });
	}
};
