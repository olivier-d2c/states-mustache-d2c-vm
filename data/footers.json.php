<?php

$lang = $_REQUEST['lang'] ?? 'en';

if($lang === 'fr'){
	$footer = [
		'listing' => [
			[
				'text' => 'link #1',
				'link' => '/',
				'id' => 'footer-1'
			],
			[
				'text' => 'link #2',
				'link' => '/',
				'id' => 'footer-2'
			],
			[
				'text' => 'link #3',
				'link' => '/',
				'id' => 'footer-3'
			],
			[
				'text' => 'link #4',
				'link' => '/',
				'id' => 'footer-4'
			],
			[
				'text' => 'Popit test',
				'link' => 'javascript:window.popit();',
				'id' => 'footer-popit'
			],
			[
				'text' => 'Replace {{MAKE}}',
				'link' => '/',
				'id' => 'footer-replacer'
			]
		]
	];
}else{
	$footer = [
		'listing' => [
			[
				'text' => 'Home',
				'link' => '/',
				'id' => 'footer-home'
			],
			[
				'text' => 'Contact Us!',
				'link' => '/',
				'id' => 'footer-contact'
			]
		]
	];
}

$json = json_encode($footer);

exit($json);


//EOF