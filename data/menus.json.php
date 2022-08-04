<?php

$lang = $_REQUEST['lang'] ?? 'en';

if($lang === 'fr'){
    $menu = [
        'listing' => [
            [
                'text' => 'Accueil',
                'link' => '/',
                'id' => 'menu-home'
            ],
            [
                'text' => 'Contactez-nous!',
                'link' => '/contactez-nous/',
                'id' => 'menu-contact'
            ],
			[
				'text' => 'Open a popup!',
				'link' => 'javascript:popit();',
				'id' => 'popup-opener'
			],
            [
                'text' => 'Go to slide 3 of top slider!',
                'link' => '#content-slider-top-slide-3',
                'id' => 'goto-slider-top'
            ]
        ]
    ];
}else{
    $menu = [
        'listing' => [
            [
                'text' => 'Home',
                'link' => '/',
                'id' => 'menu-home'
            ],
            [
                'text' => 'Contact Us!',
                'link' => '/contact-us/',
                'id' => 'menu-contact'
            ]
        ]    
    ];
}

$json = json_encode($menu);

exit($json);


//EOF