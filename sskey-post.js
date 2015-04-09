'use strict';


var ShirenReviver = function(){
	this.revive = function(){
		var rescue, revival;
		var sskey = new SSKey();
		rescue = document.getElementById("rescue").value.toUpperCase();
		
		// revive 
		revival = sskey.revive_from_rescue(rescue);
		document.getElementById("revival").value = revival;
		if( revival.length === 70  ){
		   document.getElementById("rescue").value = sskey.format(rescue,true);
		}

		// get wanderer name and level
		var info = sskey.get_info(rescue);
		if( typeof info === 'object'){
			document.getElementById("name").value = info.name;
			document.getElementById("level").value = info.level;
			document.getElementById("dungeon").value = info.dungeon;
		}

		return false;	
	};
};

var shiren = new ShirenReviver();
