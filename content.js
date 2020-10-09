console.log("BrickPlayer Launcher content script injected!");

function main() {
	const placeData = {
		ip: BH.apps.PlayButton.$children[0].ip,
		port: BH.apps.PlayButton.$children[0].port,
		id: BH.apps.PlayButton.$children[0].set_id,
		play: BH.apps.PlayButton.$children[0].play,
	}

	// The game is not currently active
	if (!placeData.play) return

	// Inject buttons
	const buttonDiv = document.querySelector('div#playbutton-v')
	const brickPlayerButton = document.createElement('button')
	const buttonContent = document.createTextNode('PLAY (BrickPlayer)')

	brickPlayerButton.appendChild(buttonContent)
	brickPlayerButton.classList.add('blue', 'mb2')
	buttonDiv.appendChild(brickPlayerButton)

	// Handle launch
	function brickPlayerConnect() {
		$.ajax({
			dataType: 'json',
			url: 'https://api.brick-hill.com/v1/auth/generateToken?set='+placeData.id,
			xhrFields: {
				withCredentials: true
			}
		}).done((data) => {
			const token = data.token
			const protocolArgs = `${token}/${placeData.ip}/${placeData.port}/${placeData.id}`
			window.location = "brickplayer:" + protocolArgs
		})
	}
	
	brickPlayerButton.onclick = brickPlayerConnect
}

function inject(source) {
	const j = document.createElement('script'),
	f = document.getElementsByTagName('script')[0];
	j.textContent = source
	f.parentNode.insertBefore(j, f)
	f.parentNode.removeChild(j)
}

// Wait for the play button to be added to the dom
const observer = new MutationObserver(() => {
	if (document.contains(document.querySelector('div#playbutton-v'))) {
		observer.disconnect()
		return inject(`(${main.toString()})()`);
	}
})

observer.observe(document, {
	childList: true,
	subtree: true,
})