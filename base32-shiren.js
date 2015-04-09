// base32-shiren.js
// ported from C 
'use strict';

// convert Uint8Array to string
function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint8Array(buf));
}
// convert string to Uint8Array
function str2ab(str) {
	var buf = new ArrayBuffer(str.length); // 1 bytes for each char
	var bufView = new Uint8Array(buf);
	for (var i=0, strLen=str.length; i<strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return bufView;
}
/*
function format(str, add_nl){
	var z = [5,4,5,5,4,5,5,4,5,5,4,5];
	var j = 0;
	var out = new String();
	str = str.replace(/\s+/g, '');
	for ( var i = 0; i < 15; i++){
	    var x = str.slice(j,j+z[i]);
	    j = j + z[i];
	    
	    out = out + x + " ";

	    if( add_nl ) {
	    	if( ((i+1)%3) === 0) 
	    		out += '\n';
    	}
	}
    return out.trim();
}
*/
var Base32_shiren = function(){

	/* Shiren DS encoding */
	var base32_alphabet = [
	'0', '1', '2', '3', '4', '5', '6', '7',
	'8', '9', 'B', 'C', 'D', 'F', 'G', 'H',
	'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R',
	'S', 'T', 'V', 'W', 'X', 'Y', 'Z', '!'
	];

    // encodes binary data to base32 encoded ASCII
	Base32_shiren.prototype.encode = function(data){
        
		var dst = "";
		var i = 0;
		var len = data.length;

		do {
			var j, k;
			var x = new Uint8Array(5);
			var s = new Array(8);

			switch (len - i) {
				case 4:
				k = 7;
				break;
				case 3:
				k = 5;
				break;
				case 2:
				k = 3;
				break;
				case 1:
				k = 2;
				break;
				default:
				k = 8;
			}

			for (j = 0; j < 5; j++){
	 			//x[j] = i < len ? p[i++] : 0;
				// x[j] = i < len ? data[i++] : 0;
				if(i < len){
					//x[j] = data.charCodeAt(i);
					x[j] = data[i];
					i++;
				}else{	
					x[j] = 0;
				}
			}
			/*
			  +-------+-----------+--------+
			  | target| source	  | source |
			  | byte  | bits	  | byte   |
			  +-------+-----------+--------+
			  |		0 | 7 6 5 4 3 | 0	   |
			  |		1 | 2 1 0 7 6 | 0-1	   |
			  |		2 | 5 4 3 2 1 | 1	   |
			  |		3 | 0 7 6 5 4 | 1-2	   |
			  |		4 | 3 2 1 0 7 | 2-3	   |
			  |		5 | 6 5 4 3 2 | 3	   |
			  |		6 | 1 0 7 6 5 | 3-4	   |
			  |		7 | 4 3 2 1 0 | 4	   |
			  +-------+-----------+--------+
			  */
	/****** Shiren changes the order around
			s[0] = (x[0] >> 3);
			s[1] = ((x[0] & 0x07) << 2) | (x[1] >> 6);
			s[2] = (x[1] >> 1) & 0x1f;
			s[3] = ((x[1] & 0x01) << 4) | (x[2] >> 4);
			s[4] = ((x[2] & 0x0f) << 1) | (x[3] >> 7);
			s[5] = (x[3] >> 2) & 0x1f;
			s[6] = ((x[3] & 0x03) << 3) | (x[4] >> 5);
			s[7] = x[4] & 0x1f;
			********/
			s[0] = (x[0] & 0x1F);
			s[1] = ((x[0] & 0xE0) >> 5) | ((x[1] & 0x03) << 3);
			s[2] = (x[1] & 0x7C) >> 2;
			s[3] = ((x[1] & 0x80) >> 7) | ((x[2] & 0x0F) << 1);
			s[4] = ((x[2] & 0xF0) >> 4) | ((x[3] & 0x01) << 4);
			s[5] = ((x[3] & 0x3E) >> 1);
			s[6] = ((x[3] & 0xC0) >> 6) | ((x[4] & 0x07) << 2);
			s[7] = (x[4] & 0xF8) >> 3;

			for (j = 0; j < k; j++) {					
				dst += base32_alphabet[s[j]];
			}
		} while ( i < len );

		return dst;
	};


	var base32_map = [];

    // decode base32 encoded ASCII to binary
	Base32_shiren.prototype.decode = function(data){
		var dst_buf = new ArrayBuffer(35);
		var dst = new Uint8Array(dst_buf);
		var p = str2ab(data);
		var q = 0;
		var i, si;
		var pad = 0;

		var len = p.length;
		var end = dst.length;

		if (base32_map[0] === undefined) {
			for (i = 0; i < 255; i++) {
				var idx;
				// search for UCase(i) in base32_alphabet
				idx = base32_alphabet.indexOf(String.fromCharCode(i).toUpperCase());
				if( idx !== undefined ){
					base32_map[i] = idx;
				}else{
					base32_map[i] = -1;
				}
			}
		}

		var s_buf = new ArrayBuffer(8);
		var s = new Uint8Array(s_buf);		
		si = 0;
		i = 0;

		while (i < len) {
			var c;
			c = p[i];
			i++;
			if (c === 61) { // c == '='
				pad++;
			c = 0;
		} else {
			var cx = base32_map[c];
			if (cx === -1) {
					//console.error("not mapped" + c);
					//return -1; // wrong character
					continue;
				}else{
					c = cx;
				}
			}

			s[si] = c;
			si++;

			if (s.length === si || pad > 0 || i === len) {
				var b_buf = new ArrayBuffer(5);
				var b = new Uint8Array(b_buf);
				// fill remaining bits with 0
				for(var y=si; si < s.length; y++)
					s[si] = 0;
				si = 0;
	/***** Shiren reverses this, starts at the LSB first
				b[0] =
					((s[0] << 3) & 0xf8) |
					((s[1] >> 2) & 0x07);
				b[1] =
					((s[1] & 0x03) << 6) |
					((s[2] & 0x1f) << 1) |
					((s[3] >> 4) & 1);
				b[2] =
					((s[3] & 0x0f) << 4) |
					((s[4] >> 1) & 0x0f);
				b[3] =
					((s[4] & 1) << 7) |
					((s[5] & 0x1f) << 2) |
					((s[6] >> 3) & 0x03);
				b[4] =
					((s[6] & 0x07) << 5) |
					(s[7] & 0x1f);
					******/
					b[0] = 
					(s[0] & 0x1F) |
					((s[1] & 0x07) << 5);
					b[1] =
					((s[1] & 0x18) >> 3) |
					((s[2] & 0x1F) << 2) | 
					((s[3] & 0x01) << 7);
					b[2] =
					((s[3] & 0x1E) >> 1) |
					((s[4] & 0x0F) << 4);
					b[3] =
					((s[4] & 0x10) >> 4) |
					((s[5] & 0x1F) << 1) |
					((s[6] & 0x03) << 6);
					b[4] = 
					((s[6] & 0x1C) >> 2) |
					((s[7] & 0x1F) << 3);


					for (var bi = 0; bi < b.length && q !== end; bi++) {
						dst[q] = b[bi];
						q++;
					}
			} // if

			if( end === q ){
				break;
			}
		} // while

		return dst;
	};

};		

// nodejs/browserify
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Base32_shiren;
	//module.exports.format = format;
}