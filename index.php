<?php 

$dataBindersPersonal = base64_encode(json_encode([
  
  //standard props
  'firstName' => 'John',
  'lastName' => 'Doe',
  'age' => '54',
  'gender' => 'homme',

  //those need to be "use strict" compliant JS, also we cannot use those quotes: `blabla`
  //the access to render() and text [which is the text between {#}...{/}] 
  //will always be present in those func
  //some sync work around ex: https://javascript.plainenglish.io/async-await-javascript-5038668ec6eb

  'functions' => [

    'bold' =><<<JS
      
      //that just suround the content in bold
      //console.log("FUNCTIONS[bold]:", text);
      return '<i><b>' + render(text) + '</b></i>';

JS,

    'clickable' =><<<JS
      
      //that just make the content clickable and use a global js function
      //console.log("FUNCTIONS[clickable]:", text);
      return '<span class="clickable" onclick="onClickable(this);">' + render(text) + '</span>';

JS,
	
	'formable' =><<<JS
      
      //that just make the content clickable and use a global js function
      //console.log("FUNCTIONS[clickable]:", text);
      return '<span class="clickable" onclick="onFormable(this, \'personalData\');">' + render(text) + '</span>';

JS,
    
    'asyncMarital' =><<<JS
        
      //that just testing the acces to window.appz states via global function
      console.log("FUNCTIONS[asyncMarital]:", text);
      //async/await not working in that context
      //needs to return render(text) right now, 
      //so will build one so the async can write too it later when ready
      const id = ('marital-msg-' + rand());
      //the async states call later
      Appz().then(async (appz) => {
        const m = await appz.gstates('personal.marital');
        //its an async func so the element with that id was created
        //but if another changed occur since its async it wont be there anymore
        //so check existence
        const el = document.getElementById(id);
        console.log("FUNCTIONS-ASYNCHED[asyncMarital]:", m, el);
        if(m && el){
          if(m.toLowerCase() === 'm'){
            el.innerHTML = " ---> <b> Soooo sad :{</b> ";
          }else{
            el.innerHTML = " ---> <b style=\"color:#ab47bc;\"> Wow that's funtastic !!!</b> ";
          }  
        }
      }); 
      //right now no choice thats the way mustache works
      //but we will return a modify templace content with some id the retrieve it when async 
      return render(text.replace('{{id}}', id));
          
JS,    
  ]
]));

$dataBindersInterest = base64_encode(json_encode([
  'musics' => [
    'listing' => ['rap', 'muzak', 'rock', 'metal', 'funk', 'classic', 'blues', 'jazz']
  ],  
  'sport' => 'soccer',
  'animal' => 'dogs'
]));

