export function DebugTable({ children }) {
    return (
        <div>
            {
                children.map(
                    ({ caption, text }) =>
                        <div key={caption}><b>{caption}: </b><br /> {text}</div>
                )
            }
        </div>
    )
}