export function loop(
    render: Function,
    loopFn: Function
): Function {
    let active = true
    const loop = () => {
        if (!active) return
        loopFn(loop)
        render()
    }
    loop()

    return () => {
        active = false
    }
}