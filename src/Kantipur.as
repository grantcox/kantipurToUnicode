package {
	import flash.xml.XMLDocument;
	import flash.xml.XMLNode;
	import flash.xml.XMLNodeType;

	public class Kantipur {
		
		public static function kantipurConfigToUnicode( kantipurConfig:String ):String
		{
			var langSections:Array = kantipurConfig.split( /(\*[en]\*)/ );
			var translatedSections:Array = [];
			var sectionIsNepali:Boolean = true;
			for ( var i:int = 0; i < langSections.length; i++ ) {
				var section:String = langSections[i];
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
			var unicode:String = translatedSections.join("");
			return unicode;
		}
		
		public static function kantipurToUnicode( preeti:String ):String
		{
			var replacements:Array = [
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
				{from: "/\\o", to: "ऱ्य" },
		
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
				{from:"jm", to: "क" },
				{from:"¤m", to: "झ" },
				{from:"S|m", to: "क्र"},
				{from:"N˜", to: "ल"},
				{from:"¡", to: "ज्ञ्"},
				{from:"¢", to: "द्घ"},
				{from:"1", to: "ज्ञ"},
				{from:"2", to: "द्द"},
				{from:"4", to: "द्ध"},
				{from:">", to: "श्र"},
				{from:"?", to: "रु" },
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
				{from:"¤", to: "झ्" },
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
					
			
			var unicode:String = htmlUnescape(preeti);
			
			for ( var i:int = 0; i < replacements.length; i++ ) {
				if ( replacements[i]["from"] is RegExp ) {
					unicode = unicode.replace(replacements[i]["from"], replacements[i]["to"] );
					
				} else {
					unicode = replaceAll( unicode, replacements[i]["from"], replacements[i]["to"] );
				}
			}
			
			return unicode;
		}
		
		public static function htmlUnescape(str:String):String
		{
			if ( str == "" ) {
				return "";
			}
			// the XML conversion throws an error if there are any < symbols
			str = replaceAll(str, "<", "&lt;");
			str = replaceAll(str, ">", "&gt;");
			return new XMLDocument(str).firstChild.nodeValue;
		}

		public static function htmlEscape(str:String):String
		{
			if ( str == "" ) {
				return "";
			}
			return XML( new XMLNode( XMLNodeType.TEXT_NODE, str ) ).toXMLString();
		}
		
		public static function replaceAll(str:String, find:String, replace:String):String
		{
			return str.split(find).join(replace);
		}
		
	}

}