$templatePersonalInterest = base64_encode(utf8_decode(<<<HTML

  <div style="padding:10px;"> 
    <p>
      {{#personal}}
        <span>{{personal.firstName}} {{personal.lastName}}</span>
        {{#personal.age}}
          {{#personal.functions.getAge}}{{/personal.functions.getAge}}
          {{#personal.functions.formable}}
            {{#personal.functions.bold}}
                <span>&agrave; {{personal.age}}<span>
            {{/personal.functions.bold}}
          {{/personal.functions.formable}}
        {{/personal.age}}   
      {{/personal}}
      {{#interest.sport}}
        aime le 
        <span class="clickable" onclick="onClickable(this, 'interest.sport');">{{interest.sport}}</span>  
      {{/interest.sport}}
      {{#interest.musics}}
        and musics: 
        {{#interest.musics.listing}}
          {{{.}}},
        {{/interest.musics.listing}}  
      {{/interest.musics}}
    </p> 
</div> 

HTML));

//the top slider
$slider = [
    'id' => 'slider-top',
    'prop' => 'slider.flowers',
    'interval' => 6000
];

//will inject directly the globally used function
//which should contains all across functionnalities
$globalJsFile = $_SERVER["DOCUMENT_ROOT"].'/js/global.js';
$globalJsCode = file_exists($globalJsFile) ? file_get_contents($globalJsFile) : '';

//will inject directly the globally used function
//which should contains all across functionnalities
$bundleJsFile = $_SERVER["DOCUMENT_ROOT"].'/js/bundle.js';
$bundleJsCode = file_exists($bundleJsFile) ? file_get_contents($bundleJsFile) : '';

?>
<!DOCTYPE html>
<html lang="fr-CA">
  <head>
    
    <link rel="preload" href="js/test.js" as="script">
    <link rel="preload" as="image" href="/images/slider/flowers/1.webp">
    
    <meta name="viewport" content="height=device-height,width=device-width,initial-scale=1,maximum-scale=1">
    <meta charset="utf-8">
    <title>Binding-Binded-Binders-Mustache</title>
    <style>
      ::placeholder {
        color: #bdbdbd;
        font-size: 0.75rem;
        position: absolute;
        top: 3px;
        left: 3px;
      }
      :root{
        --padding: 1rem;
        --margin: 0.5rem;
        --font-size-small:0.75rem;
        --font-size-regular:1rem;
        --font-size-medium:1.25rem;
        --font-size-big:1.5rem;
        --font-size-bigger:2rem;
      }
      body{
        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
        margin: 0;
        padding: 10px 10px 100px 10px;
      }
      INPUT[type]{
        border-style: solid;
        border-radius: 0 1rem 1rem 1rem;
        padding: var(--padding);
        margin: var(--margin);
        font-size:var(--font-size-regular);
        width: calc(100% - (var(--margin) * 2));
        box-sizing: border-box;
      }
      INPUT:disabled {
        background: #eee;
      }
      .container{
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-evenly;
      }
      .container.wrap{
        flex-wrap: wrap;
      }
      .container h3{
        width: 8rem;
        padding: var(--padding);  
        text-align: right;
        margin: var(--margin);
      }
      .container button{
       margin: 10px;  
       cursor:pointer;
      }
      .response{
        border: 0;
        padding: var(--padding);
        margin: var(--margin);
        font-size: var(--font-size-small);
        word-break: break-all;
        color: #aaa;
        width: 100%;
        box-sizing: border-box;
        background-color: #424242;
        font-family: monospace;
        padding-bottom: 40px;
        position: relative;
        padding-right: 100px;
        max-height: 200px;
        overflow: auto;
        /*display:none;*/
      }
      .response > div {
        display: inline;
      }
      /* to make the content NOT showing but keep the box with the clear states button */
      .response div[data-binded] {
        display: none;
      }
      .text{
        font-size: var(--font-size-medium);
        padding: 0;
        margin: var(--margin);
        word-break: break-all;
        color: #999;
        width:calc(100% - var(--margin) * 2);
        box-sizing: border-box;
        border: 1px dotted #999;
        position: relative;
        background: #fff;
      }  
      .infos{
        font-size: var(--font-size-regular);
        color: #333;
      }  
      .clickable{
        font-weight: bold;
        cursor: pointer;
        text-decoration: underline;
      }
      .double-binding-binded{
        border-color:#ff9900;
      }
      .binding-binded{
        border-color:#ab47bc;
      }
      .binding{
        border-color:#009688;
      }
      .floating{
        position: fixed;
        bottom: 10px;
        left: 10px;
        z-index:1;
      }
      .floating button{
        box-shadow: 5px 5px 10px #000000a3;
        background: #2196f3;
        border: 0;
        color: #b2ebf2;
        font-size: 2rem;
        border-radius: 5px;
        cursor:pointer;
        padding: 0.5rem;
        line-height: 1.5rem;
        opacity: 0.75;
      }
      button.clear{
        border: 0;
        border-radius: 5px;
        color: #fff;
        background: #b71c1c77;
        cursor: pointer;
        margin: 0;
        position: absolute;
        top: 15px;
        right: 15px;
        padding: 5px;
      }
      .loading::before {
        display: flex;
        position: absolute;
        content: "";
        font-size: 1.5rem;
        line-height: 1.5rem;
        color: #ccc;
        animation: loading-anim 1s linear infinite;
        justify-content: center;
        letter-spacing: 0;
        align-items: center;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
      @keyframes loading-anim {
        0% { content: "❤";}
        25%{ content: "❤❤";}
        50%{ content: "❤❤❤";}
        75%{ content: "❤❤❤❤";}
      }
      .full-width{
        max-width:100%;
        min-width:100%;
      }
      div.popup-intersect{
		  background: #aaa;
		  border: 0;
		  margin: var(--margin);
		  padding: var(--padding);
		  color: #fff;
		  text-align: center;
	  }
      @media only screen and (max-width: 480px) {
        .text {
          min-height: calc((100vw / 3));
        }
        .response{
          max-height: calc((100vw / 2.5));
          /*min-height: calc((100vw / 2.5)); */ /* enable when we show the response inside the box */
        }
        #slider-top .text{
          min-height: calc((100vw * 1.25)  + 2.5rem); /* + the bottom slider bar height */
        }
      }
      @media only screen and (min-width: 480px) {
        #slider-top {
          min-height: 582px; /* manually bad calc todo a real one */
        }
        .response div[data-binded] {
          display: block;
        }
      }

    </style>

      <script>
          window.appz = null;
          window.timing = Date.now();
      </script>
    
  </head>
  <body id="body" class="body">
    <!-- directly base64 json object -->
    <input type="hidden" value="personal" data-binders="<?=$dataBindersPersonal?>">
    <input type="hidden" value="interest" data-binders="<?=$dataBindersInterest?>">

    <!-- from file: /data/phones.json -->
    <input type="hidden" value="phones" data-binders="@phones.json">

    <!-- from inside the elemtn content text with a long states path for testing -->
    <script type="application/json" data-value="popups" data-binders="#">
      {
        "sequence" : [
            "first", "second", "third"
        ],
        "current": 0,
        "automatic": "autopop"
      }
    </script>

    <!-- a template to be used by data-templated, this one will use the personal.getAge functions to show age -->
    <template data-template="infos">
      <div style="padding:10px;">
        {{#personal}}
          <h2>
            {{personal.firstName}} 
            {{personal.lastName}} 
            {{#personal.age}}
              {{personal.age}} ans
            {{/personal.age}}
          </h2>
        {{/personal}}
        {{#phones}}
          <p><b>Phones :</b></p>    
          <p>
            Home: {{phones.home}} <br />
            Office: {{phones.office}} 
            {{#personal.marital}}
              <br />Marital: {{{personal.marital}}}
              {{#personal.functions.asyncMarital}}
                <span id="{{id}}"></span>
              {{/personal.functions.asyncMarital}}
            {{/personal.marital}}
          </p>
        {{/phones}}  
        {{#interest.musics}}
          <p><b>Musics :</b></p>    
          <ul>
          {{#interest.musics.listing}}
            <li>{{{.}}}</li>
          {{/interest.musics.listing}}
          </ul>
        {{/interest.musics}}
      </div>
    </template>  

    <div id="<?=$slider['id']?>">
      <input type="hidden" value="<?=$slider['prop']?>" data-binders="@slider.json.php?prop=<?=$slider['prop']?>&uid=<?=$slider['id']?>">
      <div class="container wrap">
          <div class="response">
              <span>Slider Data:</span>
              <div data-binded="<?=$slider['prop']?>"></div>
              <button class="clear" data-action="delete" data-prop="<?=$slider['prop']?>">clear state</button>
          </div>    
          <div class="text infos" data-binded="<?=$slider['prop']?>" data-templated="@slider.html.php?prop=<?=$slider['prop']?>&interval=<?=$slider['interval']?>">
            
            <!-- 
              instead of a loader icon
              so will put a starter image since it will load th slider from the web, 
              which can be slow, but will use a reduce size ,
              dont forget tht content will be overwrited with the template content
              START HERE
            -->

            <style>
                /* our basic */
        
                #content-slider-loading{
                    color: #4caf50;
                    padding: 10px;
                    background: #e8f5e977;
                }
                
                /* scoped slider style */

                #content-slider-loading * {
                    box-sizing: border-box;
                }
                #content-slider-loading .slider {
                    width: calc(100vw - (100vw - 100%));
                    text-align: center;
                    overflow: hidden;
                    position: relative;
                }
                #content-slider-loading .slides {
                    display: flex;
                    overflow: hidden;
                    position: relative;
                }
                #content-slider-loading .slides > div {
                    flex-shrink: 0;
                    width: calc(100vw - (100vw - 100%));
                    height:100%;
                    margin-right: 10px;
                    border-radius: 10px;
                    background: #eee;
                    transform-origin: center center;
                    transform: scale(1);
                    transition: transform 0.5s;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 100px;
                }
                #content-slider-loading img {
                    width: calc(100vw - (100vw - 100%));
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: calc((100vw - (100vw - 100%)) / 1.3);
                }
            </style>  

            <div id="content-slider-loading">  
              <div class="slider">
                <div class="slides">
                  <div id="content-slider-top-slide-1">
                    <img src="/images/slider/flowers/1.webp" title="slider.flowers #1" alt="slider.flowers #1">
                  </div>
                </div>
              </div>	
            </div>  


            <!-- END HERE -->
          </div>
      </div>
    </div>

    <div class="container">
      <div class="response">
        <span>Personal Data: </span>
        <div data-binded="personal"></div>
        <button data-action="delete" data-prop="personal" class="clear">clear state</button>  
      </div>  
    </div>  
    
    <div class="container">  
      <input type="text" value="" data-binding="personal.firstName" placeholder="First Name :" class="binding">
      <input type="text" value="" data-binding="personal.lastName" placeholder="Last Name : " class="binding">
      <!-- that one will overide the value from the states since its not empty -->
      <input type="number" value="666" data-binding="personal.age" data-binded="personal.age" placeholder="Age :" class="double-binding-binded">
    </div>
    
    <div class="container" id="personal-row-text">
      <input type="text" value="" data-binded="personal.firstName" disabled>
      <input type="text" value="" data-binded="personal.lastName" disabled>
      <input type="number" data-binding="personal.age" data-binded="personal.age" placeholder="Age :" class="double-binding-binded">
    </div>  
    
    <div class="container">
      <div class="response">
        <span>Interest Data:</span>
        <div data-binded="interest"></div>
        <button data-action="delete" data-prop="interest" class="clear">clear state</button>  
      </div> 
    </div>  
    
    <div class="container">
      <input type="text" value="" data-binding="interest.sport" placeholder="Sport :" class="binding">
      <input type="text" value="" data-binding="interest.animal" placeholder="Animal :" class="binding">
    </div> 

    <div class="container wrap">
       <!-- with template encoded base64 -->
      <div class="text" data-binded="personal, interest" data-templated="<?=$templatePersonalInterest?>">
        <div class="loading"></div>
      </div>  
      <div id="interest-slider" class="full-width"></div>
      <div id="interest-news" class="full-width"></div>
      <div id="interest-calendar" class="full-width"></div>
    </div>  
    
    <div class="container">
      <div class="response">
        <span>Phones Data:</span>
        <div data-binded="phones"></div>
        <button data-action="delete" data-prop="phones" class="clear">clear state</button>  
      </div> 
    </div>
    
    <!-- an intersect for autopopup -->
    <div class="popup-intersect">intersection observer</div>
    
    <div class="container">
      <!-- with template html from the page -->
      <div class="text infos" data-binded="personal, phones, interest.musics" data-templated="#infos">
        <div class="loading"></div>
      </div>  
    </div>  

    <div class="floating">
      <button data-action="undo">&#9100;</button>  
    </div>

   <script src="js/test.js" async></script>
   <script><?=$globalJsCode?></script>
   <script><?=$bundleJsCode?></script>
  
  </body>
</html>
