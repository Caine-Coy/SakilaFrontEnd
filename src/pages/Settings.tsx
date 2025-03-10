import './Settings.css';

interface SettingsProps {
    isAdmin: boolean;
    onAdminChange: (value: boolean) => void;
}

export function Settings({ isAdmin, onAdminChange }: SettingsProps) {
    return (
        <div className="settings-container">
            <h2>Settings</h2>
            <div className="setting-group">
                <input
                    type="checkbox"
                    id="adminMode"
                    checked={isAdmin}
                    onChange={(e) => onAdminChange(e.target.checked)}
                />
                <label htmlFor="adminMode">Admin Mode</label>
            </div>
        </div>
    );
}