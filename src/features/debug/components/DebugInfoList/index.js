import { FpsInfo } from '../FpsInfo'
import { GpsInfo } from '../GpsInfo'
import { Memory } from '../Memory'
import './DebugInfoList.css'

export function DebugInfoList() {
    return (
        <div className="DebugInfoList">
            <FpsInfo />
            {performance.memory && <Memory />}

            <GpsInfo />
        </div>
    )


}