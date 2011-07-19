import codecs
import re
import os
import sys
import re, htmlentitydefs

##
# Removes HTML or XML character references and entities from a text string.
#
# @param text The HTML (or XML) source text.
# @return The plain text, as a Unicode string, if necessary.

def unescape(text):
    def fixup(m):
        text = m.group(0)
        if text[:2] == "&#":
            # character reference
            try:
                if text[:3] == "&#x":
                    return unichr(int(text[3:-1], 16))
                else:
                    return unichr(int(text[2:-1]))
            except ValueError:
                pass
        else:
            # named entity
            try:
                text = unichr(htmlentitydefs.name2codepoint[text[1:-1]])
            except KeyError:
                pass
        return text # leave as is
    return re.sub("&#?\w+;", fixup, text)


def kantipurToUnicode( kantipur='' ):
    replacements = [
        {'from': u"ç", 'to': u"ॐ"},
        {'from': u"˜", 'to': u"ऽ"},
        {'from': u"›", 'to': u"ऽ"},
        {'from': u".", 'to': u"।"},
        
        {'from': u"'m", 'to': u"m'"},
        {'from': u"]m", 'to': u"m]"},
        {'from': u"Fmf", 'to': u"mfF"},
        {'from': u"Fm", 'to': u"mF" },
        {'from': u"Kfm", 'to': u"km" },
        {'from': u"F'", 'to': u"'F"},
        
        # a particularly unique case
        {'from': u"/\\o", 'to': u"ऱ्य"},
        
        {'fromreg': ur'\|{2,}', 'to': u"|"},
        {'fromreg': ur'\]{2,}', 'to': u"]"},
        {'fromreg': ur'\[{2,}', 'to': u"["},
        {'fromreg': ur'\{{2,}', 'to': u"{"},
        {'fromreg': ur'\}{2,}', 'to': u"}"},
        {'fromreg': ur'\}{2,}', 'to': u"}"},
        #{'fromreg': ur'[F“]{2,}', 'to': u"F"},
        {'fromreg': ur'([ejkpq])([\|\[\]\{\}\'"\\])m', 'to': ur'\1m\2'},
        
        {'from': u"]|", 'to': u"|]"},
        {'from': u"\\]", 'to': u"]\\"},
        {'from': u"´", 'to': u"झ"},
        
        {'from': u")", 'to': u"०"},
        {'from': u"!", 'to': u"१"},
        {'from': u"@", 'to': u"२"},
        {'from': u"#", 'to': u"३"},
        {'from': u"$", 'to': u"४"},
        {'from': u"%", 'to': u"५"},
        {'from': u"^", 'to': u"६"},
        {'from': u"&", 'to': u"७"},
        {'from': u"*", 'to': u"८"},
        {'from': u"(", 'to': u"९"},
        {'from': u"em", 'to': u"झ"},
        {'from': u"km", 'to': u"फ"},
        {'from': u"Qm", 'to': u"क्त"},
        {'from': u"qm", 'to': u"क्र"},
        {'from': u"jm", 'to': u"क"},
        {'from': u"¤m", 'to': u"झ"},
        {'from': u"S|m", 'to': u"क्र"},
        {'from': u"N˜", 'to': u"ल"},
        {'from': u"¡", 'to': u"ज्ञ्"},
        {'from': u"¢", 'to': u"द्घ"},
        {'from': u"1", 'to': u"ज्ञ"},
        {'from': u"2", 'to': u"द्द"},
        {'from': u"4", 'to': u"द्ध"},
        {'from': u">", 'to': u"श्र"},
        {'from': u"?", 'to': u"रु"},
        {'from': u"/m", 'to': u"रु"},
        {'from': u"B", 'to': u"द्य"},
        {'from': u"I", 'to': u"क्ष्"},
        {'from': u"Q", 'to': u"त्त"},
        {'from': u"ß", 'to': u"द्म"},
        {'from': u"q", 'to': u"त्र"},
        {'from': u"„", 'to': u"ध्र"},
        {'from': u"‹", 'to': u"ङ्घ"},
        {'from': u"•", 'to': u"ड्ड"},
        {'from': u"›", 'to': u"द्र"},
        {'from': u"§", 'to': u"ट्ट"},
        {'from': u"°", 'to': u"ड्ढ"},
        {'from': u"¶", 'to': u"ठ्ठ"},
        {'from': u"¿", 'to': u"रू"},
        {'from': u"Å", 'to': u"हृ"},
        {'from': u"Ë", 'to': u"ङ्ग"},
        {'from': u"Ì", 'to': u"न्न"},
        {'from': u"Í", 'to': u"ङ्क"},
        {'from': u"Î", 'to': u"फ्"},
        {'from': u"Ý", 'to': u"ट्ठ"},
        {'from': u"å", 'to': u"द्व"},
        {'from': u"6«", 'to': u"ट्र"},
        {'from': u"7«", 'to': u"ठ्र"},
        {'from': u"8«", 'to': u"ड्र"},
        {'from': u"9«", 'to': u"ढ्र"},
        {'from': u"«", 'to': u"्र"},
        {'from': u"Ø", 'to': u"य"},
        {'from': u"|", 'to': u"्र"},
        {'from': u"8Þ", 'to': u"ड़"},
        {'from': u"9Þ", 'to': u"ढ़"},
        {'from': u"S", 'to': u"क्"},
        {'from': u"s", 'to': u"क"},
        {'from': u"V", 'to': u"ख्"},
        {'from': u"v", 'to': u"ख"},
        {'from': u"U", 'to': u"ग्"},
        {'from': u"u", 'to': u"ग"},
        {'from': u"£", 'to': u"घ्"},
        {'from': u"3", 'to': u"घ"},
        {'from': u"ª", 'to': u"ङ"},
        {'from': u"R", 'to': u"च्"},
        {'from': u"r", 'to': u"च"},
        {'from': u"5", 'to': u"छ"},
        {'from': u"H", 'to': u"ज्"},
        {'from': u"h", 'to': u"ज"},
        {'from': u"‰", 'to': u"झ्"},
        {'from': u"´", 'to': u"झ"},
        {'from': u"~", 'to': u"ञ्"},
        {'from': u"`", 'to': u"ञ"},
        {'from': u"6", 'to': u"ट"},
        {'from': u"7", 'to': u"ठ"},
        {'from': u"8", 'to': u"ड"},
        {'from': u"9", 'to': u"ढ"},
        {'from': u"0", 'to': u"ण्"},
        {'from': u"T", 'to': u"त्"},
        {'from': u"t", 'to': u"त"},
        {'from': u"Y", 'to': u"थ्"},
        {'from': u"y", 'to': u"थ"},
        {'from': u"b", 'to': u"द"},
        {'from': u"W", 'to': u"ध्"},
        {'from': u"w", 'to': u"ध"},
        {'from': u"G", 'to': u"न्"},
        {'from': u"g", 'to': u"न"},
        {'from': u"K", 'to': u"प्"},
        {'from': u"k", 'to': u"प"},
        {'from': u"ˆ", 'to': u"फ्"},
        {'from': u"A", 'to': u"ब्"},
        {'from': u"a", 'to': u"ब"},
        {'from': u"E", 'to': u"भ्"},
        {'from': u"e", 'to': u"भ"},
        {'from': u"D", 'to': u"म्"},
        {'from': u"d", 'to': u"म"},
        {'from': u"o", 'to': u"य"},
        {'from': u"/", 'to': u"र"},
        {'from': u"µ", 'to': u"र"},
        {'from': u"¥", 'to': u'र्‍'},
        {'from': u"N", 'to': u"ल्"},
        {'from': u"n", 'to': u"ल"},
        {'from': u"J", 'to': u"व्"},
        {'from': u"j", 'to': u"व"},
        {'from': u"Z", 'to': u"श्"},
        {'from': u"z", 'to': u"श"},
        {'from': u"i", 'to': u"ष्"},
        {'from': u":", 'to': u"स्"},
        {'from': u";", 'to': u"स"},
        {'from': u"X", 'to': u"ह्"},
        {'from': u"x", 'to': u"ह"},
        {'from': u"cf‘", 'to': u"ऑ"},
        {'from': u"c‘f", 'to': u"ऑ"},
        {'from': u"cf}", 'to': u"औ"},
        {'from': u"cf]", 'to': u"ओ"},
        {'from': u"cf", 'to': u"आ"},
        {'from': u"c", 'to': u"अ"},
        {'from': u"O{", 'to': u"ई"},
        {'from': u"O", 'to': u"इ"},
        {'from': u"pm", 'to': u"ऊ"},
        {'from': u"p", 'to': u"उ"},
        {'from': u"C", 'to': u"ऋ"},
        {'from': u"P]", 'to': u"ऐ"},
        {'from': u"P", 'to': u"ए"},
        {'from': u"f‘", 'to': u"ॉ"},
        {'from': u"\"", 'to': u"ू"},
        {'from': u"'", 'to': u"ु"},
        {'from': u"+", 'to': u"ं"},
        {'from': u"f", 'to': u"ा"},
        {'from': u"[", 'to': u"ृ"},
        {'from': u"\\", 'to': u"्"},
        {'from': u"]", 'to': u"े"},
        {'from': u"}", 'to': u"ै"},
        {'from': u"F", 'to': u"ा"},
        #{'from': u"F", 'to': u"ँ"},
        {'from': u"“", 'to': u"ँ" },
        {'from': u"L", 'to': u"ी"},
        #{'from': u"M", 'to': u"ः"},
        {'from': u"M", 'to': u":" },
        {'from': u"¨", 'to': u"ङ्ग"},
        {'from': u"®", 'to': u"र"},
        {'from': u"©", 'to': u"र"},
        {'from': u"Â", 'to': u"र"},
        {'from': u"È", 'to': u"ष"},
        {'from': u"Ô", 'to': u"क्ष"},
        {'from': u"ø", 'to': u"य्"},
        {'from': u"ı", 'to': u"द्र"},
        {'from': u"Œ", 'to': u"त्त्"},
        {'from': u"œ", 'to': u"त्र्"},
        {'from': u"˘", 'to': u"श्र्"},
        {'from': u"˚", 'to': u"फ"},
        {'from': u"≈", 'to': u"ह्"},
        {'from': u"⋲", 'to': u"ह्"},
        {'from': u"◊", 'to': u"ङ्ख"},
        {'from': u"", 'to': u"फ्"},
        {'from': u"", 'to': u"ट्ठ"},
        {'from': u"¤", 'to': u"झ्"},
        {'from': u"™", 'to': u"र"},

        # Remove typing mistakes in the original file
        {'from': u"्ा", 'to': u""},
        {'from': u"्ो", 'to': u"े"},
        {'from': u"्ौ", 'to': u"ै"},
        {'from': u"अो", 'to': u"ओ"},
        {'from': u"अा", 'to': u"आ"},
        {'from': u"आै", 'to': u"औ"},
        {'from': u"आे", 'to': u"ओ"},
        {'from': u"ाो", 'to': u"ो"},
        {'from': u"ाॅ", 'to': u"ॉ"},
        {'from': u"ाे", 'to': u"ो"},
        {'from': u"ंु", 'to': u"ुं"},
        {'from': u"ेे", 'to': u"े"},
        {'from': u"अै", 'to': u"अ‍ै"},
        {'from': u"ाे", 'to': u"ो"},
        {'from': u"अे", 'to': u"अ‍े"},
        {'from': u"ंा", 'to': u"ां"},
        {'from': u"अॅ", 'to': u"अ‍ॅ"},
        {'from': u"ाै", 'to': u"ौ"},
        {'from': u"ैा", 'to': u"ौ"},
        {'from': u"ंृ", 'to': u"ृं"},
        {'from': u"ँा", 'to': u"ाँ"},
        {'from': u"ँू", 'to': u"ूँ"},
        {'from': u"ेा", 'to': u"ो"},
        {'from': u"ंे", 'to': u"ें"},
        {'from': u"े्", 'to': u"्े" },
        
        # more complex replacements
        {'fromreg': ur'l((.्)?.)', 'to': ur"\1ि"},
        {'fromreg': ur'ि्(.)', 'to': ur"्\1ि"},
        {'fromreg': ur'िं्(.)', 'to': ur"्\1िं"},
        {'fromreg': ur'(.[ािीुूृेैोौं:ँॅ]*){', 'to': ur"र्\1"},
        
        {'from': u"{", 'to': u"र्"},
        {'from': u"l", 'to': u"ि"},
        
        # punctuation marks
        {'from': u"=", 'to': u"."},
        {'from': u"_", 'to': u")"},
        {'from': u"Ö", 'to': u"="},
        {'from': u"Ù", 'to': u";"},
        {'from': u"…", 'to': u"‘"},
        {'from': u"Ú", 'to': u"’"},
        {'from': u"Û", 'to': u"!"},
        {'from': u"Ü", 'to': u"%"},
        {'from': u"æ", 'to': u"“"},
        {'from': u"Æ", 'to': u"”"},
        {'from': u"±", 'to': u"+"},
        {'from': u"-", 'to': u"("},
        {'from': u"<", 'to': u"?"},
        {'from': u"¬", 'to': u"…"},
        {'from': u"Ò", 'to': u"…"},
        {'from': u"÷", 'to': u"/"},
        {'from': u"‐", 'to': u"("},
        {'from': u"⁄", 'to': u"!"},
        {'from': u"∞", 'to': u"%"},
        {'from': u"≠", 'to': u"="},
        {'from': u"≤", 'to': u";"},
        {'from': u"≥", 'to': u"."},
        
        {'from': u"ý", 'to': u""},
        {'from': u" ", 'to': u""}
        
    ]
    
    # convert HTML entitites like &quot;
    unicode_string = unescape(kantipur)

    #f = codecs.open('kantipur.log', 'w', 'utf-8-sig')
    #f.write(unicode_string + "\n")
    for repl in replacements:
        if 'from' in repl:
            unicode_string = unicode_string.replace(repl['from'], repl['to'])
        else:
            unicode_string = re.sub(repl['fromreg'], repl['to'], unicode_string)
    
        #f.write(unicode_string + "\n")
    #f.close()
    return unicode_string;