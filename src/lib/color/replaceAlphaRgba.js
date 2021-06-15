export function replaceAlphaRgba(rgba, alpha) {
    return rgba.replace(/(0\.)?\d+\)/, alpha + ')')
}