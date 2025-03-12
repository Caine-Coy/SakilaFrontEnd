import { useState, useEffect } from 'react';
import './Settings.css';

interface SettingsProps {
    isAdmin: boolean;
    onAdminChange: (value: boolean) => void;
}

export function Settings({ isAdmin, onAdminChange }: SettingsProps) {
    const [llmUrl, setLlmUrl] = useState(() => {
        return localStorage.getItem('llmUrl') || 'http://localhost:1234/v1';
    });

    useEffect(() => {
        localStorage.setItem('llmUrl', llmUrl);
    }, [llmUrl]);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLlmUrl(e.target.value);
    };

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
            
            <div className="setting-group">
                <label htmlFor="llmUrl">LLM Provider URL:</label>
                <input
                    type="text"
                    id="llmUrl"
                    value={llmUrl}
                    onChange={handleUrlChange}
                    placeholder="Enter LLM provider URL"
                    className="url-input"
                />
            </div>
        </div>
    );
}