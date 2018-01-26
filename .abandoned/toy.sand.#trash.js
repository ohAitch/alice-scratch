$('canvas').map(λ(){ @.width = 256*127; @.height = 100 })


rainbow ←
	// [ [157.544,25.675,18.157],[240.903,184.21,14.491],[109.093,138.531,109.123],[64.574,108.333,124.685],[211.584,81.128,95.115],[224.569,96.32,56.516],[233.879,114.961,42.661],[248.514,194.816,48.596],[251.341,213.442,33.782],[174.044,188.033,47.491],[112.934,153.638,55.032],[78.159,143.431,88.953],[62.75,149.193,172.291],[87.816,94.558,132.005],[105.943,75.773,127.247],[152.755,82.294,134.033], ].map(ι=> color(ι).saturate(0.5).rgb().color)
	[ [157.544,25.675,18.157],[240.903,184.21,14.491],[109.093,138.531,109.123],[64.574,108.333,124.685],[211.584,81.128,95.115],[224.569,96.32,56.516],[233.879,114.961,42.661],[248.514,194.816,48.596],[251.341,213.442,33.782],[174.044,188.033,47.491],[112.934,153.638,55.032],[78.159,143.431,88.953],[62.75,149.193,172.291],[87.816,94.558,132.005],[105.943,75.773,127.247],[152.755,82.294,134.033], ].map(ι=>{
		[L,a,b] ← color(ι).lab().color
		t ← 80 / max(abs(a),abs(b))
		a *= t; b *= t
		↩ color.lab([L,a,b]).rgb().color })
// ['#ff0000','#ff4200','#ff7400','#ff8d00','#ffaa00','#ffbe00','#ffd300','#ffe900','#ffff00','#cff700','#9fee00','#50dd00','#00cc00','#00b151','#009999','#096ba2','#1240ab','#252aad','#3914af','#570eac','#7109aa','#a2048d','#cd0074','#e6003b']
// ['#d4515f','#e16039','#ea732b','#f9c331','#fbd522','#aebc2f','#719a37','#4e8f59','#3f95ac','#585f84','#6a4c7f','#995286']
// ['#9e1a12','#f1b80e','#6d8b6d','#416c7d']
	.map(color.X)



seen ← {}
for (y2←0;y2<2;y2++)
for (y←0;y<shape.Y>>1;y++)
for (x←0;x<shape.X;x++){
	// c ← interpolate_colors(rainbow,x/shape.X)
	// [L,a,b] ← c.lab().color
	// L = L * (1-y/shape.Y)

	L ← 100 * (1-y/(shape.Y/2))
	h_i ← x/shape.X

	a ← 128 * cos(h_i*τ) * 0.5
	b ← 128 * sin(h_i*τ) * 0.5

	c ← convert.xyz.rgb(convert.lab.xyz([L,a,b]))
	// c = color.lab([L,a,b]).rgb().color
	if (y2===1){
		type ← c.filter(ι=>ι>0xff||ι<0).length
		c = random()<0.2? ( type===3? [0xff,0xff,0xff] : type===2? [0xa0,0xa0,0xa0] : type===1? [0x60,0x60,0x60] : [0,0,0] ) : c
		}

	if (y2===0)
		{ hash ← color(c).color.map(ι=> ι |0)+''; if (seen[hash]) c = [0,0,0]; else seen[hash] = true }

	cs_pix[(y+y2*(shape.Y>>1))*shape.X+x] = color_to_i32(color(c))
	}



	c = color.lab([L,a,b]).rgb().lab().color
	ε ← (a,b)=> abs(a-b) < 0.02
	ε2 ← (a,b)=> abs(a-b) < 5
	c = ε(c[0],L) && ε(c[1],a) && ε(c[2],b) && ε2(color.lab([L,a,b]).rgb().color[0],204) && ε2(color.lab([L,a,b]).rgb().color[1],47)? color.lab([L,a,b]).rgb().color : [0,0,0]

	w_s ← c.some(ι=> ι>0xff || ι<0 )
	b_s ← c.filter(ι=>ι<0).length
	c = random()<0.2? ( type===3? [0xff,0xff,0xff] : type===2? [0xa0,0xa0,0xa0] : type===1? [0x60,0x60,0x60] : [0,0,0] ) : c
	c = b_s >= 1 || w_s >= 2? [0,0,0] : c





