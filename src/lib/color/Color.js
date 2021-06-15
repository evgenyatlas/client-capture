import { rgb2hex } from "./rgb2hex"

export class Color {
    #rgba = []
    #rgbaStr = ''
    #hexStr = ''
    constructor(rgba) {
        this.#rgba = rgba
        this.#rgbaStr = Color.rgba2str(rgba)
    }

    getHex() {
        if (!this.#hexStr) {
            this.#hexStr = rgb2hex(this.#rgbaStr)
        }
        return this.#hexStr
    }

    getRGBA(alpha) {
        return alpha === undefined
    }

    static rgba2str(rgba) {
        return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}${rgba[3] ? `, ${rgba[3]}` : ''})`
    }
}