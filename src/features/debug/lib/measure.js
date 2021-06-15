export function measure(name = performance.now()) {
    return () => console.timeEnd(name)
}