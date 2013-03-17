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
			hashtable[tz_name] = { std: tz_std_offset, dst: tz_dst_offset };
		}

		var sortedKeys = _.sortBy( _.keys(hashtable), function(el){ return el; } )
			,numkeys = sortedKeys.length - 1;

		var fileContent = 'module.exports = { zones: [';
		_.each(sortedKeys, function(el, ix, list){
			fileContent += '"' + el + '"' + ( (ix < numkeys) ? ',' : '' );
		});
		fileContent += '],\ntz: {';
		_.each( sortedKeys, function(el, ix, list){
			fileContent += '\n"' + el + '": { std: "' + hashtable[el].std + '", dst: "' + hashtable[el].dst + '" }' + ( (ix < numkeys) ? ',' : '' );
		});
		fileContent += '}};'

		fs.writeFileSync('index.js', fileContent, 'UTF-8');

	});

}).on('error', function(err){
	console.log('HTTP ERROR: ', e);
});