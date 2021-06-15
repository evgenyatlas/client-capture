
export const defer = () => {
    return new Promise(res => requestAnimationFrame(res))
}