<?

	// Template Variablen
	$version = 1;
	$site_title = 'Pilot';

	// absoluter Pfad
	define( 'ABSPATH', dirname(__FILE__).'/' );

	// Basedir (relativer Pfad)
	define( 'BASEDIR', dirname($_SERVER['PHP_SELF']).'/' );
	
	// Base-URL (relativer Pfad mit Domain und Protokoll)
	define( 'BASEURL', 'http://'.$_SERVER['HTTP_HOST'].BASEDIR );
	
	// angeforderte URL ohne Basedir und Querystring
	$request_uri = strpos($_SERVER['REQUEST_URI'],'?')===false ?
		substr( $_SERVER['REQUEST_URI'], strlen(BASEDIR) )
	  : substr( $_SERVER['REQUEST_URI'], strlen(BASEDIR), strpos($_SERVER['REQUEST_URI'],'?')-strlen(BASEDIR) );

	// falls angeforderte URL mit einem Slash endet, auf URL ohne Slash umleiten
	if( substr($request_uri,-1)=='/' ) {
		header( 'HTTP/1.1 301 Moved Permanently' );
		header( 'Location: '.BASEURL.substr($request_uri,0,-1).(empty($_SERVER['QUERY_STRING'])?'':'?'.$_SERVER['QUERY_STRING']) );
		die();
	}
	
	// falls "index.php" direkt aufgerufen wurde, auf Basedir umleiten
	if( $request_uri=='index.php' || substr($request_uri,0,2)=='home' ) {
		header( 'HTTP/1.1 301 Moved Permanently' );
		header( 'Location: '.BASEURL.(empty($_SERVER['QUERY_STRING'])?'':'?'.$_SERVER['QUERY_STRING']) );
	}

	// Seitendefinitionen laden
	$_pages = parse_ini_file( ABSPATH.'config/pages.ini', true );

	// Startseite festlegen
	if( empty($request_uri) )
		$page_id = '#home';

	// prüfen ob angeforderte Seite existiert
	elseif( isset($_pages[$request_uri]) )
		$page_id = $request_uri;
		
	// ansonsten 404-Seite festlegen
	else
		$page_id = '#404';
	
	// Klasse für Seiten einbinden
	require_once ABSPATH.'inc/class-page.php';

	// Seitenobjekt definieren
	$page = new Page( $page_id, $_pages[$page_id] );
	
	if( $page->type()=='json' && strtolower($_SERVER['REQUEST_METHOD'])!='post' ) {
		$initial_page = $page_id;
		$page_id="#home";
		$page = new Page( $page_id, $_pages[$page_id] );
	}
	else
		$initial_page = 'issue27';
	
	// Seitentitel
	$page_title = $page->title()=='' ? $site_title : $page->title().' &laquo; '.$site_title;

	// Session
	session_start();
	
	// Scripts einbinden
	foreach( $page->scripts() as $script )
		include $script;

	// GZIP aktivieren
	ob_start('ob_gzhandler');
	
	// Header ausgeben
	if( $page->id() == '#404' )
		header('HTTP/1.0 404 Not Found');
	switch( $page->type() ) {
		case 'json':
			header('Cache-Control: no-store, no-cache, must-revalidate');
			header('Expires: 0');
			header('Content-type: text/json');
			$_data = array();
			break;
		case 'html':
		default:
			header('Content-type: text/html;charset=UTF-8');
			break;
	}

	// Templates einbinden
	foreach( $page->templates() as $template )
		include $template;
	
	// falls JSON, Array $_data als JSON ausgeben	
	if( $page->type()=='json' )
		echo json_encode($_data);

?>
