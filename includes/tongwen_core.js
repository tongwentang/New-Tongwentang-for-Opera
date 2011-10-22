/*global window: true, document: true*/

/* ***************************
 * Node Types http://www.w3schools.com/dom/dom_nodetype.asp
 * NodeType Named Constant
 * 1  ELEMENT_NODE
 * 2  ATTRIBUTE_NODE
 * 3  TEXT_NODE
 * 4  CDATA_SECTION_NODE
 * 5  ENTITY_REFERENCE_NODE
 * 6  ENTITY_NODE
 * 7  PROCESSING_INSTRUCTION_NODE
 * 8  COMMENT_NODE
 * 9  DOCUMENT_NODE
 * 10 DOCUMENT_TYPE_NODE
 * 11 DOCUMENT_FRAGMENT_NODE
 * 12 NOTATION_NODE
 *************************** */

var TongWen = (function () {

	var
		version  = "0.4",         // 版本

		flagSimp = "simplified",  // 簡體
		flagTrad = "traditional", // 繁體

		zhEncodesSimp = ["gb2312", "gbk", "x-gbk", "gb18030", "hz-gb-2312", "iso-2022-cn"],
		zhEncodesTrad = ["big5", "big5-hkscs", "x-euc-tw"],
		zhEncodesAll  = zhEncodesSimp.concat(zhEncodesTrad, ["utf-7", "utf-8", "utf-16le", "x-user-defined"]),

		enableFontset = false,
		fontTrad      = "PMingLiU,MingLiU,新細明體,細明體",
		fontSimp      = "MS Song,宋体,SimSun",

		t2s = {},                 // 繁轉簡 對照表
		s2t = {},                 // 簡轉繁 對照表

		maxSTLen = 1,             // 簡轉繁 最長的詞句
		maxTSLen = 1,             // 繁轉簡 最長的詞句

		curZhFlag = "",           // 目前網頁編碼
		styleIdx  = 0;            // 樣式索引

// =============================================================================

	function enableCustomFontset(bol) {
		enableFontset = bol;
	}

	function setTradFontset(val) {
		fontTrad = val;
	}

	function setSimpFontset(val) {
		fontSimp = val;
	}

	function setFont(doc, zhflag) {
		var css = "", sty = null;
		if (zhflag === flagTrad) {
			css = " font-family: " + fontTrad + " !important;";
		} else if (zhflag === flagSimp) {
			css = " font-family: " + fontSimp + " !important;";
		}

		sty = document.styleSheets[styleIdx];
		if (sty.insertRule && (typeof sty.addRule === "undefined")) {
			sty.addRule = function (rule, css, idx) {
				if (typeof idx === "undefined") {
					this.insertRule(rule + " { " + css + " }", this.cssRules.length);
				} else {
					this.insertRule(rule + " {" + css + "}", idx);
				}
			};
		}
		sty.addRule("*", css);
	}
// =============================================================================

	// 新增 簡轉繁 對照表
	function addS2TTable(table) {
		var i = null;
		for (i in table) {
			maxSTLen = Math.max(maxSTLen, table[i].length);
			s2t[i] = table[i];
		}
	}

	// 新增 繁轉簡 對照表
	function addT2STable(table) {
		var i = null;
		for (i in table) {
			maxTSLen = Math.max(maxTSLen, table[i].length);
			t2s[i] = table[i];
		}
	}

	function setZhFlag(doc, zhflag) {
		doc.documentElement.setAttribute("zhtongwen", zhflag);
	}

	function getZhFlag(doc) {
		var zhflag = "", lang = "", charset = "";
		if (doc && doc.documentElement) {
			lang = doc.documentElement.getAttribute("lang");
			if (lang === null) {
				charset = document.characterSet.toLowerCase();	
				if (zhEncodesAll.indexOf(charset) >= 0) {
					zhflag = (zhEncodesTrad.indexOf(charset) >= 0) ? flagTrad : flagSimp;
				}
			} else {
				switch (lang.toLowerCase()) {
				case "zh-tw":
				case "zh-hk":
					zhflag = flagTrad;
					break;
				case "zh-cn":
					zhflag = flagSimp;
					break;
				}
			}
		}
		return zhflag;
	}

	// 繁簡轉換
	function convert(str, zhflag) {
		var leng = 4, zmap = null, i = 0, c = 0, j = 0,
			txt = "", s = "", bol = true;

		if (zhflag === flagSimp) {
			// 繁轉簡
			zmap = t2s;
			leng = Math.min(maxTSLen, str.length);
		} else {
			// 簡轉繁
			zmap = s2t;
			leng = Math.min(maxSTLen, str.length);
		}

		// 單字轉換
		str = str.split("");
		for (i = 0, c = str.length; i < c; i += 1) {
			str[i] = zmap[str[i]] || str[i];
		}
		str = str.join("");

		// 詞彙轉換
		
		for (i = 0, c = str.length; i < c;) {
			bol = true;
			for (j = leng; j > 1; j -= 1) {
				s = str.substr(i, j);
				if (s in zmap) {
					txt += zmap[s];
					i += j;
					bol = false;
					break;
				}
			}

			if (bol) {
				txt += str.substr(i, 1);
				i += 1;
			}
		}
		if (txt !== "") {
			str = txt;
		}
		return str;
	}

	function parseTree(doc, zhflag) {
		function filter(node) {
			var result = 1,
				excludeTag = [
					"frame", "iframe", "embed", "object",
					"script", "noscript", "style", "title",
					"br", "hr", "link", "meta", "textarea"
				];
			if (
				(node.nodeType === 1) &&
				(excludeTag.indexOf(node.nodeName.toLowerCase()) >= 0)
			) {
				result = 2;
			}
			return result;
		}
	
		var treeWalker = doc.createTreeWalker(
			doc.body,
			1 | 4,
			{ acceptNode: filter },
			false
		);
		
		function walker() {
			var node = null, attr = null;

			if (treeWalker.nextNode()) {
				node = treeWalker.currentNode;

				// Node Types http://www.w3schools.com/dom/dom_nodetype.asp
				switch (node.nodeType) {
				case 1: // ELEMENT_NODE
					// opera.postError(node.nodeName + ": " + node.innerHTML);
					switch (node.nodeName.toLowerCase()) {
					case "img":
						attr = node.getAttribute("title");
						if (attr !== null) {
							node.setAttribute("title", convert(attr, zhflag));
						}
						attr = node.getAttribute("alt");
						if (attr !== null) {
							node.setAttribute("alt", convert(attr, zhflag));
						}
						break;
					case "input":
						switch (node.type.toLowerCase()) {
						case "button":
						case "submit":
						case "reset":
						// case "text": // keep org value
							if (node.value.length > 0) {
								node.value = convert(node.value, zhflag);
							}
							break;
						default:
						}
						break;
					case "option":
						if (node.text.length > 0) {
							node.text = convert(node.text, zhflag);
						}
						break;
					default:
						attr = node.getAttribute("title");
						if (attr !== null) {
							node.setAttribute("title", convert(attr, zhflag));
						}
						break;
					}
					break;
				case 3: // TEXT_NODE
					if (node.nodeValue.length > 0) {
						node.nodeValue = convert(node.nodeValue, zhflag);
					}
					break;
				}

				node = null;
				attr = null;

				walker();
			}
		}

		setTimeout(walker, 1);
	}

	function transPage(doc, zhflag) {
		curZhFlag = zhflag;
		try {
			doc.title = convert(doc.title, zhflag);
			parseTree(doc, zhflag);
			if (enableFontset) {
				setFont(doc, zhflag);
			}
		} catch (ex) {
		}
	}

	function trans2Trad(doc) {
		transPage(doc || document, flagTrad);
	}

	function trans2Simp(doc) {
		transPage(doc || document, flagSimp);
	}

	function transAuto(doc) {
		var curDoc = doc || document,
			zhflag = (curZhFlag === flagTrad) ? flagSimp : flagTrad;
		transPage(curDoc, zhflag);
	}

// =============================================================================
	
	function winLoad() {
		curZhFlag = getZhFlag(document);
	}

	function init() {
		var that = this;

		if (document) {
			if (document.addEventListener) {
				document.addEventListener("DOMContentLoaded", function () { winLoad(); }, false);
			} else if (window.attachEvent) {
				window.attachEvent("onload", winLoad);
			}
		}

		return {
			version       : version,
			addS2TTable   : addS2TTable,
			addT2STable   : addT2STable,
			convert       : convert,
			transPage     : transPage,
			trans2Trad    : trans2Trad,
			trans2Simp    : trans2Simp,
			transAuto     : transAuto,
			enableCustomFontset: enableCustomFontset,
			setTradFontset: setTradFontset,
			setSimpFontset: setSimpFontset,
			debug : function () { return curZhFlag; }
		};
	}

	return init();
})();
