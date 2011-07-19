// if we are executing as a Notepad++ NppScripting plugin
if ( typeof(Editor) != "undefined" ){
	var kantipur = Editor.addMenu("Kantipur");
	var kantipurMenu = {
		text: "Kantipur - Unicode\t(Ctrl+Shift+C)",
		cmd: convertKantipur,
		ctrl:true,
		shift:true,
		alt:false,
		key:"c"
	};
	Editor.addSystemHotKey(kantipurMenu);
	kantipurMenu["menuItem"] = kantipur.addItem(kantipurMenu);

	function convertKantipur(){
		if (Editor.currentView.selection.length > 0){
			Editor.currentView.selection = kantipurConfigToUnicode( Editor.currentView.selection );
		}
	}
}

function kantipurConfigToUnicode( kantipurConfig )
{
	var langSections = [];
	var found = kantipurConfig.search( /(\*[en]\*)/ );
	while( found >= 0 ){
		langSections.push( kantipurConfig.substring(0, found) );
		langSections.push( kantipurConfig.substring(found, found + 3) );
		
		kantipurConfig = kantipurConfig.substring( found + 3 );
		found = kantipurConfig.search( /(\*[en]\*)/ );
	}
	langSections.push( kantipurConfig );

	var translatedSections = [];
	var sectionIsNepali = true;
	for ( var i = 0; i < langSections.length; i++ ) {
		var section = langSections[i];
		if ( section == "*n*" ) {
			sectionIsNepali = true;
			continue;
		}
		if ( section == "*e*" ) {
			sectionIsNepali = false;
			continue;
		}
		// this must be a text section
		if ( sectionIsNepali ) {
			section = kantipurToUnicode(section);
		}
		translatedSections.push( section );
	}
	var unicode = translatedSections.join("");
	return unicode;
}

