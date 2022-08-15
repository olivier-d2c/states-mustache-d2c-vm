<?php

//thats only for testing because its really a bad way of doing it lol!

require_once $_SERVER["DOCUMENT_ROOT"].'/../../vendor/olivier/vendor/mustache/mustache/src/Mustache/Autoloader.php';
Mustache_Autoloader::register();

function ssr($name, $template, $data, $merge = []){
	$m = new Mustache_Engine();
	$template = @file_get_contents($_SERVER["DOCUMENT_ROOT"]."/template/{$template}");
	$data = json_decode(@file_get_contents($_SERVER["DOCUMENT_ROOT"]."/data/{$data}"), true);
	return $m->render($template, [$name => array_merge($data, $merge)]);
}

//EOF