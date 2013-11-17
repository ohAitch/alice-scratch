var draw = SVG('canvas')

var a = draw.polyline([[50,50+12+2], [50,50], [50+12+2,50]]).fill('none').stroke({width: 4})
var b = draw.polyline([[50+12-2,50+12], [50+12*2,50+12], [50+12*2,50+12*2], [50+12*2,50+12*3+2]]).fill('none').stroke({width: 4})
var c = draw.polyline([[50+12+2,50-12], [50-12,50-12], [50-12,50+12*2], [50+12,50+12*2], [50+12,50+12*3+2]]).fill('none').stroke({width: 4})