package image;

import java.awt.image.BufferedImage;

public class transform {

static public int px_merge(int x, int y) {
	int	a0 = x >>> 24, r0 = (x >>> 16) & 0xff, g0 = (x >>> 8) & 0xff, b0 = x & 0xff,
		a1 = y >>> 24, r1 = (y >>> 16) & 0xff, g1 = (y >>> 8) & 0xff, b1 = y & 0xff,
		a = (a1*255 + (255-a1)*a0) / 255,
		r = (a1*r1  + (255-a1)*r0) / 255,
		g = (a1*g1  + (255-a1)*g0) / 255,
		b = (a1*b1  + (255-a1)*b0) / 255;
	return (a << 24) | (r << 16) | (g << 8) | b;}

static public void px_array_merge_Er(int[] a, int[] b) {for (int i=0;i<a.length;i++) b[i] = px_merge(a[i],b[i]);}
static public void px_array_mask(int[] v, boolean[] mask, int[] out) {for (int i=0;i<v.length;i++) out[i] = mask[i]? v[i] : 0;}
static public void px_array_mask_E(int[] v, boolean[] mask) {for (int i=0;i<v.length;i++) if (!mask[i]) v[i] = 0;}
static public boolean[] px_array_diff_mask(int[] a, int[] b) {boolean[] r = new boolean[a.length]; for (int i=0;i<a.length;i++) r[i] = a[i] != b[i]; return r;}
static public boolean[] mask_add_borders(boolean[] v, int X, int Y) {
	boolean[] r = new boolean[v.length];
	for (int y=0;y<Y;y++)
		for (int x=0;x<X;x++)
			if (v[y*X+x])
				for (int y2=-12;y2<=12;y2++)
					if (0 <= y+y2 && y+y2 < Y)
						for (int x2=-12;x2<=12;x2++)
							if (0 <= x+x2 && x+x2 < X)
								r[(y+y2)*X+(x+x2)] = true;
	return r;}
static public int bool_array_sum(boolean[] v) {int r=0; for (int i=0;i<v.length;i++) if (v[i]) r++; return r;}

}