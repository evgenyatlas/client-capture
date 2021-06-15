import { Icon28SettingsOutline } from '@vkontakte/icons';
import { showGameSettingEv } from '../../store';
import './ShowGameSettingBtn.css'

export function ShowGameSettingBtn() {
    return (
        <div className="ShowGameSettingBtn" onClick={showGameSettingEv}>
            <Icon28SettingsOutline />
        </div>
    )
}