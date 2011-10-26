<?

$_titles = array(
	'The Sopranos'
	,'Weeds'
	,'The Wire'
	,'Boardwalk Empire'
	,'Breaking Bad'
	,'Dr. House'
	,'Monk'
	,'South Park'
	,'Band of Brothers'
	,'Deadwood'
	,'Dexter'
	,'Game of Thrones'
	,'IT Crowd'
	,'Desperate Housewives'
	,'Mad Men'
	,'Curb your Enthusiasm'
	,'The X-Files'
	,'Rome'
	,'Robot Chicken'
	,'Heroes'
	,'Medium'
	,'Twin Peaks'
	,'Stromberg'
	,'Californication'
	,'Entourage'
	,'Crash'
	,'Futurama'
);

$_titles = array_reverse($_titles);

$_data['meta'] =
	'<div class="covers">';

for( $i = count($_titles); $i>0; $i-- )
	$_data['meta'] .=
		'<div class="issuecover i'.$i.'" data-issue="'.$i.'">'
			.'<div class="img"></div>'
			.'<small>Issue '.$i.'</small>'
			.'<span>'.$_titles[$i-1].'</span>'
		.'</div>';

$_data['meta'] .=
		'<div style="clear:both;"></div>'
	.'</div>';

?>
