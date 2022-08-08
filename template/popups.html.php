<?php

$prop = $_REQUEST['prop'] ?? 'default';
$scopedcss = str_replace('.', '-', $prop);

$colors = [
	'box-background' => '#fefefe',
	'p-color' => '#ff7043',
	'h2-color' => '#ff5722',
	'animation-time' => '0.3s',
	'animation-easing' => 'ease-out'
	
];

switch($prop) {
	case 'popups.second':
		$innerContent = "
			{{#interest.musics}}
				<p><b>Musics :</b></p>
				<ul>
					{{#interest.musics.listing}}
						<li>{{{.}}}</li>
					{{/interest.musics.listing}}
				</ul>
			{{/interest.musics}}
		";
		break;
	case 'popups.autopop':
		$colors = [
			'box-background' => '#ff5722',
			'p-color' => '#fff',
			'h2-color' => '#fff',
			'animation-time' => '0.6s',
			'animation-easing' => 'ease-out'
		] + $colors;
		$innerContent = "
			{{#personal.firstName}}
				{{#personal.lastName}}
					<p><b>You are : {{{personal.firstName}}} {{{personal.lastName}}}</b></p>
				{{/personal.lastName}}
			{{/personal.firstName}}
		";
		break;
	default:
		$innerContent = '';
		break;
}

$template =<<<HTML

	{{#{$prop}.functions.scripted}}{{/{$prop}.functions.scripted}}
	<style>
		.{$scopedcss} h2{
			margin:0;
			color: {$colors['h2-color']};
			font-size: 1.2rem;
		}
		.{$scopedcss} p{
			color: {$colors['p-color']};
			font-size:1rem;
		}
		.{$scopedcss} .box{
		    margin-bottom: 0;
			position:relative;
			background: {$colors['box-background']};
			border-radius: 10px;
			box-shadow: 5px 5px 10px #000000a3;
			opacity:0;
			animation: {$scopedcss}-opacitated {$colors['animation-time']} {$colors['animation-easing']} 1 forwards;
		}
		@keyframes {$scopedcss}-opacitated {
			from {
				opacity: 0;
				margin-bottom: 10rem;
			}
			to {
				opacity: 1;
				margin-bottom: 0;
			}
		}
		.{$scopedcss} .box .content{
			padding:1.5rem;
		}
		.{$scopedcss} .box .content img{
			width: calc(100vw - (100vw - 100%));
		}
		.{$scopedcss} ul{
			font-size: 0.8rem;
    		color: #e64a19;
    	}
		.{$scopedcss} ul li{
			font-size: 0.8rem;
    		color: #e64a19;
    	}
    	.{$scopedcss} button.popup-close{
    	    display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			box-sizing: border-box;
			margin: 0;
			padding: 10px;
    	}
	</style>
	<div class="{$scopedcss}">
		<div class="box">
			<div class="content">
				<h2>Popups: <small>{$prop}</small></h2>
				{$innerContent}
				<p>{{{{$prop}.content}}}</p>
				<br />
				<button class="popup-close">Close</button>
			</div>
		</div>
	</div>

HTML;

exit($template);

//EOF