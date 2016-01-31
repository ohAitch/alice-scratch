// @match       *://*.stackexchange.com/*
// @match       *://stackoverflow.com/*
// @match       *://serverfault.com/*
// @match       *://superuser.com/*
// @match       *://askubuntu.com/*

$('#hot-network-questions li > a:not([href^="http://math."])'/*:not([href^="http://physics."])'*/).closest('li').remove()
$('#hot-network-questions li').removeClass('dno').removeClass('js-hidden')
$('#hot-network-questions > a').remove()

$('.ad-container').remove()
$('#newsletter-ad').parent().remove()

if (location.host === 'stackexchange.com') {
	$('#question-list > :not([data-sid^="math."])'/*:not([href^="physics."])'*/).remove()
} else if (!(location.host === 'math.stackexchange.com')) {
	if (location.pathname in {'/':0, '/questions':0, '/unanswered':0}) {
		$('#mainbar').remove()
	} else if (!(location.host === 'stats.stackexchange.com')) {
		$('#sidebar > .sidebar-linked').remove()
		$('#sidebar > .sidebar-related').remove()
	}	
}
