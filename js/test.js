
//only a test runner

!(async () => {
	
	const listAllEventListeners = () => {
		const allElements = Array.prototype.slice.call(document.querySelectorAll('*'));
		allElements.push(document); // we also want document events
		const types = [];
		for (let ev in window) {
			if (/^on/.test(ev)) types[types.length] = ev;
		}
		let elements = [];
		for (let i = 0; i < allElements.length; i++) {
			const currentElement = allElements[i];
			for (let j = 0; j < types.length; j++) {
				if (typeof currentElement[types[j]] === 'function') {
					elements.push({
						"node": currentElement,
						"type": types[j],
						"func": currentElement[types[j]].toString(),
					});
				}
			}
		}
		return elements.sort(function(a,b) {
			return a.type.localeCompare(b.type);
		});
	}
	
	const addMenus = async () => {
		
		const prop = `menus`
		const container = 'menus-' + rand()
		
		await anode('body', 'div', {id: container}, `
			<input type="hidden" value="${prop}" data-binders="@menus.json.php?lang=fr">
			<div class="container wrap">
				<div class="response">
					<span>Menus Data:</span>
					<div data-binded="${prop}"></div>
					<button class="clear" data-action="delete" data-prop="${prop}">clear state</button>
				</div>
				<div class="text infos" data-binded="${prop}" data-templated="@menus.html">
					<div class="loading"></div>
				</div>
			</div>
		`)
		
		traverse(container)
		
		return container
	}
	
	const addNews = async (news) => {
		
		const prop = `news.${news}`
		const container = 'news-' + rand()
		
		await anode('interest-news', 'div', {id: container}, `
			<input type="hidden" value="${prop}" data-binders="@news.json.php?prop=${prop}&uid=${container}">
			<div class="container wrap">
				<div class="response">
					<span>News ${news} Data:</span>
					<div data-binded="${prop}"></div>
					<button class="clear" data-action="delete" data-prop="${prop}">clear state</button>
				</div>
				<div class="text infos" data-binded="${prop}" data-templated="@news.html.php?prop=${prop}">
					<div class="loading"></div>
				</div>
			</div>
		`)
		
		traverse(container)
		
		return container
		
	}
	
	const addInterestSlider = async (slider, interval) => {
		
		interval = interval ?? 5000
		const prop = `slider.${slider}`
		const container = 'slider-' + rand()
		
		await anode('interest-slider', 'div', {id: container}, `
			<input type="hidden" value="${prop}" data-binders="@slider.json.php?prop=${prop}&uid=${container}">
			<div class="container wrap">
				<div class="response">
					<span>Slider ${slider} Data:</span>
					<div data-binded="${prop}"></div>
					<button class="clear" data-action="delete" data-prop="${prop}">clear state</button>
				</div>
				<div class="text infos" data-binded="${prop}" data-templated="@slider.html.php?prop=${prop}&interval=${interval}">
					<div class="loading"></div>
				</div>
			</div>
		`)
		
		traverse(container)
		
		return container
		
	}

	// pushing later ondemand test with timeout or event scroll
	
	const test = async (delay) => {
		
		console.log('TIMING[TEST]:', tim());
		
		const addInterestSportObserver = async (appz) => {
			const list = ['soccer', 'foot']
			const obs = 'interest.sport'
			let loaded = false
			let id = null
			let s = await appz.gstates(obs)
			if(list.indexOf(s) !== -1){
				loaded = true
				
				console.log('TIMING[NEWS]:', tim())
				
				addNews(s).then((container) => {
					id = container
					console.log(`CONTAINERS-NEWS[${s}]`, container)
				})
			}
			appz.obsstates(obs, (s) => {
				console.log(`OBSSTATES[${obs}]:`, s)
				if(list.indexOf(s) !== -1){
					//fetch the news
					if(!loaded){
						loaded = true
						//we will load some sports news
						addNews(s).then((container) => {
							id = container
							console.log(`CONTAINERS-NEWS[${s}]`, container)
						})
					}
				}else{
					try{
						if(id !== null && loaded){
							//remove the news
							document.getElementById(id).remove();
							loaded = false
						}
					}catch(e){
						console.error(e)
					}
				}
			})
		}
		
		const addInterestAnimalObserver = async (appz) => {
			const list = ['dogs', 'cats']
			const obs = 'interest.animal'
			let loaded = false
			let id = null
			let s = await appz.gstates(obs)
			if(list.indexOf(s) !== -1){
				loaded = true
				
				console.log('TIMING[SLIDER]:', tim())
				
				addInterestSlider(s, 2000).then((container) => {
					id = container
					console.log(`CONTAINERS-SLIDER[${s}]`, container)
				})
			}
			appz.obsstates(obs, (s) => {
				console.log(`OBSSTATES[${obs}]:`, s)
				if(list.indexOf(s) !== -1){
					//fetch the news
					if(!loaded){
						loaded = true
						//we will load some sports news
						addInterestSlider(s, 2000).then((container) => {
							id = container
							console.log(`CONTAINERS-SLIDER[${s}]`, container)
						})
					}
				}else{
					try{
						if(id !== null && loaded){
							//remove the news
							document.getElementById(id).remove();
							loaded = false
						}
					}catch(e){
						console.error(e)
					}
				}
			})
		}
		
		const autopopup = (appz) => {
			//the action we do whe it intersect
			const observer = new IntersectionObserver((entries) => {
				entries.map((entry) => {
					if (entry.isIntersecting) {
						//was already triggered once
						if(parseInt(entry.target.dataset.istriggered) === 1){
							return;
						}
						//flag it so it wont redo it each time
						entry.target.dataset.istriggered = 1;
						//show the popup
						popit(true);
					}
				});
			});
			//the observer on the intersect for that specific element
			observer.observe(
				document.querySelector('.popup-intersect')
			);
		}
		
		//a listener in javascript on a specific prop change
		Appz().then(async (appz) => {
			
			console.log('TIMING[APPZ]:', tim());
			
			//some observer to trigger other things
			await addInterestSportObserver(appz)
			//some observer to trigger other things
			await addInterestAnimalObserver(appz)
			//add an auto poup intersection
			autopopup(appz)
			//listen to something that is not there yet
			//since the mnus is injected when scrolling only
			appz.obsstates('menus', (obj) => {
				console.log('OBSSTATES[menus]:', obj)
			})
			//lets put a decorator on some states values
			//which means will manipulate it before inserting it
			//a bit like a replacer vars if needed
			appz.decstates('menus', (obj) => {
				if(typeof obj.listing === 'object'){
					obj.listing.forEach((item, index) => {
						//we will replace the pattern by something else
						if(typeof item.text === 'string' && (new RegExp('{{MAKE}}', 'g')).test(item.text)){
							//just a fake replacement
							obj.listing[index].text = item.text.replace('{{MAKE}}', 'Subaru')
						}
					})
				}
				return obj
			})
		})
		
		//this will inject on scroll event to lazy load it
		const scrollListener = async (ev) => {
			//remove it since we only want it one time only
			document.removeEventListener('scroll', scrollListener)
			//we can lazy load our bottom Menus
			await addMenus()
		}
		
		//prevent default
		document.addEventListener('scroll', scrollListener, {passive: true});
		
		//those are lately injected with binded/binding to test listener
		!((t) => {
			return new Promise(resolve => {
				setTimeout(async () => {
					anode('personal-row-text', 'input', {
						type: 'text',
						value: "Femme",
						placeholder: "Gender :",
						'data-binded': "personal.gender",
						'data-binding': "personal.gender"
					})
					resolve(t)
				}, t);
			})
		})(delay).then((t) => {
			return new Promise(resolve => {
				setTimeout(async () => {
					anode('personal-row-text', 'input', {
						type: 'text',
						class: 'binding-binded',
						placeholder: "Marital :",
						'data-binded': "personal.marital",
						'data-binding': "personal.marital"
					})
					resolve(t)
				}, t);
			})
		}).then((t) => {
			setInterval(() => {
				console.table(listAllEventListeners())
			}, 120000);
		})
	}
	
	test(2000);
	
})();

//EOF