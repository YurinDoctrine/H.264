function inject(options) {
  if (!options.enable) return;

  override();

  function override() {
    // Override video element canPlayType() function
    const videoElem = document.createElement("video");
    const origCanPlayType = videoElem.canPlayType.bind(videoElem);
    videoElem.__proto__.canPlayType = makeModifiedTypeChecker(origCanPlayType);

    // Override media source extension isTypeSupported() function
    if ((mse = window.MediaSource)) {
      const origIsTypeSupported = mse.isTypeSupported.bind(mse);
      mse.isTypeSupported = makeModifiedTypeChecker(origIsTypeSupported);
    }
  }

  // return a custom MIME type checker that can defer to the original function
  function makeModifiedTypeChecker(origChecker) {
    // Check if a video type is allowed
    return function (type) {
      if (type === undefined) return "";

      const disallowed_types = ["av01", "vp8", "vp9", "webm"];

      // If video type is in disallowed_types, say we don't support them
      for (var i = 0; i < disallowed_types.length; i++) {
        if (type.indexOf(disallowed_types[i]) !== -1) return "";
      }

      if (options.block_60fps) {
        const match = /framerate=(\d+)/.exec(type);
        if (match && match[1] > 40) return "";
      }

      // Otherwise, ask the browser
      return origChecker(type);
    };
  }
}
