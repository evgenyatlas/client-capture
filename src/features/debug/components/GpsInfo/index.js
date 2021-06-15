import { useStore } from "effector-react"
import { $geolocation } from "../../../geolocation/store"
import { DebugTable } from "../DebugTable"


export function GpsInfo() {
    const { coords, accuracy } = useStore($geolocation)
    return (
        <DebugTable>
            {
                [
                    {
                        caption: 'Кординаты',
                        text: `${coords[0].toFixed(5)} ${coords[1].toFixed(5)}`
                    },
                    {
                        caption: 'Точность',
                        text: `${accuracy}м`
                    }
                ]
            }
        </DebugTable>
    )
}