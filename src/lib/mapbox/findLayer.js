export function findLayer(name, map) {
    var layers = map.getStyle().layers;

    let layer
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].id === name) {
            layer = layers[i].id;
            break;
        }
    }

    return layer
}