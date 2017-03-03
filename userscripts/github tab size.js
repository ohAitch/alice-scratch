// @match       *://*.github.com/*
// @match       *://*.githubusercontent.com/*
// @require     https://code.jquery.com/jquery-3.1.1.min.js

var css = ι=>{ var t = document.createElement('style'); t.innerHTML = ι; document.head.appendChild(t) }

css('pre, .tab-size { tab-size:2 !important; }')
