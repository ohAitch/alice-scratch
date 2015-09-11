// ==UserScript==
// @name        asoftmurmur
// @namespace   comely-naiad
// @version     1.0.0
// @downloadURL https://github.com/alice0meta/scratch/raw/master/userscripts/asoftmurmur.user.js
// @match       http*://*.asoftmurmur.com/*
// @grant       none
// ==/UserScript==

$('#action-bar, #site-title, #gp-container, #about-link-container').remove()
$('#intro-text').text('')
$('#intro-text').css('height','1px')
$('#pb').css('margin','75px auto 25px auto')
