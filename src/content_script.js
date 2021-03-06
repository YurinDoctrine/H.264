newFunction();
function newFunction() {
	chrome.storage.local.get({ enable: true }, (options) => {
		const optionsJson = JSON.stringify(options);

		const injectScript = document.createElement('script');
		injectScript.textContent = `${inject.toString()}; inject(${optionsJson});`; // Use textContent instead of src so it's synchronous
		injectScript.onload = () => injectScript.parentNode.removeChild(injectScript); // Remove <script> node after it has run

		const injectParent = document.head || document.documentElement;
		injectParent.appendChild(injectScript);
	});
}
