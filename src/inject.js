function save_options() {
	const enable = document.getElementById('enable').checked;
	chrome.storage.local.set({
		enable: enable
	});
}

function inject(options) {
	if (!options.enable) return;

	override();

	function override() {
		const videoElem = document.createElement('video');
		const origCanPlayType = videoElem.canPlayType.bind(videoElem);
		videoElem.__proto__.canPlayType = makeModifiedTypeChecker(origCanPlayType);

		if ((mse = window.MediaSource)) {
			const origIsTypeSupported = mse.isTypeSupported.bind(mse);
			mse.isTypeSupported = makeModifiedTypeChecker(origIsTypeSupported);
		}
	}

	function makeModifiedTypeChecker(origChecker) {
		return function(type) {
			if (type === undefined) return '';

			const disallowed_types = [ 'av01', 'vp9', 'vp8', 'webm' ];

			for (var i = 0; i < disallowed_types.length; i++) {
				if (type.indexOf(disallowed_types[i]) !== -1) return '';
			}

			return origChecker(type);
		};
	}
}
