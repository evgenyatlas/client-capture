export function createElement(tag, attrs = {}, child) {
    const elm = document.createElement(tag)
    Object.keys(attrs).forEach(attrKey => elm.setAttribute(attrKey, attrs[attrKey]))
    if (child) {
        if (typeof child === 'string') {
            elm.appendChild(document.createTextNode(child))
        } else
            elm.appendChild(child)
    }
    return elm
}