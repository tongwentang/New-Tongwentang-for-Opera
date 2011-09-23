window.addEventListener('DOMContentLoaded', function(event) {
	opera.extension.onmessage = function(event) {
		var data = event.data, isInput = false, val = '', attr = null, zhflag = '';

		// 載入標點符號轉換表
		if (data.tongwen.symConvert) {
			TongWen.addT2STable(data.tongwen.symbolT2S);
			TongWen.addS2TTable(data.tongwen.symbolS2T);
		}
		// 載入使用者定義的詞彙表
		if (data.tongwen.userPhrase.enable) {
			TongWen.addT2STable(data.tongwen.userPhrase.simp);
			TongWen.addS2TTable(data.tongwen.userPhrase.trad);
		}
		// 強制字型設定
		if (data.tongwen.fontCustom.enable) {
			TongWen.setTradFontset(data.tongwen.fontCustom.trad);
			TongWen.setSimpFontset(data.tongwen.fontCustom.simp);
			TongWen.enableCustomFontset(true);
		} else {
			TongWen.enableCustomFontset(false);
		}
		
		// 輸入區文字轉換
		if (
			(typeof document.activeElement.tagName !== 'undefined') &&
			(data.tongwen.inputConvert !== 'none')
		) {
			if (document.activeElement.tagName.toLowerCase() === 'textarea') {
				isInput = true;
			} else if (
				(document.activeElement.tagName.toLowerCase() === 'input') &&
				(document.activeElement.type.toLowerCase() === 'text')
			) {
				isInput = true;
			} else if (document.activeElement.isContentEditable) {
				isInput = false;
			}
		}
		
		if (isInput) {
			// 輸入區文字轉換
			val = document.activeElement.value;
			switch (data.tongwen.inputConvert) {
				case 'auto':
					attr = document.activeElement.getAttribute('zhtongwen');
					if (attr === null) {
						zhflag = 'traditional';
					} else {
						zhflag = (attr === 'traditional') ? 'simplified' : 'traditional';
					}
					document.activeElement.setAttribute('zhtongwen', zhflag);
					document.activeElement.value = TongWen.convert(val, zhflag);
					break;

				case 'trad':
					document.activeElement.value = TongWen.convert(val, 'traditional');
					break;

				case 'simp':
					document.activeElement.value = TongWen.convert(val, 'simplified');
					break;
			}
		} else {
			// 網頁轉換
			switch (data.act) {
				case 'btnAuto':
					TongWen.transAuto(document);
					break;

				case 'btnTrad':
					TongWen.trans2Trad(document);
					break;

				case 'btnSimp':
					TongWen.trans2Simp(document);
					break;
			}
		}
	};

	opera.extension.postMessage('docLoaded');
}, false);
