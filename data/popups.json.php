<?php
$prop = $_REQUEST['prop'] ?? 'default';
$uid = $_REQUEST['uid'] ?? 'SID-'.crc32($prop.time());
$cuid = 'content-'.$uid;

switch($prop) {
	case 'popups.first':
		$content = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.";
		break;
	case 'popups.second':
		$content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
		break;
	case 'popups.autopop':
		$content = "This is an automatic popup triggered by the \".popup-intersect\" intersection observer";
		break;
	default:
		$content = "<img src='images/popups/chicken.webp' title='chicken' alt='chicken'>";
		break;
}

//that should load the variable directly into this file
//it contains replacer var so it must be after all ned vars are initialized
$scripted = null;
require_once($_SERVER["DOCUMENT_ROOT"].'/php/scripted.php');

$popups = [
	"cuid" => $cuid,
	"content" => $content,
	"scripts" => [
		[
			"src" =>  'js/libs/jquery.js',
			//do we need only 1 copy for the entire site
			//or reload it each time
			"standalone" => true,
			"async" => true
		],
		[
			"src" =>  'js/libs/popups.js',
			//do we need only 1 copy for the entire site
			//or reload it each time
			"standalone" => true,
			"async" => true
		]
	],
	"csss" => [
		[
			"href" =>  'css/libs/popups.css',
			//do we need only 1 copy for the entire site
			//or reload it each time
			"standalone" => true
		]
	],
	"functions" => [
		"scripted" => $scripted
	]
];

$json = json_encode($popups);

exit($json);

//EOF