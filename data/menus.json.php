<?php

$lang = $_REQUEST['lang'] ?? 'en';
$menu = @file_get_contents($_SERVER["DOCUMENT_ROOT"]."/data/json/menu.{$lang}.json");
$menu = json_decode($menu, true);
array_push($menu['listing'], [
	"text" => $lang === 'fr' ? 'English' : 'Francais',
	"link" => $lang === 'fr' ? '/en' : '/fr',
	"id" => "menu-lang"
]);
$menu = json_encode($menu);
exit($menu);

//EOF