function kantipurToUnicode( kantipur )
{
	var replacements = [
		{from:"ç", to: "ॐ"},
		{from:"˜", to: "ऽ"},
		{from:"›", to: "ऽ"},
		{from:".", to: "।"},
		
		{from:"'m", to: "m'"},
		{from:"]m", to: "m]"},
		{from:"Fmf", to: "mfF"},
		{from:"Fm", to: "mF" },
		{from: "Kfm", to: "km" },
		{from: "F'", to: "'F"},
		
		// a particularly unique case
		{from: "/\\o", to: "ऱ्य"},
		
		{from: /\|{2,}/g, to: "|"},
		{from: /\]{2,}/g, to: "]"},
		{from: /\[{2,}/g, to: "["},
		{from: /\{{2,}/g, to: "{"},
		{from: /\}{2,}/g, to: "}"},
		{from: /\}{2,}/g, to: "}"},
		//{from: /[F“]{2,}/g, to: "F"},
		{from: /([ejkpq])([\|\[\]\{\}'"\\])m/g, to: "$1m$2"},
		
		{from: "]|", to: "|]"},
		{from: "\\]", to: "]\\"},
		{from:"´", to: "झ"},
		
		{from:")", to: "०"},
		{from:"!", to: "१"},
		{from:"@", to: "२"},
		{from:"#", to: "३"},
		{from:"$", to: "४"},
		{from:"%", to: "५"},
		{from:"^", to: "६"},
		{from:"&", to: "७"},
		{from:"*", to: "८"},
		{from:"(", to: "९"},
		{from:"em", to: "झ"},
		{from:"km", to: "फ"},
		{from:"Qm", to: "क्त"},
		{from:"qm", to: "क्र"},
		{from:"jm", to: "क"},
		{from:"¤m", to: "झ"},
		{from:"S|m", to: "क्र"},
		{from:"N˜", to: "ल"},
		{from:"¡", to: "ज्ञ्"},
		{from:"¢", to: "द्घ"},
		{from:"1", to: "ज्ञ"},
		{from:"2", to: "द्द"},
		{from:"4", to: "द्ध"},
		{from:">", to: "श्र"},
		{from:"?", to: "रु"},
		{from:"/m", to: "रु"},
		{from:"B", to: "द्य"},
		{from:"I", to: "क्ष्"},
		{from:"Q", to: "त्त"},
		{from:"ß", to: "द्म"},
		{from:"q", to: "त्र"},
		{from:"„", to: "ध्र"},
		{from:"‹", to: "ङ्घ"},
		{from:"•", to: "ड्ड"},
		{from:"›", to: "द्र"},
		{from:"§", to: "ट्ट"},
		{from:"°", to: "ड्ढ"},
		{from:"¶", to: "ठ्ठ"},
		{from:"¿", to: "रू"},
		{from:"Å", to: "हृ"},
		{from:"Ë", to: "ङ्ग"},
		{from:"Ì", to: "न्न"},
		{from:"Í", to: "ङ्क"},
		{from:"Î", to: "फ्"},
		{from:"Ý", to: "ट्ठ"},
		{from:"å", to: "द्व"},
		{from:"6«", to: "ट्र"},
		{from:"7«", to: "ठ्र"},
		{from:"8«", to: "ड्र"},
		{from:"9«", to: "ढ्र"},
		{from:"«", to: "्र"},
		{from:"Ø", to: "य"},
		{from:"|", to: "्र"},
		{from:"8Þ", to: "ड़"},
		{from:"9Þ", to: "ढ़"},
		{from:"S", to: "क्"},
		{from:"s", to: "क"},
		{from:"V", to: "ख्"},
		{from:"v", to: "ख"},
		{from:"U", to: "ग्"},
		{from:"u", to: "ग"},
		{from:"£", to: "घ्"},
		{from:"3", to: "घ"},
		{from:"ª", to: "ङ"},
		{from:"R", to: "च्"},
		{from:"r", to: "च"},
		{from:"5", to: "छ"},
		{from:"H", to: "ज्"},
		{from:"h", to: "ज"},
		{from:"‰", to: "झ्"},
		{from:"´", to: "झ"},
		{from:"~", to: "ञ्"},
		{from:"`", to: "ञ"},
		{from:"6", to: "ट"},
		{from:"7", to: "ठ"},
		{from:"8", to: "ड"},
		{from:"9", to: "ढ"},
		{from:"0", to: "ण्"},
		{from:"T", to: "त्"},
		{from:"t", to: "त"},
		{from:"Y", to: "थ्"},
		{from:"y", to: "थ"},
		{from:"b", to: "द"},
		{from:"W", to: "ध्"},
		{from:"w", to: "ध"},
		{from:"G", to: "न्"},
		{from:"g", to: "न"},
		{from:"K", to: "प्"},
		{from:"k", to: "प"},
		{from:"ˆ", to: "फ्"},
		{from:"A", to: "ब्"},
		{from:"a", to: "ब"},
		{from:"E", to: "भ्"},
		{from:"e", to: "भ"},
		{from:"D", to: "म्"},
		{from:"d", to: "म"},
		{from:"o", to: "य"},
		{from:"/", to: "र"},
		{from:"µ", to: "र"},
		{from:"¥", to: 'र्‍'},
		{from:"N", to: "ल्"},
		{from:"n", to: "ल"},
		{from:"J", to: "व्"},
		{from:"j", to: "व"},
		{from:"Z", to: "श्"},
		{from:"z", to: "श"},
		{from:"i", to: "ष्"},
		{from:":", to: "स्"},
		{from:";", to: "स"},
		{from:"X", to: "ह्"},
		{from:"x", to: "ह"},
		{from:"cf‘", to: "ऑ"},
		{from:"c‘f", to: "ऑ"},
		{from:"cf}", to: "औ"},
		{from:"cf]", to: "ओ"},
		{from:"cf", to: "आ"},
		{from:"c", to: "अ"},
		{from:"O{", to: "ई"},
		{from:"O", to: "इ"},
		{from:"pm", to: "ऊ"},
		{from:"p", to: "उ"},
		{from:"C", to: "ऋ"},
		{from:"P]", to: "ऐ"},
		{from:"P", to: "ए"},
		{from:"f‘", to: "ॉ"},
		{from:"\"", to: "ू"},
		{from:"'", to: "ु"},
		{from:"+", to: "ं"},
		{from:"f", to: "ा"},
		{from:"[", to: "ृ"},
		{from:"\\", to: "्"},
		{from:"]", to: "े"},
		{from:"}", to: "ै"},
		{from:"F", to: "ा"},
		//{from:"F", to: "ँ"},
		{from: "“", to: "ँ" },
		{from:"L", to: "ी"},
		//{from:"M", to: "ः"},
		{from:"M", to: ":" },
		{from: "¨", to: "ङ्ग"},
		{from:"®", to: "र"},
		{from:"©", to: "र"},
		{from:"Â", to: "र"},
		{from:"È", to: "ष"},
		{from:"Ô", to: "क्ष"},
		{from:"ø", to: "य्"},
		{from:"ı", to: "द्र"},
		{from:"Œ", to: "त्त्"},
		{from:"œ", to: "त्र्"},
		{from:"˘", to: "श्र्"},
		{from:"˚", to: "फ"},
		{from:"≈", to: "ह्"},
		{from:"⋲", to: "ह्"},
		{from:"◊", to: "ङ्ख"},
		{from:"", to: "फ्"},
		{from:"", to: "ट्ठ"},
		{from:"¤", to: "झ्"},
		{from:"™", to: "र"},
		
		// Remove typing mistakes in the original file
		{from:"्ा", to: ""},
		{from:"्ो", to: "े"},
		{from:"्ौ", to: "ै"},
		{from:"अो", to: "ओ"},
		{from:"अा", to: "आ"},
		{from:"आै", to: "औ"},
		{from:"आे", to: "ओ"},
		{from:"ाो", to: "ो"},
		{from:"ाॅ", to: "ॉ"},
		{from:"ाे", to: "ो"},
		{from:"ंु", to: "ुं"},
		{from:"ेे", to: "े"},
		{from:"अै", to: "अ‍ै"},
		{from:"ाे", to: "ो"},
		{from:"अे", to: "अ‍े"},
		{from:"ंा", to: "ां"},
		{from:"अॅ", to: "अ‍ॅ"},
		{from:"ाै", to: "ौ"},
		{from:"ैा", to: "ौ"},
		{from:"ंृ", to: "ृं"},
		{from:"ँा", to: "ाँ"},
		{from:"ँू", to: "ूँ"},
		{from:"ेा", to: "ो"},
		{from:"ंे", to: "ें"},
		{from:"े्", to: "्े" },
		
		// more complex replacements
		{from: /l((.्)?.)/g, to: "$1ि"},
		{from: /ि्(.)/g, to: "्$1ि"},
		{from: /िं्(.)/g, to: "्$1िं"},
		{from: /(.[ािीुूृेैोौं:ँॅ]*){/g, to: "र्$1"},
		
		{from: "{", to: "र्"},
		{from:"l", to: "ि"},
		
		// punctuation marks
		{from: "=", to: "."},
		{from: "_", to: ")"},
		{from: "Ö", to: "="},
		{from: "Ù", to: ";"},
		{from: "…", to: "‘"},
		{from: "Ú", to: "’"},
		{from: "Û", to: "!"},
		{from: "Ü", to: "%"},
		{from: "æ", to: "“"},
		{from: "Æ", to: "”"},
		{from: "±", to: "+"},
		{from: "-", to: "("},
		{from: "<", to: "?"},
		{from: "¬", to: "…"},
		{from: "Ò", to: "…"},
		{from: "÷", to: "/"},
		{from: "‐", to: "("},
		{from: "⁄", to: "!"},
		{from: "∞", to: "%"},
		{from: "≠", to: "="},
		{from: "≤", to: ";"},
		{from: "≥", to: "."},
		
		{from: "ý", to: ""}
		
	];
	
	
	var unicode = Encoder.htmlDecode(kantipur);
	
	for ( var i = 0; i < replacements.length; i++ ) {
		if ( replacements[i]["from"] instanceof RegExp ) {
			unicode = unicode.replace(replacements[i]["from"], replacements[i]["to"] );
			
		} else {
			unicode = replaceAll( unicode, replacements[i]["from"], replacements[i]["to"] );
		}
		//console.log(i, unicode)
	}
	
	return unicode;
}

function replaceAll(str, find, replace) 
{
	return str.split(find).join(replace);
}


var Encoder = {

	// When encoding do we convert characters into html or numerical entities
	EncodeType : "entity",  // entity OR numerical

	isEmpty : function(val){
		if(val){
			return ((val===null) || val.length==0 || /^\s+$/.test(val));
		}else{
			return true;
		}
	},
	// Convert HTML entities into numerical entities
	HTML2Numerical : function(s){
		var arr1 = new Array('&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&agrave;','&aacute;','&acirc;','&atilde;','&Auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&Ouml;','&times;','&oslash;','&ugrave;','&uacute;','&ucirc;','&Uuml;','&yacute;','&thorn;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&Oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&oelig;','&oelig;','&scaron;','&scaron;','&yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;');
		var arr2 = new Array('&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;');
		return this.swapArrayVals(s,arr1,arr2);
	},	

	// Convert Numerical entities into HTML entities
	NumericalToHTML : function(s){
		var arr1 = new Array('&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;');
		var arr2 = new Array('&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&agrave;','&aacute;','&acirc;','&atilde;','&Auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&Ouml;','&times;','&oslash;','&ugrave;','&uacute;','&ucirc;','&Uuml;','&yacute;','&thorn;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&Oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&oelig;','&oelig;','&scaron;','&scaron;','&yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;');
		return this.swapArrayVals(s,arr1,arr2);
	},


	// Numerically encodes all unicode characters
	numEncode : function(s){
		
		if(this.isEmpty(s)) return "";

		var e = "";
		for (var i = 0; i < s.length; i++)
		{
			var c = s.charAt(i);
			if (c < " " || c > "~")
			{
				c = "&#" + c.charCodeAt() + ";";
			}
			e += c;
		}
		return e;
	},
	
	// HTML Decode numerical and HTML entities back to original values
	htmlDecode : function(s){

		var c,m,d = s;
		
		if(this.isEmpty(d)) return "";

		// convert HTML entites back to numerical entites first
		d = this.HTML2Numerical(d);
		
		// look for numerical entities &#34;
		arr=d.match(/&#[0-9]{1,5};/g);
		
		// if no matches found in string then skip
		if(arr!=null){
			for(var x=0;x<arr.length;x++){
				m = arr[x];
				c = m.substring(2,m.length-1); //get numeric part which is refernce to unicode character
				// if its a valid number we can decode
				if(c >= -32768 && c <= 65535){
					// decode every single match within string
					d = d.replace(m, String.fromCharCode(c));
				}else{
					d = d.replace(m, ""); //invalid so replace with nada
				}
			}			
		}

		return d;
	},		

	// encode an input string into either numerical or HTML entities
	htmlEncode : function(s,dbl){
			
		if(this.isEmpty(s)) return "";

		// do we allow double encoding? E.g will &amp; be turned into &amp;amp;
		dbl = dbl | false; //default to prevent double encoding
		
		// if allowing double encoding we do ampersands first
		if(dbl){
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}
		}

		// convert the xss chars to numerical entities ' " < >
		s = this.XSSEncode(s,false);
		
		if(this.EncodeType=="numerical" || !dbl){
			// Now call function that will convert any HTML entities to numerical codes
			s = this.HTML2Numerical(s);
		}

		// Now encode all chars above 127 e.g unicode
		s = this.numEncode(s);

		// now we know anything that needs to be encoded has been converted to numerical entities we
		// can encode any ampersands & that are not part of encoded entities
		// to handle the fact that I need to do a negative check and handle multiple ampersands &&&
		// I am going to use a placeholder

		// if we don't want double encoded entities we ignore the & in existing entities
		if(!dbl){
			s = s.replace(/&#/g,"##AMPHASH##");
		
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}

			s = s.replace(/##AMPHASH##/g,"&#");
		}
		
		// replace any malformed entities
		s = s.replace(/&#\d*([^\d;]|$)/g, "$1");

		if(!dbl){
			// safety check to correct any double encoded &amp;
			s = this.correctEncoding(s);
		}

		// now do we need to convert our numerical encoded string into entities
		if(this.EncodeType=="entity"){
			s = this.NumericalToHTML(s);
		}

		return s;					
	},

	// Encodes the basic 4 characters used to malform HTML in XSS hacks
	XSSEncode : function(s,en){
		if(!this.isEmpty(s)){
			en = en || true;
			// do we convert to numerical or html entity?
			if(en){
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&quot;");
				s = s.replace(/</g,"&lt;");
				s = s.replace(/>/g,"&gt;");
			}else{
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&#34;");
				s = s.replace(/</g,"&#60;");
				s = s.replace(/>/g,"&#62;");
			}
			return s;
		}else{
			return "";
		}
	},

	// returns true if a string contains html or numerical encoded entities
	hasEncoded : function(s){
		if(/&#[0-9]{1,5};/g.test(s)){
			return true;
		}else if(/&[A-Z]{2,6};/gi.test(s)){
			return true;
		}else{
			return false;
		}
	},

	// will remove any unicode characters
	stripUnicode : function(s){
		return s.replace(/[^\x20-\x7E]/g,"");
		
	},

	// corrects any double encoded &amp; entities e.g &amp;amp;
	correctEncoding : function(s){
		return s.replace(/(&amp;)(amp;)+/,"$1");
	},


	// Function to loop through an array swaping each item with the value from another array e.g swap HTML entities with Numericals
	swapArrayVals : function(s,arr1,arr2){
		if(this.isEmpty(s)) return "";
		var re;
		if(arr1 && arr2){
			//ShowDebug("in swapArrayVals arr1.length = " + arr1.length + " arr2.length = " + arr2.length)
			// array lengths must match
			if(arr1.length == arr2.length){
				for(var x=0,i=arr1.length;x<i;x++){
					re = new RegExp(arr1[x], 'g');
					s = s.replace(re,arr2[x]); //swap arr1 item with matching item from arr2	
				}
			}
		}
		return s;
	},

	inArray : function( item, arr ) {
		for ( var i = 0, x = arr.length; i < x; i++ ){
			if ( arr[i] === item ){
				return i;
			}
		}
		return -1;
	}

}
