import './NavBar.css';

interface NavBarProps {
    onStateChange: (state: number) => void;
    isAdmin?: boolean;
}
export function NavBar({ onStateChange , isAdmin = false }: NavBarProps  ) {
    return (
        <nav className="navbar">
            <div className="nav-content">
                <button className="nav-link" onClick={() => onStateChange(0)}>Home</button>
                <button className="nav-link" onClick={() => onStateChange(1)}>Search</button>
                <button className="nav-link" onClick={() => onStateChange(2)}>Settings</button>
                {isAdmin && <button className="nav-link admin-only" onClick={() => onStateChange(4)}>Add Movie</button>}
                <button className="nav-link" onClick={() => onStateChange(3)}>About</button>
            </div>
        </nav>
    )
}
