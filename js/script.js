
var isFirefox4 = false;
if( navigator.userAgent.toLowerCase().indexOf('firefox') != -1 ) {
	isFirefox4 = navigator.userAgent.toLowerCase();
	isFirefox4 = isFirefox4.substring(isFirefox4.indexOf('firefox/')+8);
	isFirefox4 = parseInt(isFirefox4.substring(0,isFirefox4.indexOf('.'))) >= 4;
}

function show_disclaimer() {
	var info_html = '<div class="content yellow">'
		+'<p>Diese Website ist Teil eines Studienprojekts. S&auml;mtliche Inhalte dienen ausschließlich zu Demonstrationszwecken.</p>'
		+'<p>Es kommen neue Techniken wie zum Einsatz, die noch nicht von allen Browsern vollst&auml;ndig unterst&uuml;tzt werden. '
		+'Als Browser wird daher Mozilla Firefox in der Version 4.0 oder h&ouml;her vorausgesetzt.</p>'
		+( isFirefox4 ?
			'<p><strong class="icon tick">Dein Browser erfüllt die Voraussetzungen.</strong></p>'
		:
			'<p><strong class="icon cross">Dein Browser erf&uuml;llt leider nicht die notwendigen Voraussetzungen.</strong></p>'
			+'<p><a href="http://getfirefox.com" class="icon go">Neueste Version von Mozilla Firefox downloaden</a></p>'
		)
		+'<p><a href="javascript:document.cookie=\'info_confirmed=true;expires=0\';void(0);" class="lb-close icon go">Gelesen und verstanden. Weiter zur Website&hellip;</a></p>'
		+'</div>';
	lightbox.set(
		info_html,
		{
			opacity:1,
			instantOverlay:true,
			fadeSpeed:600,
			cssClass:'yellow'
		}
	);
}

// DOM ready
$(document).ready(function(){

	// Lightbox initialisieren
	lightbox.init();
	
	// falls Disclaimer noch nicht bestätigt, Disclaimer anzeigen
	if( !info_confirmed )
		show_disclaimer();

	// Page initialisieren
	page.init();

});
