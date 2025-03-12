import { useState, useEffect } from 'react'
import './App.css'
import { NavBar } from './components/NavBar.tsx'
import FetchButton from './components/FetchButton.tsx'
import { Settings} from './pages/Settings.tsx';
import About from './pages/About.tsx';
import Search from './pages/Search.tsx';
import AddMovie from './pages/AddMovie.tsx';

enum Page {
  HOME = 0,
  SEARCH = 1,
  SETTINGS = 2,
  ABOUT = 3,
  ADD_MOVIE = 4,
}

function App() {

    const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
    //load if admin from localstorage
    const [isAdmin, setIsAdmin] = useState<boolean>(() => {
        const saved = localStorage.getItem('isAdmin');
        return saved ? JSON.parse(saved) : false;
    });

    // Update localStorage when admin state changes
    useEffect(() => {
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
    }, [isAdmin]);

    const handleNavigation = (state: number) => {
        if (Object.values(Page).includes(state)) {
            setCurrentPage(state as Page);
        }
    };

    return (
        <>
            <header>
                <title>Random Movie Selector</title>
                <h1 className="colour">Random Movie Selector</h1>
                <NavBar onStateChange={handleNavigation} isAdmin = {isAdmin} />
            </header>
            {currentPage === Page.HOME && <div><FetchButton/></div>}
            {currentPage === Page.SETTINGS && 
                <Settings 
                    isAdmin={isAdmin} 
                    onAdminChange={setIsAdmin}
                />
            }
            {currentPage === Page.ABOUT && <About />}
            {currentPage === Page.SEARCH && <Search isAdmin={isAdmin} />}
            {currentPage === Page.ADD_MOVIE && <AddMovie isAdmin= {isAdmin} />}
        </>
    );
}

export default App;


