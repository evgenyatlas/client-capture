
export class RGBA {
    #rgba = []
    #str = ''
    constructor(rgba) {
        this.#rgba = rgba
        this.#str = RGBA.rgba2str(rgba)
    }

    print(alpha) {
        return alpha ?
            RGBA.rgba2str(this.#rgba, alpha)
            :
            this.#str
    }

    static fromStr(str) {
        return new RGBA(str.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),(\d+)/i).slice(1))
    }

    static rgba2str(rgba, alpha) {
        return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${alpha ? alpha : rgba[3]})`
    }
}