export function onDoneRenderMap(map, fn) {
    map.once('idle', () => {
        if (map.loaded()) {
            fn(map)
        }
    });
}