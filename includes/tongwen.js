opera.extension.onmessage = function(event) {
	switch (event.data) {
		case "btnAuto":
			TongWen.transAuto(window.top.document);
			break;

		case "btnTrad":
			TongWen.trans2Trad(window.top.document);
			break;

		case "btnSimp":
			TongWen.trans2Simp(window.top.document);
			break;

		case "doAuto":
			opera.postError("doAuto");
			// TongWen.trans2Simp();
			TongWen.transAuto(window.top.document);
			// TongWen.transAuto(document);
			break;
	}
	// alert(opera.extension.window);
	/*
  // Get content of incoming message.
  var message  = event.data;
  opera.postError("Background process sent: " + message);

  //  Replies back to background script.
  var reply = "Background process's message only had " + (message ? message.length : 0) + " characters.";
  event.source.postMessage(reply);
	 */
};