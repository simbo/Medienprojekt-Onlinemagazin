var page = {	

	// Optionen
	coverSpeed: 800,
	pageSpeed: 800,
	loadingSpeed: 400,
	
	// aktuell angezeigte Ausgabe
	currentIssue: 0,
	
	// Cache für Seiten-Requests
	requests: new Object(),
	
	// Base URL
	base: '',
	
	// Initialisierung
	init: function() {
	
		// aussteigen falls HTML5 History nicht unterstützt wird
		if(!(window.history && history.pushState))
			return false;
	
		// Elementreferenzen zuweisen
		page.win.$ = $(window);
		page.header.$ = $('header');
		page.cover.$ = $('#cover');
		page.main.$ = $('#main');
		page.meta.$ = $('#meta');
		page.footer.$ = $('footer');

		// Base URL festlegen
		page.base = $('base').attr('href');

		// History-Pop abfangen
		window.onpopstate = function(e){
			page.setState(e.state);
		}
		
		// Loading-Indicator und -Overlay einfügen und verstecken
		$('body').append(page.loadingOverlay.$).append(page.loading.$);
		page.loading.hide(true);
		
		// Wrapper- und Contentbereiche einfügen
		$.each([page.header.$,page.cover.$,page.meta.$],function(){
			$(this).append($('<div class="wrap"><div class="content"></div></div>'));
		});
		page.meta.$.find('.wrap').prepend($('<div class="metaheader"><div class="metaback"></div></div>'));

		// Pfeil-Navi einfügen
		page.main.$.after(page.arrows.left.$,page.arrows.right.$);
		
		// Header-Elemente einfügen
		page.header.$.find('.wrap').prepend($(
			'<div class="bg full"></div>'
			+'<div class="bg collapsed"></div>'
			+'<div id="big-logo" class="logo"></div>'
			+'<div id="small-logo" class="logo"></div>'
		));
		
		// Footer-Menü einfügen und Events setzen
		page.footer.$.append($(
			'<menu>'
			+'<li><a href="chooseissue" rel="meta">Choose Issue</a></li>'
			+'<li><a href="about" rel="meta">About</a></li>'
			+'<li><a href="contact" rel="meta">Contact</a></li>'
			+'</menu>'
		));
		page.footer.setEvents();
		
		page.cover.$.attr('data-display','1');
		
		// nach oben scrollen und Resize-Event setzen
		page.win.$.scrollTop(0).resize(page.fit);

		// Elemente einpassen
		page.fit();
		
		// Initialseite laden
		page.request({
			url: initial_page,
			displayInstant: true,
			initial: true
		})
	
	},
	
	// angezeigte Ausgabe festlegen
	setIssue: function(n) {
		// wenn die angeforderte Ausgabe nicht die bereits festgelegte Ausgabe ist
		if( page.currentIssue != n ) {
		
			// Ausgabe festlegen
			page.currentIssue = n;
			
			// CSS einfügen
			if($('#issue-style').length>0)
				$('#issue-style').remove();
			$('head').append($('<link id="issue-style" type="text/css" rel="stylesheet" href="css/i'+n+'.css" />'));
			
			// Text mit Ausgabennummer beim Logo
			$('#small-logo').empty().html('<span>ISSUE No. '+n+'</span>')
					
			// Menü laden und einfügen
			$.ajax({
				cache: false,
				type: 'post',
				url: page.base+'issue'+n+'/menu',
				dataType: 'json',
				error: function(xhr,t,e) {
					alert('AJAX Error ('+e+')');
				},
				success: function(data,t,xhr) {
					page.header.setContent(data.menu);
					page.header.$.not('.collapsed').find('#main-menu').hide();
					$('#main-menu a[rel=request]').each(function(){
						$(this).unbind('click').click(function(){
							page.request({
								url: $(this).attr('href')
							});
							return false;
						});
					});
					page.setActiveMenuItem();
				}
			});
		}
		else
			page.setActiveMenuItem();
	},
	
	// aktuelles Menü-Item festlegen
	setActiveMenuItem: function() {
		var loc = document.location.toString().substring(page.base.length);
		$('#main-menu a').each(function(){
			if( !$(this).hasClass('cover') && $(this).attr('href')==loc.substring(0,$(this).attr('href').length) )
				$(this).parent('.item').addClass('active');
			else
				$(this).parent('.item').removeClass('active');
		});
	},
		
	// Seitenzustand festlegen
	setState: function(data) {
		if( data.meta ) {
			page.meta.setContent(data);
			page.meta.setEvents();
			page.meta.show();
		}
		else {
			page.meta.hide();
			page.setActiveMenuItem();
			page.setContent(data);
			page.arrows.setLinks(data);
			page.setDisplay(data);
		}
	},
	
	// Content setzen
	setContent: function(data) {
		data = {
			header: typeof data.header == 'string' ? data.header : false,
			cover: typeof data.cover == 'string' ? data.cover : false,
			main: typeof data.main == 'string' ? data.main : false,
			issue: typeof data.issue == 'string' ? data.issue : false,
			mainClass: typeof data.mainClass == 'string' ? data.mainClass : false,
			coverDisplay: typeof data.coverDisplay == 'boolean' ? data.coverDisplay : false
		}
		if( data.cover ) {
			page.cover.setContent(data);
			page.cover.setEvents();
		}
		if( data.main ) {
			page.main.setContent(data);
			page.main.setEvents();
		}
	},
	
	// Anzeigezustände setzen
	setDisplay: function(data,instant) {
		data = {
			coverDisplay: typeof data.coverDisplay == 'boolean' ? data.coverDisplay : false,
			menuDisplay: typeof data.menuDisplay == 'boolean' ? data.menuDisplay : false
		};
		instant = typeof instant == 'boolean' ? instant : false;
		if( page.cover.$.attr('data-display')=='1' && !data.coverDisplay ) {
			page.cover.hide(instant);
			page.cover.$.attr('data-display','0');
		}
		if( page.cover.$.attr('data-display')=='0' && data.coverDisplay ) {
			page.cover.show(instant);
			page.cover.$.attr('data-display','1');
		}
	},
	
	// Seitenelemente abhängig von der Fenstergröße einpassen
	fit: function() {
	
		// Fenstergröße ermitteln und zwischenspeichern
		page.win.h = page.win.$.height();
		page.win.w = page.win.$.width();
		
		// Loading-Indicator vertikal und horizontal zentrieren
		page.loading.$.css({
			top: Math.floor( (page.win.h-page.loading.$.height())/2 )-50,
			left: Math.floor( (page.win.w-page.loading.$.width())/2 )
		});
		
		// falls Header sichtbar, am unteren Fensterrand ausrichten
		//   (da die Position des Elements zum oberen Fensterrand hin animiert
		//    wird, muss hier die CSS-Eigenschaft 'top' statt 'bottom' benutzt
		//    werden)
		page.header.$.not('.collapsed').css( 'top', page.win.h-150 );
		
		// Mindestgröße der Container festlegen
		page.main.$.css({
			width: page.win.w
		}).find('.content').css({
			'min-height': page.win.h-190
		});
		page.meta.$.css({
			width: page.win.w
		}).find('.content').css({
			'min-height': page.win.h
		});
		
		// Pfeil-Navi positionieren
		$.each([ page.arrows.left.$, page.arrows.right.$ ],function(){
			$(this).css({ top: page.win.h/2-40 });
		});
	},
	
	// Seiten-Request
	request: function( options ) {
		options = typeof options == 'object' ? options : {};
		options = {
			pageid: typeof options.url == 'string' ? options.url : '',
			url: page.base + (typeof options.url == 'string' ? options.url : ''),
			type: typeof options.data == 'string' ? options.data : 'post',
			dataType: typeof options.dataType == 'string' ? options.data : 'json',
			data: typeof options.data == 'string' ? options.data : '',
			beforeSend: typeof options.beforeSend == 'function' ? options.beforeSend : function() { void(0) },
			error: typeof options.error == 'function' ? options.error : function() { void(0) },
			beforeSuccess: typeof options.beforeSuccess == 'function' ? options.beforeSuccess : function() { void(0) },
			success: typeof options.success == 'function' ? options.success : function() { void(0) },
			complete: typeof options.complete == 'function' ? options.complete : function() { void(0) },
			initial: typeof options.initial == 'boolean' ? options.initial : false,
			displayInstant: typeof options.displayInstant == 'boolean' ? options.displayInstant : false,
			loadingShowInstant: typeof options.loadingShowInstant == 'boolean' ? options.loadingShowInstant : false,
			loadingHideInstant: typeof options.loadingHideInstant == 'boolean' ? options.loadingHideInstant : false,
			useRequestCache: typeof options.useRequestCache == 'boolen' ? options.useRequestCache : true
		}
		step1 = function(){
			page.loading.show(options.loadingShowInstant)
			options.beforeSend();
		}
		step2 = function(data){
			if( options.initial )
				window.history.replaceState(data,'',options.pageid);
			else
				window.history.pushState(data,'',options.pageid);
			page.setIssue(data.issue);
			page.setContent(data);
			page.arrows.setLinks(data);
			options.beforeSuccess(data);
			if( options.displayInstant)
				page.setDisplay(data,options.displayInstant);
			if( typeof data.preloadImgs == 'string' )
				page.preloadImages( data.preloadImgs.split(','), function() {
					page.loading.hide( options.loadingHideInstant, function() {
						if( !options.displayInstant)
							page.setDisplay(data,options.displayInstant);
						options.success(data)
					})
				});
			else
				page.loading.hide( options.loadingHideInstant, function() {
					if( !options.displayInstant)
						page.setDisplay(data,options.displayInstant);
					options.success(data)
				});
		}
		step3 = function(){
			options.complete();
		}
		if( options.useRequestCache && page.requests[options.pageid]!=undefined ) {
			if( document.location.href==options.url )
				return true;
			var data = page.requests[options.pageid];
			step1();
			step2(data);
			step3();
		}
		else {
			$.ajax({
				cache: false,
				type: options.type,
				url: options.url,
				dataType: options.dataType,
				data: options.data,
				beforeSend: step1,
				error: function(xhr,t,e) {
					alert('AJAX Error ('+e+')');
					page.loading.hide(true);
					options.error(xhr,t,e);
				},
				success: function(data) {
					page.requests[options.pageid] = data;
					step2(data);
				},
				complete: step3
			});
		}
	},
	
	// Bilder vorladen
	preloadImages: function( images, onComplete ) {
		onComplete = typeof onComplete == 'function' ? onComplete : function() { void(0); };
		var loaded = 0;
		var imgObjs = new Array();
		$(images).each(function(i){
			imgObjs[i] = new Image();
			imgObjs[i].src = page.base+images[i];
			imgObjs[i].onload = function() {
				loaded++;
				if( loaded>=images.length )
					onComplete();
			}
		});
	},

	// Window Referenz
	win: {
		// jQuery Objekt
		$: null,
		// aktuelle Höhe
		h: 0,
		// aktuelle Breite
		w: 0
	},

	// Header-Container Referenz
	header: {
		// jQuery Objekt
		$: null,
		// Content setzen
		setContent: function(c) {
			this.$.find('.content').html(c);
		}
	},

	// Cover-Container Referenz
	cover: {
		// jQuery Objekt
		$: null,
		// Animation zum Ausblenden
		hide: function(instant,recursive) {
			var e = 'linear';
			if(!recursive)
				page.cover.show(true,true);
			instant = typeof instant == 'boolean' ? instant : false;
			if( instant ) {
				page.header.$.stop().addClass('collapsed').css({ top:0 })
				.find('.bg.full').stop().css({ top:-150 })
				.end().find('.bg.collapsed,#small-logo').stop().css({ opacity:1 })
				.end().find('#big-logo').stop().css({ opacity:0 })
				.end().find('#main-menu').show();
				page.cover.$.stop().css({ height:page.win.h, top:-page.win.h-4, position:'fixed' })
				page.main.$.show();
			}
			else {
				$('html').animate({ scrollTop:0 },page.coverSpeed,e);
				page.main.$.css({
					overflow:'hidden',
					height: page.win.h,
				}).show();
				page.header.$.addClass('collapsed').css({ top:page.win.h-150 }).animate({ top:0 },page.coverSpeed,e,function(){
					page.header.$.find('.bg.full').animate({ top:-150 },page.coverSpeed/3,e)
					.end().find('.bg.collapsed,#small-logo').animate({ opacity:1 },page.coverSpeed/3,e)
					.end().find('#big-logo').animate({ opacity:0 },page.coverSpeed/3,e)
					.end().find('#main-menu').fadeIn(page.coverSpeed/3);
				});
				page.cover.$.css({ height:page.win.h+page.win.$.scrollTop(), top:-page.win.$.scrollTop(), position:'fixed' })
				.animate({ top:150-page.cover.$.height() },page.coverSpeed,e,function(){
					page.cover.$.animate({ top:-page.cover.$.height()-4 },page.coverSpeed/3,e,function(){
						page.cover.$.css({ height:page.win.h, top:-page.win.h-4 })
						page.main.$.css({
							overflow:'visible',
							height:'auto'
						});
					});
				});
			}

		},
		// Animation zum Einblenden
		show: function(instant,recursive) {
			var e = 'linear';
			if(!recursive) {
				page.cover.hide(true,true);
				page.main.$.find('video').each(function(){
					$(this).get(0).pause();
				});
			}
			instant = typeof instant == 'boolean' ? instant : false;
			if( instant ) {
				page.header.$.stop().removeClass('collapsed').css({ top:page.win.h-150 })
				.find('.bg.full').stop().css({ top:0 })
				.end().find('.bg.collapsed,#small-logo').stop().css({ opacity:0 })
				.end().find('#big-logo').stop().css({ opacity:1 })
				.end().find('#main-menu').hide();
				page.cover.$.stop().css({ height:'auto', position:'absolute', top:0 })
				page.main.$.hide();
			}
			else {
				page.main.$.css({
					position:'fixed',
					top:-page.win.$.scrollTop(),
					overflow:'hidden',
					height:page.win.h+page.win.$.scrollTop(),
					width:page.win.w
				});
				page.header.$.removeClass('collapsed')
				.find('#big-logo').animate({ opacity:1 },page.coverSpeed/3,e)
				.end().find('#main-menu').fadeOut(page.coverSpeed/3)
				.end().find('#small-logo,.bg.collapsed').animate({ opacity:0 },page.coverSpeed/3,e)
				.end().find('.bg.full').animate({ top:0	},page.coverSpeed/3,e,function(){
					page.header.$.animate({ top:page.win.h-150 },page.coverSpeed,e);
				});
				page.cover.$.css({	height:page.win.h, top:-page.win.h })
				.animate({	top:150-page.win.h },page.coverSpeed/3,e,function(){
					$('html').animate({ scrollTop:0 },page.coverSpeed,e);
					page.cover.$.animate({ top:0 },page.coverSpeed,e,function(){
						page.cover.$.css({ position:'absolute', height:'auto' });
						page.main.$.css({
							position:'relative',
							top:0,
							overflow:'visible',
							height:'auto',
							width:'auto'
						}).hide();
					});
				});
			}
		},
		// Content setzen
		setContent: function(data) {
			this.$.find('.content').html(data.cover);
		},
		// Events setzen
		setEvents: function() {
			page.cover.$.find('a[rel=request]').each(function(){
				$(this).unbind('click').click(function(){
					page.request({
						url: $(this).attr('href')
					});
					return false;
				});
			});
		}
	},
	
	// Main-Container Referenz
	main: {
		// jQuery Objekt
		$: null,
		// Content setzen
		setContent: function(data) {
			if( page.header.$.hasClass('collapsed') )
				$('html').animate({ scrollTop:0 },page.pageSpeed);
			if( page.main.$.find('.page').length>0 ) {
				page.main.$.append($('<div class="page '+data.mainClass+'"><div class="wrap"><div class="content">'+data.main+'</div><div class="contentOverlay"></div></div></div>').hide())
				.find('.page').not(':last').fadeOut(page.pageSpeed,function() {
					$(this).remove();
				})
				page.main.$.find('.page:last').fadeIn(page.pageSpeed);
			}
			else {
				page.main.$.append($('<div class="page '+data.mainClass+'"><div class="wrap"><div class="content">'+data.main+'</div><div class="contentOverlay"></div></div></div>'));
			}
			page.fit();
		},
		// aktuell ausgewähltes Thumbnail
		currentThumb: 0,
		// Anzahl Thumbnails
		numberOfThumbs: 0,
		// Events
		setEvents: function() {
			// letzter page-Container in main
			var p = page.main.$.find('.page:last');
			// wenn Section Container vorhanden
			if( p.find('.sec-containers').length>0 ) {
				p.find('.sec-containers').each(function(){
					$(this).find('.sec-container').hide();
					$(this).find('.page-sectitle').each(function(i){
						$(this).unbind('click').click(function(){
							var c = $(this).parent('.sec-containers'),
								s = $(this).attr('data-sec');
							c.find('.page-sectitle').removeClass('active')
							c.find('.sec-container').not('.'+s).fadeOut();
							$(this).addClass('active');
							var h = c.find('.sec-container.'+s).fadeIn().outerHeight();
							p.find('.content').css({
								'min-height': (h+180)>(page.win.h-190) ? h+180 : page.win.h-190
							});
							c.find('.sec-container.'+s+' .guide dl.ep').each(function(j) {
								$(this).unbind('click').click(function() {
									$(this).parent('.guide').find('dl.ep').removeClass('active');
									$(this).addClass('active');
								});
								if(j==0)
									$(this).click();
							});
						});
						if( i==0 )
							$(this).click();
					});
				});
			}
			// wenn Video Elemente vorhanden
			if( p.find('.video-box video').length>0 ) {
				p.find('.video-box video').each(function(){
					this.onended = function(){
						$(this).click();
					}
					this.volume = 1;
					$(this).click(function(){
						$(this).after(
							$('<div class="video-overlay"></div>').click(function(){
								$(this).fadeOut(400,function(){
									$(this).remove()
								}).prev('video').get(0).play();
							}).hide().fadeTo(400,0.5)
						).get(0).pause();
					}).click();
				});
			}
			// wenn Video-Playlist vorhanden
			if( p.find('.video-playlist').length>0 ) {
				p.find('.video-playlist').each(function(){
					var l = $(this);
					l.addClass('first').find('ul li a').each(function(i){
						$(this).click(function(){
							l.find('ul li a').removeClass('active');
							$(this).addClass('active');
							var vid = $('<video src="'+page.base+$(this).attr('href')+'" poster="'+page.base+'img/video-poster-small.png" width="416" height="234" alt="" title="'+$(this).text()+'" autobuffer preload="auto"></video>').click(function(){
								$(this).after(
									$('<div class="video-overlay"></div>').click(function(){
										$(this).fadeOut(400,function(){
											$(this).remove()
										}).prev('video').get(0).play()
									}).hide().fadeTo(400,0.5)
								).get(0).pause()
							});
							vid.get(0).oncanplay = function(){
								this.onended = function(){
									if(i==4) {
										l.addClass('first');
										l.find('ul li a:first').click();
									}
									else {
										l.find('ul li a')[i+1].click();
									}
									$(this).click();
								}
								this.volume = 1;
								if(l.hasClass('first')) {
									l.removeClass('first');
									$(this).attr('poster','img/i27-video-poster-pinebarrens.jpg').fadeIn(400,function(){
										$(this).click();
									})
								}
								else
									$(this).fadeIn(400,function(){
										$(this).get(0).play();
									})
							}
							l.find('video').each(function(){
								this.pause();
								$(this).fadeOut(400,function(){
									this.src='';
									$(this).remove();
								})
							}).end().find('.video-overlay').remove().end().append(vid.hide());
							return false;
						})
						if(i==0)
							$(this).click();
					})
				});
			}
			// Wenn Thumbnail Container vorhanden
			if( p.find('.thumb-container').length>0 ) {
				page.main.numberOfThumbs = p.find('.thumb-container a').length;
				p.find('.thumb-container a').each(function(i){
					$(this).click(function(){
						page.main.currentThumb = i;
						// wenn Video-Thumbnails
						if( $(this).hasClass('video') ) {
							var vid = $('<video src="'+page.base+$(this).attr('href')+'" poster="'+page.base+'img/video-poster.png" width="800" height="450" alt="" title="'+$(this).attr('title')+'" autobuffer preload="auto"></video>').click(function(){
								$(this).after(
									$('<div class="video-overlay"></div>').click(function(){
										$(this).fadeOut(400,function(){
											$(this).remove()
										}).prev('video').get(0).play();
									}).hide().fadeTo(400,0.5)
								).get(0).pause();
							});
							vid.get(0).oncanplay = function(){
								this.onended = function(){
									$(this).click();
								}
								this.volume = 1;
								$(this).fadeIn(400,function(){
									$(this).get(0).play();
								});
							}
							p.find('.media-container').find('video').each(function(){
								this.pause();
								$(this).fadeOut(400,function(){
									this.src='';
									$(this).remove();
								});
							}).end().find('.video-overlay').remove().end().append(vid.hide());
						}
						// Image-Thumbnails
						else {
							p.find('.media-container').append(
								$('<img src="'+page.base+$(this).attr('href')+'" alt="" title="'+$(this).attr('title')+'" />').hide().load(function(){
									$(this).fadeIn();
								})
							).find('img').not(':last').fadeOut('400',function(){
								$(this).remove();
							})
						}
						p.find('.text-container').text($(this).attr('title'));
						$(this).addClass('active').parent('.thumb-inner-container').animate({'margin-left':'-'+(i*130)+'px'})
						.find('a').not(this).removeClass('active');
						return false;
					});
					// erstes Thumbnails wählen
					if(i==Math.floor(page.main.numberOfThumbs/2))
						$(this).click();
				});
				// next/prev Thumbnail
				p.find('.thumb-left,.thumb-right').each(function(i){
					$(this).click(function(){
						var n = i%2==0 ? 
							( page.main.currentThumb-1>=0 ? page.main.currentThumb-1 : page.main.numberOfThumbs-1 ):
							( page.main.currentThumb+1<page.main.numberOfThumbs ? page.main.currentThumb+1 : 0 );
						p.find('.thumb-container a').eq(n).click();
						return false;
					});
				});
			}
		}
	},

	// Meta-Container Referenz
	meta: {
		// jQuery Objekt
		$: null,
		// Content setzen
		setContent: function(data) {
			this.$.find('.content').html(data.meta);
		},
		// Events setzen
		setEvents: function() {
			page.meta.$.find('.metaback').unbind('click').click(function(){
				window.history.back();
			});
			page.meta.$.find('.issuecover').unbind('click').click(function(){
				var t = $(this).attr('data-issue');
				if(t=='27')
					page.request({
						url: 'issue'+t,
						displayInstant: true,
						success: function() {
							page.meta.hide();
						}
					});
					
				//page.request
			});
		},
		// Animation zum Einblenden
		show: function() {
			$('html').animate({ scrollTop:0 });
			if( page.header.$.hasClass('collapsed') )
				page.main.$.css({ height:page.win.h+page.win.$.scrollTop(), top:-page.win.$.scrollTop(), position:'fixed' })
				.find('video').each(function(){
					$(this).get(0).pause();
				});
			else
				page.cover.$.css({ height:page.win.h+page.win.$.scrollTop(), top:-page.win.$.scrollTop(), position:'fixed' })
			page.meta.$.fadeIn();
		},
		// Animation zum Ausblenden
		hide: function() {
			$('html').animate({ scrollTop:0 });			
			if( page.header.$.hasClass('collapsed') )
				page.main.$.css({ height:'auto', top:0, position:'relative' })
			else
				page.cover.$.css({ height:'auto', top:0, position:'absolute' })
			page.meta.$.fadeOut();
		}
		
	},

	// Footer-Container Referenz
	footer: {
		// jQuery Objekt
		$: null,
		// Events setzen
		setEvents: function() {
			page.footer.$.find('menu a').each(function(){
				$(this).click(function() {
					var target = $(this).attr('href');
					$.ajax({
						cache: false,
						type: 'post',
						url: page.base+target,
						dataType: 'json',
						beforeSend: function() {
							page.loading.show();
						},
						error: function(xhr,t,e) {
							alert('AJAX Error ('+e+')');
							page.loading.hide();
						},
						success: function(data,t,xhr) {
							window.history.pushState(data,'',target);
							page.meta.setContent(data);
							page.meta.setEvents();
							page.loading.hide();
							page.meta.show();
						}
					});
					return false;
				});
			});
		}
	},
	
	// Pfeil-Navi Referenz
	arrows: {
		setLinks: function(data) {
			var leftLink = data.left,
				rightLink = data.right,
				leftHtml = data.leftHtml,
				rightHtml = data.rightHtml;
			page.arrows.left.$.find('.info').empty().html('Go to '+data.leftHtml).hide()
			.end().find('.button').unbind('click').click(function(){
				page.request({ url: leftLink });
				return false;
			}).hover(
				function(){ $(this).parent('#page-left').find('.info').fadeIn(200) },
				function(){ $(this).parent('#page-left').find('.info').fadeOut(200) }
			);
			page.arrows.right.$.find('.info').empty().html('Go to '+data.rightHtml).hide()
			.end().find('.button').unbind('click').click(function(){
				page.request({ url: rightLink });
				return false;
			}).hover(
				function(){ $(this).parent('#page-right').find('.info').fadeIn(200) },
				function(){ $(this).parent('#page-right').find('.info').fadeOut(200) }
			);
		},
		left: {
			$: $('<div id="page-left"><div class="button"></div><div class="info"></div></div>')
		},
		right: {
			$: $('<div id="page-right"><div class="button"></div><div class="info"></div></div>')
		}
	},
	
	// Loading-Indicator Referenz
	loading: {
		// jQuery Objekt
		$: $('<div id="loading"><span>loading</span></div>'),
		// Animation zum Einblenden
		show: function( instant ) {
			instant = typeof instant == 'boolean' ? instant : false;
			page.loadingOverlay.$.show();
			page.loading.$.show().animate({
				opacity: 1
			},{
				duration: instant ? 0 : page.loadingSpeed,
				queue: false,
				easing: 'swing'
			});
			page.loadingOverlay.$.animate({
				opacity: 0.8
			},{
				duration: instant ? 0 : page.loadingSpeed,
				queue: false,
				easing: 'swing'
			});
		},
		// Animation zum Ausblenden
		hide: function( instant, onComplete ) {
			instant = typeof instant == 'boolean' ? instant : false;
			onComplete = typeof onComplete == 'function' ? onComplete : function(){void(0)};
			page.loading.$.animate({
				opacity: 0
			},{
				duration: instant ? 0 : page.loadingSpeed,
				queue: false,
				easing: 'swing',
				complete: function(){
					page.loading.$.hide();
					page.loadingOverlay.$.hide();
					onComplete();
				}
			});
			page.loadingOverlay.$.animate({
				opacity: 0
			},{
				duration: instant ? 0 : page.loadingSpeed,
				queue: false,
				easing: 'swing'
			});
		}
	},

	// Loading-Overlay Referenz	
	loadingOverlay: {
		// jQuery Objekt
		$: $('<div id="loading-overlay"></div>')	
	}
	
}
