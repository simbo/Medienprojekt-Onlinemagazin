<?

$e = array(
	'<!doctype html>'
	,'<html lang="en_US">'
	,'<head>'
		,'<base href="'.BASEURL.'" />'
		,'<meta charset="UTF-8">'
		,'<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">'
		,'<meta name="viewport" content="width=device-width, initial-scale=1.0">'
		,'<title>'.$page_title.'</title>'
		,'<meta name="author" content="Simon Lepel">'
		,'<link rel="shortcut icon" href="favicon.ico">'
		,'<link rel="stylesheet" href="css/base.css?v='.$version.'" media="all">'
		,'<link rel="stylesheet" href="css/fonts.css?v='.$version.'" media="all">'
		,'<link rel="stylesheet" href="css/style.css?v='.$version.'" media="all">'
	,'</head>'
	,'<body>'
		,'<h1 id="site-title">PILOT Magazine</h1>'
		,'<h2 id="site-subtitle">High Class TV Series</h2>'
		,'<p class="notfound">'
			,'<strong>Error 404:</strong> The requested page could not be found.'
		,'</p>'
	,'</body>'
	,'</html>'
);

echo implode("\n",$e);

?>