I ← shape.X*shape.Y
for(i←0;i<I;i++){
	// L ← 100 * (1-y/shape.Y)
	// d ← 256*256*(x/shape.X)|0

	// lines ← ceil(256*256 / shape.X)
	// L ← 60 - y/lines |0
	// d ← y%lines * shape.X + x

	// L ← 100 - y%100
	// d ← ((y/100|0)*shape.X + x) *5 - 256*256/2 //*5.69/4//*16

	d ← (1 - i/I) * pow(256,3) |0

	[L,a,b] ← hilbert_curve.index_to_point(3,8,d)
	L = 100 * L/256
	a = a - 127.5
	b = b - 127.5

	[x,y] ← hilbert_curve.index_to_point(2,12,d)
	x = x/pow(2,12) * shape.X |0
	y = y/pow(2,12) * shape.Y |0
	// [x,y] ← [i%shape.X,i/shape.X|0]

	cs_pix[y*shape.X + x] = color_to_i32(color(convert.xyz.rgb(convert.lab.xyz([L,a,b]))))
	}



seen ← Array(0x1000000)
// for (var i of _.range(cs_pix.length)._.shuffle())
for (i←0;i<cs_pix.length;i++)
	{ hash ← cs_pix[i]&0xffffff; if (seen[hash]) cs_pix[i] = 0xff000000; else seen[hash] = true }



for (y←0;y<shape.Y;y++)
for (x←0;x<shape.X;x++){
	L ← 100 - y%100
	d ← ((y/100|0)*shape.X + x) *5.69/4 - 256*256/2

	[a,b] ← hilbert_curve.index_to_point(2,8,d).map(ι=> ι-127.5)

	c ← convert.xyz.rgb(convert.lab.xyz([L,a,b]))
	c = c.some(ι=> ι<0 || ι>0xff )? [0,0,0] : c.map(ι=>ι|0)

	cs_pix[y*shape.X + x] = color_to_i32(color(c))
	}





// would much rather use something like
// https://en.wikipedia.org/wiki/Lab_color_space#CIELAB-CIEXYZ_conversions
// https://en.wikipedia.org/wiki/CIELUV#XYZ_.E2.86.92_CIELUV_and_CIELUV_.E2.86.92_XYZ_conversions
convert.xyz.luv = xyz=>{ [x,y,z] ← xyz
	x /= 95.047; y /= 100; z /= 108.883
	L ← y > 0.008856? 116 * pow(y,1/3) - 16 : y / pow(3/29,3)
	targetDenominator ← xyz[0] + 15*xyz[1] + 3*xyz[2]
	white ← [95.047,100,108.883]
	referenceDenominator ← white[0] + 15*white[1] + 3*white[2]
	x_target ← targetDenominator===0? 0 : 4 * xyz[0] / targetDenominator - 4 * white[0] / referenceDenominator
	y_target ← targetDenominator===0? 0 : 9 * xyz[1] / targetDenominator - 9 * white[1] / referenceDenominator
	u ← 13 * L * x_target
	v ← 13 * L * x_target
	↩ [L,u,v] }
convert.luv.xyz = luv=>{
	[L,u,v] ← luv
	if (L===0&&u===0&&v===0) ↩ [0,0,0]
	if (L===0) ↩ [-1,-1,-1]
	white ← [95.047,100,108.883]
	c ← -1/3; Yn ← 1
	u_prime ← 4 * white[0] / (white[0] + 15*white[1] + 3*white[2])
	v_prime ← 9 * white[1] / (white[0] + 15*white[1] + 3*white[2])
	a ← 1/3 * ( 52*L / (u + 13*L*u_prime) - 1 )
	y ← Yn * ( L > 8? pow((L + 16) / 116, 3) : L * pow(3/29,3) )
	b ← -5 * y
	d ← y * ( 39*L / (v + 13*L*v_prime) - 5 )
	x ← (d - b) / (a - c)
	z ← x*a + b
	↩ [x,y,z].map(ι=> ι*100) }
