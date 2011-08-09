opera.extension.onmessage = function(event) {
	switch (event.data) {
		case "btnAuto":
			opera.postError("btnAuto");
			top.postMessage("btnAuto");
			break;

		case "doAuto":
			// TongWen.trans2Simp();
			//TongWen.transAuto(window.top.document);
			opera.postError("doAuto");
			TongWen.transAuto(document);
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