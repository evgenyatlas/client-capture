import { useEffect, useState } from "react";
import { DebugTable } from "../DebugTable";

export function Memory() {
    const [state, setState] = useState(performance.memory)
    useEffect(() => {
        setInterval(() => {
            setState(performance.memory)
        }, 1500)
    }, [])
    return (
        <DebugTable>
            {
                [
                    {
                        caption: 'Лимит памяти',
                        text: (state.jsHeapSizeLimit / 1048576).toFixed(3) + ' MB'
                    },
                    {
                        caption: 'Выделенная память',
                        text: (state.totalJSHeapSize / 1048576).toFixed(3) + ' MB'
                    },
                    {
                        caption: 'Используемая память',
                        text: (state.usedJSHeapSize / 1048576).toFixed(3) + ' MB'
                    },
                ]
            }
        </DebugTable>
    )
}