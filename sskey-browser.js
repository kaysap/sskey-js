// sskey-browser.js
'use strict';

// nodejs/browserify
if (typeof module !== 'undefined' && module.exports) {
	var Base32_shiren = require('./base32-shiren');
	var MersenneTwister = require('./mt19937ar');
}

/* Shiren's Skeleton Key
 * ---------------------
 * Password encoder/decoder/modifier/generator for Shiren The Wanderer (1) on 
 * Nintendo DS.
 *
 * -- nko, March 11 2010
 */


 var SSKey = function(){
 	var ASCII_LENGTH = 56;
 	var BINARY_LENGTH = 35;

 	var base32 = new Base32_shiren();
 	var mt = new MersenneTwister();

	// Table used to swap/unswap bytes of password
	var TABLE_215CD88 =  [
	0x06, 0x20, 0x15, 0x03, 0x0E, 0x1C, 0x00, 0x11, 
	0x07, 0x19, 0x0B, 0x13, 0x09, 0x1F, 0x01, 0x0C, 
	0x1D, 0x05, 0x0F, 0x14, 0x02, 0x21, 0x1B, 0x04, 
	0x18, 0x10, 0x16, 0x08, 0x12, 0x17, 0x0A, 0x1E, 
	0x1A, 0x0D, 0x00 
	];

	// levels.json - Kobami Valley
  	var levels = [
	    {
	      "level":0,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"unused",
	      "floor":"none"
	    },
	    {
	      "level":1,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Canyon Hamlet",
	      "floor":""
	    },
	    {
	      "level":2,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Old Cedar Road",
	      "floor":"1F"
	    },
	    {
	      "level":3,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Old Cedar Road",
	      "floor":"2F"
	    },
	    {
	      "level":4,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Mountain Stream",
	      "floor":"3F"
	    },
	    {
	      "level":5,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Mountain Stream",
	      "floor":"4F"
	    },
	    {
	      "level":6,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Bamboo Village",
	      "floor":""
	    },
	    {
	      "level":7,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Pegasus Ridge",
	      "floor":"5F"
	    },
	    {
	      "level":8,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Pegasus Ridge",
	      "floor":"6F"
	    },
	    {
	      "level":9,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Mountaintop Forest",
	      "floor":"7F"
	    },
	    {
	      "level":10,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Mountaintop Town",
	      "floor":""
	    },
	    {
	      "level":11,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Old Mine at Mt. Nebri",
	      "floor":"8F"
	    },
	    {
	      "level":12,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Old Mine at Mt. Nebri",
	      "floor":"9F"
	    },
	    {
	      "level":13,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Janus Valley",
	      "floor":""
	    },
	    {
	      "level":14,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Cavern in the Cliff",
	      "floor":"10F"
	    },
	    {
	      "level":15,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Cavern in the Cliff",
	      "floor":"11F"
	    },
	    {
	      "level":16,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Cave Mtn. Spirits",
	      "floor":"12F"
	    },
	    {
	      "level":17,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Cave Mtn. Spirits",
	      "floor":"13F"
	    },
	    {
	      "level":18,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Cave Mtn. Spirits",
	      "floor":"14F"
	    },
	    {
	      "level":19,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Cryptic Rock Valley",
	      "floor":""
	    },
	    {
	      "level":20,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Waterfall Marsh",
	      "floor":"15F"
	    },
	    {
	      "level":21,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Waterfall Marsh",
	      "floor":"16F"
	    },
	    {
	      "level":22,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Table Mountain (1)",
	      "floor":"17F"
	    },
	    {
	      "level":23,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Table Mountain (1)",
	      "floor":"18F"
	    },
	    {
	      "level":24,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Table Mountain (1)",
	      "floor":"19F"
	    },
	    {
	      "level":25,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Table Mountain (1)",
	      "floor":"20F"
	    },
	    {
	      "level":26,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Table Mountain (1)",
	      "floor":"21F"
	    },
	    {
	      "level":27,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Stream Village",
	      "floor":""
	    },
	    {
	      "level":28,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Table Mountain (2)",
	      "floor":"22F"
	    },
	    {
	      "level":29,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Table Mountain (2)",
	      "floor":"23F"
	    },
	    {
	      "level":30,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Table Mountain (2)",
	      "floor":"24F"
	    },
	    {
	      "level":31,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Table Mountain (2)",
	      "floor":"25F"
	    },
	    {
	      "level":32,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Ravine of Illusions",
	      "floor":"26F"
	    },
	    {
	      "level":33,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Phantom Trials",
	      "floor":"27F"
	    },
	    {
	      "level":34,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Dragoncry Trials",
	      "floor":"28F"
	    },
	    {
	      "level":35,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Final Trials",
	      "floor":"29F"
	    },
	    {
	      "level":36,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Plains of the Sun",
	      "floor":""
	    },
	    {
	      "level":37,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Golden City",
	      "floor":""
	    },
	    {
	      "level":38,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Rainbow's End",
	      "floor":""
	    },
	    {
	      "level":39,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"Waterfall Cavern",
	      "floor":"30F"
	    },
	    {
	      "level":40,
	      "dungeon":"Kobami Valley",
	      "lvl_name":"unused",
	      "floor":"none"
	    }
	];
	// format revival spell
	SSKey.prototype.format = function(str, add_nl){
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
	};

	// check for valid characters
	SSKey.prototype.isValid = function(req){
	  // check request for invalid chars
	  var validChars = /^[BCDFGHJKLMNPQRSTVWXYZ0-9!\s]+$/i.test(req);
	  return validChars;
	  //check request for correct structure
	  //var validStructure = /^\s*(.{5}\s+.{4}\s+.{5}[\s\r]*){4}\s*$/.test(req);
	  //return (validChars && validStructure);
	};


	// Calculate simple sum checksum
	SSKey.prototype.checksum = function(buf)
	{
		var sum = 0;
		//var s_buf = new ArrayBuffer(1);
		var res = new Uint8Array(1);


		for (var i = 0; i < BINARY_LENGTH-1; i++)
			sum += buf[i];
		sum -= buf[2];

		res[0] = (sum % 256);
		return res[0];  // result is an unsigned int
	};

	// Seed the RNG (Mersenne Twister)
	SSKey.prototype.seed_rng = function(buf)
	{
		var mtseed = 0;
		mtseed = (buf[2]<<8) + buf[1];
		mt.init_genrand(mtseed);
	};

	// Swap bytes around according to TABLE_215CD88 and
	// store in 'dst', unswap when dir!=0
	SSKey.prototype.swap = function(dst, src, dir)
	{
		var i;
		if (dir === 0) {
			for (i = 0; i < 34; i++)
				dst[i] = src[TABLE_215CD88[i]];
		}else{
			for (i = 0; i < 34; i++)
				dst[TABLE_215CD88[i]] = src[i];
		}
	};

	// 'Encrypt" a binary password
	SSKey.prototype.encrypt_rescue = function(src)
	{
		var tmp = 0;
		var buf = new Array(BINARY_LENGTH);
		buf = src;
		var dst = new Array(BINARY_LENGTH);
		
		// seed RNG
		this.seed_rng(buf);

		// encrypt
		for (var i = 3; i < 34; i++) {
			tmp = mt.genrand_int32() & 0xFF; // take LSB of a random number
			tmp += buf[i];                // add random byte to the byte to encode
			buf[i] = tmp;  // and store that back into array
		}

		// swap bytes around
		this.swap(dst, buf, 0);
		return dst;

	};

	// "Decrypt" a binary password
	SSKey.prototype.decrypt = function(dst, src)
	{
		var tmp = 0;

		// swap bytes around
		this.swap(dst, src, 1);

		// seed RNG
		this.seed_rng(dst);

		// decrypt
		for (var i = 3; i < 34; i++) {
			tmp = mt.genrand_int32() & 0xFF; // take LSB of a random number
			tmp = dst[i] - tmp;           // subtract random byte from byte to decode
			dst[i] = tmp;           // and store that back into array
		}

		var chk = this.checksum(dst);
		if (chk === dst[2]){
			return 0;
		} else {
			return 1;
		}
	};

	SSKey.prototype.strip_ascii = function(data) {
		var count = 0;
		var val = 0;
		var res = new String();

		while (count < data.length && res.length < ASCII_LENGTH) {
			val = data[count];
			count++;

			if (val === '\r' || val === '\n' || val === ' ' || val === '"')
				continue;
			else
				if(/^[BCDFGHJKLMNPQRSTVWXYZ0-9!\s]+$/.test(val)){
					res += val;
				}
				else {
					//console.error('Invalid character in password!');
					break;
				}
			}

			return res;
		};

		SSKey.prototype.revive = function(buf)
		{
		//var s_buf = new ArrayBuffer(BINARY_LENGTH);
		var spell = new Uint8Array(BINARY_LENGTH);
		var i;

		// Password type (revival spell)
		spell[0] = 0x42;
		// Rescuee ID, +2 bytes after
		for (i = 3; i < 9; i++) 
			spell[i] = buf[i];	
		// ??
		for (i = 10; i < 14; i++) 
			spell[i-1] = buf[i];
		// Rescuer game ID
		spell[13] = 0x00; spell[14] = 0x09; spell[15] = 0xbf; spell[16] = 0xa5;
		// Rescuer name
		spell[24] = 0x5b; spell[25] = 0x4e; spell[26] = 0x05; spell[27] = 0x05;
		spell[28] = 0x0b; spell[29] = 0x5c;

		spell[2] = this.checksum(spell);

		return spell;
	};

	// this is called from the browser
	SSKey.prototype.revive_from_rescue = function(rescue){

		//var binbuf_b = new ArrayBuffer(BINARY_LENGTH);
		var binbuf = new Uint8Array(BINARY_LENGTH);
		//var e_binbuf_b = new ArrayBuffer(BINARY_LENGTH);
		var e_binbuf = new Uint8Array(BINARY_LENGTH);
		var asciibuf = new String();
		var outbuf = new Array(ASCII_LENGTH);  
		var result = new String();

		// validate input
		if( !this.isValid(rescue) )
			return 'Password contains invalid characters!';
		
		//remove white space and new lines
		asciibuf = this.strip_ascii(rescue);

		if(asciibuf.length === ASCII_LENGTH){
			// convert to binary
			e_binbuf = base32.decode(asciibuf);
			// decrypt
			if(this.decrypt(binbuf, e_binbuf) !== 0){
				return 'Verification error!';
			}

			if(binbuf[0] == 0x21){
				// create revival spell
				binbuf = this.revive(binbuf);
				// encrypt revival
				e_binbuf = this.encrypt_rescue(binbuf);
				// encode to ASCII
				outbuf = base32.encode(e_binbuf);
				// format output
				result = this.format(outbuf,true);
			} else {
				result = 'Checksum error!';
			}
		}else{
			result = 'Password length mismatch!';
		}

		return result;
	};

    // map char to ASCII
	SSKey.prototype.map_char = function(byte) {
          var m, c;
		  if(byte >= 63 && byte <= 90){
          	m = byte;          	
          }else if(byte >= 1 && byte <= 26){
          	m = byte + 96;
          }else if(byte >= 32 && byte <= 57 ){
          	m = byte;
          }
          
          if( m > 0 ){
          	c = String.fromCharCode(m);
          	return c;
          }else{
          	return '';
          }
	};

	SSKey.prototype.get_info = function(rescue){
		// show info (name and level)
		var binbuf = new Uint8Array(BINARY_LENGTH);
		var e_binbuf = new Uint8Array(BINARY_LENGTH);
		var asciibuf = new String();

		// validate input
		if( !this.isValid(rescue) )
			return;
		
		//remove white space and new lines
		asciibuf = this.strip_ascii(rescue);

		if(asciibuf.length === ASCII_LENGTH){
			// convert to binary
			e_binbuf = base32.decode(asciibuf);
			// decrypt
			if(this.decrypt(binbuf, e_binbuf) !== 0){
				return;
			}
			// Name: 10 bytes @ offset 18
			var wanderer = '';
			var offset = 18;
			for(var i=offset; i<offset+10; i++){
				wanderer += this.map_char(binbuf[i]);
			}
			// Level: 2 bytes @ offset 28
			var lvl;
			offset = 28;
			lvl = binbuf[offset];
			offset++;
			lvl += binbuf[offset]*256;

			if (lvl <= 40) { // Kobami Valley
				return { 'name'    : wanderer, 
						 'level'   : levels[lvl].floor,
						 'dungeon' : levels[lvl].dungeon,
						 'lvl_name': levels[lvl].lvl_name };
			}else if( lvl >= 41 && lvl <= 139 ){
				return { 'name'    : wanderer, 
						 'level'   : (lvl-40) + 'F',
						 'dungeon' : 'Kitchen God' };
			}else if( lvl >= 141 && lvl <= 239 ){
				return { 'name'    : wanderer, 
						 'level'   : (lvl-140) + 'F',
						 'dungeon' : 'Scroll Cave' };
			}else if( lvl >= 241 && lvl <= 339 ){
				return { 'name'    : wanderer, 
						 'level'   : (lvl-240) + 'F',
						 'dungeon' : 'Final Puzzle' };
			}else if( lvl >= 341 && lvl <= 390 ){
				return { 'name'    : wanderer, 
						 'level'   : (lvl-340) + 'F',
						 'dungeon' : 'Ravine of the Dead' };
			}else if( lvl >= 391 && lvl <= 459 ){
				return { 'name'    : wanderer, 
						 'level'   : 30 + (lvl-390) + 'F',
						 'dungeon' : 'Tainted Path' };
			}else if( lvl >= 461 && lvl <= 490 ){
				return { 'name'    : wanderer, 
						 'level'   : (lvl-460) + 'F',
						 'dungeon' : 'Ceremonial Cave' };
			}else if( lvl >= 491 && lvl <= 540 ){
				return { 'name'    : wanderer, 
						 'level'   : (lvl-490) + 'F',
						 'dungeon' : "Fay's Puzzles" };   						 
			}else{
			// other...
				return { 'name'    : wanderer, 
						 'level'   : lvl };
			}
		}
	};

};

// nodejs/browserify
if (typeof module !== 'undefined' && module.exports) {
	module.exports = SSKey;
}	