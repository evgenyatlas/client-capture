import { createElement } from "./createElement"

export function loadImg(url) {
    return new Promise((res, rej) => {
        let img = createElement('img', { src: url })
        img.addEventListener('load', () => res(img))
    })
}