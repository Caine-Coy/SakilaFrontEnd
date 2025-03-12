import './NavBar.css';

interface NavBarProps {
    onStateChange: (state: number) => void;
    isAdmin?: boolean;
}
export function NavBar({ onStateChange , isAdmin = false }: NavBarProps  ) {
    return (
        <nav className="navbar">
            <div className="nav-content">
                <button id="Home" className="nav-link" onClick={() => onStateChange(0)}>Home</button>
                <button id="Search" className="nav-link" onClick={() => onStateChange(1)}>Search</button>
                <button id="Settings" className="nav-link" onClick={() => onStateChange(2)}>Settings</button>
                {isAdmin && <button id="isAdmin" className="nav-link admin-only" onClick={() => onStateChange(4)}>Add Movie</button>}
                <button id="About" className="nav-link" onClick={() => onStateChange(3)}>About</button>
            </div>
        </nav>
    )
}
