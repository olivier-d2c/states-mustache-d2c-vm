<?php
$prop = $_REQUEST['prop'] ?? 'default';
$title = ucfirst($prop);
$uid = $_REQUEST['uid'] ?? 'SID-'.crc32($prop.time());
$cuid = 'content-'.$uid;

switch($prop){
	default:
		break;
}

//that should load the variable directly into this file
//it contains replacer var so it must be after all ned vars are initialized
$scripted = null;
require_once($_SERVER["DOCUMENT_ROOT"].'/php/scripted.php');

$forms = [
	"cuid" => $cuid,
	"scripts" => [
		[
			"src" =>  'js/libs/forms.js',
			"standalone" => true,
			"async" => true
		]
	],
	"csss" => [
		[
			"href" => 'https://fonts.d2cmedia.ca/KiaSignatureLight.woff2',
			"standalone" => true
		],
		[
			"href" => 'https://fonts.d2cmedia.ca/KiaSignatureBold.woff2',
			"standalone" => true
		],
		[
			"href" => 'https://fonts.googleapis.com/css2?family=Caveat&display=swap',
			"standalone" => true
		],
		[
			"href" => 'css/libs/forms.css',
			"standalone" => true
		],
		[
			"href" => 'css/fonts/fonts.css',
			"standalone" => true
		],
		
	],
	"functions" => [
		"scripted" => $scripted
	]
];

$json = json_encode($forms);

exit($json);

//EOF