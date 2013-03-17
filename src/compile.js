var cheerio = require('cheerio')
	,fs      = require('fs')
	,http    = require('http')
	,_       = require('underscore')
	;

http.get('http://en.wikipedia.org/wiki/List_of_tz_database_time_zones', function(res){

	var fullResponse = '';

	res.on('data', function (chunk) {
		fullResponse += chunk;
	});
	res.on('end', function(){

		var $ = cheerio.load(fullResponse);
		var hashtable = {}, cols, tables = $('.wikitable'), rows = $(tables[0]).find('tr');
		for (var r in rows){
			//skip headers row
			if (r === '0') continue;

			cols = $(rows[r]).find('td');
			if (typeof cols['2'] === 'undefined') continue;
			if (typeof cols['4'] === 'undefined') continue;
			if (typeof cols['2'].children[0].children === 'undefined') continue;

			var tz_name = cols['2'].children[0].children[0].data;
			var tz_std_offset = cols['4'].children[0].children[0].data;
			var tz_dst_offset = cols['5'].children[0].children[0].data;

			var seconds_std = parseInt(tz_std_offset.slice(1,3), 10)*60*60 + parseInt(tz_std_offset.slice(4,6), 10)*60;
			var seconds_dst = parseInt(tz_dst_offset.slice(1,3), 10)*60*60 + parseInt(tz_dst_offset.slice(4,6), 10)*60;
			if (tz_std_offset.slice(0,1) !== '+'){
				//wikipedia not using standard dashes... bastards
				var tmp = tz_std_offset.split('');
				tmp.splice(0,1,'-');
				tz_std_offset = tmp.join('');
				seconds_std = seconds_std * -1;
			}
			if (tz_dst_offset.slice(0,1) !== '+'){
				//wikipedia not using standard dashes... bastards
				var tmp = tz_dst_offset.split('');
				tmp.splice(0,1,'-');
				tz_dst_offset = tmp.join('');
				seconds_dst = seconds_dst * -1;
			}
			hashtable[tz_name] = { std: tz_std_offset, dst: tz_dst_offset, std_seconds: seconds_std, dst_seconds: seconds_dst };
		}

		var sortedKeys = _.sortBy( _.keys(hashtable), function(el){ return el; } );

		var payload = { zones: sortedKeys, tz: hashtable };

		fs.writeFileSync('index.json', JSON.stringify(payload), 'UTF-8');

	});

}).on('error', function(err){
	console.log('HTTP ERROR: ', e);
});