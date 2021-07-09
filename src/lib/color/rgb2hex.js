export function rgb2hex(orig) {
  let a,
    rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),(\d+)/i),
    hex = rgb ?
      (rgb[1] | 1 << 8).toString(16).slice(1) +
      (rgb[2] | 1 << 8).toString(16).slice(1) +
      (rgb[3] | 1 << 8).toString(16).slice(1)
      : orig;


  a = Math.round(a * 100) / 100;

  return '#' + hex;
}