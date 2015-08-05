// ==UserScript==
// @name        attention: stackexchange
// @namespace   comely-naiad
// @version     1.0.2
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/attention_stackexchange.user.js
// @match       http*://*.stackexchange.com/*
// @match       http*://stackoverflow.com/*
// @match       http*://serverfault.com/*
// @match       http*://superuser.com/*
// @match       http*://askubuntu.com/*
// @grant       none
// ==/UserScript==

$('#hot-network-questions li > a:not([href^="http://math."]):not([href^="http://physics."])').closest('li').remove()
$('#hot-network-questions li').removeClass('dno').removeClass('js-hidden')
$('#hot-network-questions > a').remove()

$('.ad-container').remove()
$('#newsletter-ad').parent().remove()

if (location.host === 'stackexchange.com') {
	$('#question-list > :not([data-sid^="math."]):not([href^="physics."])').remove()
} else if (!(location.host === 'math.stackexchange.com' || location.host === 'physics.stackexchange.com')) {
	if (location.pathname === '/' || location.pathname === '/questions' || location.pathname === '/unanswered') {
		$('#mainbar').remove()
	} else {
		$('#sidebar > .sidebar-linked').remove()
		$('#sidebar > .sidebar-related').remove()
	}	
}
