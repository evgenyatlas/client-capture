export function addClickHandler(map, handlerData) {
    map.on('click', handlerData.layer, handlerData.handler)
}