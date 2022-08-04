
//so this time will lazy use jquery to put some functionnality to the popup-close button
//this file will be injected just once
//so it will aply to all subsequent calls of popups data

console.log('Allo! from /js/libs/popups.js');

!(async () => {
	
	jq().then((b) => {
		if(b) {
			//all popups whatever they are
			$('body').on('click', 'button.popup-close', (ev) => {
				const el = $(ev.target);
				const container = el.closest('.popup-container');
				const id = container.attr('id');
				container.remove();
				//get the nearest container and remove it
				console.log(`Closing popup ${id}`, ev);
			});
		}else{
			console.error('looks like jquery dont want to load under 30 seconds.');
		}
	})

})();

//EOF