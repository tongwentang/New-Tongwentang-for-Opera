window.addEventListener('DOMContentLoaded', function(event) {
	opera.extension.onmessage = function(event) {
		var data = event.data;
		// load data
		if (data.tongwen.userPhrase.enable) {
			TongWen.addT2STable(data.tongwen.userPhrase.simp);
			TongWen.addS2TTable(data.tongwen.userPhrase.trad);
		}
		if (data.tongwen.symConvert) {
			TongWen.addT2STable(data.tongwen.symbolT2S);
			TongWen.addS2TTable(data.tongwen.symbolS2T);
		}
		// do action
		switch (data.act) {
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
	
	opera.extension.postMessage('docLoaded');
}, false);
