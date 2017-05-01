/**
 * utils
 */

export function shadeBlendConvert( p: number, from: string, to?: string ): string {
    if (typeof(p) != "number" || p < -1 || p > 1 ||
        typeof(from) != "string" || (from[0] != 'r' && from[0] != '#') ||
        (typeof(to) != "string" && typeof(to) != "undefined")) {
        return null;
    }
    let r = Math.round;
    let h = from.length > 9;
    h = typeof(to) == "string" ? to.length > 9 ? true : to == "c" ? !h : false : h;
    let b = p < 0;
    p = b ? p * -1 : p;
    to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF";
    let f = getSbcRip(from);
    let t = getSbcRip(to);
    if (!f || !t)return null; //ErrorCheck
    if (h)return "rgb(" + r((t[0] - f[0]) * p + f[0]) + "," + r((t[1] - f[1]) * p + f[1]) + "," + r((t[2] - f[2]) * p + f[2]) + (f[3] < 0 && t[3] < 0 ? ")" : "," + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3]) + ")");
    else return "#" + (0x100000000 + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255) * 0x1000000 + r((t[0] - f[0]) * p + f[0]) * 0x10000 + r((t[1] - f[1]) * p + f[1]) * 0x100 + r((t[2] - f[2]) * p + f[2])).toString(16).slice(f[3] > -1 || t[3] > -1 ? 1 : 3);
}

function getSbcRip( d: any ): Object {
    let l = d.length;
    let RGB = {};
    if (l > 9) {
        d = d.split(",");
        if (d.length < 3 || d.length > 4)return null;//ErrorCheck
        RGB[0] = parseInt(d[0].slice(4)), RGB[1] = parseInt(d[1]), RGB[2] = parseInt(d[2]), RGB[3] = d[3] ? parseFloat(d[3]) : -1;
    } else {
        if (l == 8 || l == 6 || l < 4)return null; //ErrorCheck
        if (l < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? d[4] + "" + d[4] : ""); //3 digit
        d = parseInt(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = l == 9 || l == 5 ? Math.round(((d >> 24 & 255) / 255) * 10000) / 10000 : -1;
    }
    return RGB;
}
