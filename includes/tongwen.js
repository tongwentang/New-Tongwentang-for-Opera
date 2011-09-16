window.addEventListener('DOMContentLoaded', function(event) {
	opera.extension.onmessage = function(event) {
		switch (event.data) {
			case "btnAuto":
				TongWen.transAuto(document);
				break;

			case "btnTrad":
				TongWen.trans2Trad(document);
				break;

			case "btnSimp":
				TongWen.trans2Simp(document);
				break;
		}
	};
	
	opera.extension.postMessage('Loaded');
}, false);
