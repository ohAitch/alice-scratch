// go to https://intelligence.org/all-publications/
// copy this file into the console
// results will be in the clipboard

$ = jQuery; copy($('#articles section > .row-fluid').toArray().map(function(v){
	var t = $(v).children().eq(0)
	return [
		t.find('a').attr('href').replace(/^(https:\/\/intelligence.org)?\/?files\//g,"file:///~/papers/"),
		t.hasClass('technical-report')? '[techre]' : null,
		t.hasClass('conference-paper')? '[paper]' : null,
		t.hasClass('journal-article')? '[article]' : null,
		t.hasClass('book-chapter')? '[chapter]' : null,
		$(v).find('.HRAD-click').length? '[HRAD]' : null,
		$(v).find('.ETAD-click').length? '[ETAD]' : null,
		$(v).find('.VL-click').length? '[VL]' : null,
		$(v).find('.FC-click').length? '[FC]' : null,
		t.text()
			.replace(/\s\s+/g, ' ')
			.replace(/(Berkeley, CA: )?Machine Intelligence Research Institute.{0,8}$/g, '')
			.replace(/ +$/g, '')
			.replace(/Technical [Rr]eport [\d-]+\..*$/g, ''),
		].filter(function(v){return v}).join(' ')
		}).join('\n'))
