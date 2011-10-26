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
		,'<script type="text/javascript" src="js/jquery.js"></script>'
		,'<script type="text/javascript">/* <![CDATA[ */ '
			,'var info_confirmed='.( isset($_COOKIE['info_confirmed'])&&$_COOKIE['info_confirmed']==true?'true':'false' ).'; '
			,'var initial_page="'.$initial_page.'";'
		,' /* ]]>  */</script>'
		,'<script type="text/javascript" src="js/lightbox.js?v='.$version.'"></script>'
		,'<script type="text/javascript" src="js/page.js?v='.$version.'"></script>'
		,'<script type="text/javascript" src="js/script.js?v='.$version.'"></script>'
		,'<link rel="shortcut icon" href="favicon.ico">'
		,'<link rel="stylesheet" href="css/base.css?v='.$version.'" media="all">'
		,'<link rel="stylesheet" href="css/style.css?v='.$version.'" media="all">'
	,'</head>'
	,'<body>'
		,'<h1 id="site-title">PILOT Magazine</h1>'
		,'<h2 id="site-subtitle">High Class TV Series</h2>'
		,'<header></header>'
		,'<section id="cover"></section>'
		,'<section id="main"></section>'
		,'<section id="meta"></section>'
		,'<footer></footer>'
	,'</body>'
	,'</html>'
);

echo implode("\n",$e);

?>
