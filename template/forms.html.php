<?php

$prop = $_REQUEST['prop'] ?? 'default';
$uid = $_REQUEST['uid'] ?? 'SID-'.crc32($prop.time());
$scopedcss = str_replace('.', '-', $prop);

$template =<<<HTML
    {{#{$prop}}}
        <style>
            .{$scopedcss}{
                font-family: SignatureLight, sans-serif;
                font-size: 1rem;
                background: #607d8b;
                color: #ccc;
                padding:10px;
            }
            .{$scopedcss} h2{
            	color: #cfd8dc;
            }
            .{$scopedcss} p{
            	font-family: 'Caveat', cursive;
            	font-size: 1.5rem;
            	color: #fff;
            }
            .{$scopedcss} button{
                font-family: 'Caveat';
				width: calc(100% - var(--padding));
				margin-top: 1.5rem;
				padding: var(--padding);
				box-sizing: border-box;
				font-size: 2rem;
            }
        </style>
        <div class="{$scopedcss}" id="{{{$prop}.cuid}}">
            <h2>Forms: <small>{$prop}</small></h2>
            <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
            <input type="number" value="" data-binding="personal.age" data-binded="personal.age" placeholder="Age:" class="double-binding-binded">
            <input type="text" value="" data-binding="personal.firstName" data-binded="personal.firstName" placeholder="FirstName:" class="double-binding-binded">
            <input type="text" value="" data-binding="personal.lastName" data-binded="personal.lastName" placeholder="LastName:" class="double-binding-binded">
            <button class="form-close">Close</button>
        </div>
        <!-- will put that at the end this time just to test injection -->
		{{#{$prop}.functions.scripted}}
			<script>
				//not choice then to be non blocking, because it needs to write content before
				(async () => {
					//this will be injected by the functions::scripted from the json data
					//to access the element inside of it only
					const parentId = "{$uid}";
					const scopeElementId = "{{{$prop}.cuid}}";

					if(!(new RegExp(parentId)).test(scopeElementId)){
						debugger;
					}	


					//debugger;
					console.log("SCOPEELEMENTID:", {scopeElementId, parentId});
					//the close functions
					const close = (ev) => {
						//remove our parent container

						//@TODO: have a bug here, 
						//where parentId is the previous opended one, but scopeElementId is the current one ???
						//even if in the template form.html.php return is the good one ???
						//so must exist somewhere an async change 
						//since the scopeElementId is based on states in js
						//and the parentId is based on ajax call at creation of the template in php
						//that prob come with scripted.php inject script using the old one instead


						document.getElementById(parentId).remove();
						//disconnect the observer
						observer.disconnect();
						//than change some flags, dont await the Appz we dont care
						Appz().then((appz) => {
							//set the states to false, just to know it was opened at least one time
							//if we want to do seomthing diffretnt the next time
							appz.sstates('{$prop}', false);
						});
					};
					//we have a form input that is doule-binding-binded and using states data
					//so we must traverse to create the JS bind
					//by reading the data-binding data-binded etc... attributes
					//so this way changing the age on this form will also change them all
					//and thats the goal of the test :)
					const remap = () => {
						//build it
						traverse(scopeElementId);
						//the close functionnality
						document.querySelector(`#\${scopeElementId} .form-close`).onclick = close;
					};
					//when we clear states and reput it back
					//because that script will only run once the first time its created
					//we need to re traverse
					const observer = new MutationObserver((ev) => {
						ev.forEach((mutation) => {
							//check if it was cleared so we can remove the event from it
							//just for debug
							[...mutation.addedNodes].forEach((entry) => {
								if(entry.id === '{{{$prop}.cuid}}'){
									console.log('MUTATION-ADDEDNODES[{{{$prop}.cuid}}]', entry);
									//we can remap all functionnality on element inside it, retraverse it
									remap();
								}
							});
						})
					});
					//the element is not rendered yet so we have to stack the call
					const interval = setInterval(() => {
						const el = document.getElementById(scopeElementId);
						if(el === null){
							return;
						}
						clearInterval(interval);
						// Start observing the parent of the container, NOT the one containgn everything
						// target node for configured mutations
						observer.observe(el.parentElement, { childList: true });
						//will run only once
						remap();
						//last thing focus the scrooooll to the injected form
						el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
					});	
				})();
			</script>
    	{{/{$prop}.functions.scripted}}
    {{/{$prop}}}
HTML;

exit($template);

//EOF