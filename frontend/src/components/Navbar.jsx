import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser, cartCount = 0, onCartClick, notificationCount = 0 }) => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/login');
    };

    return (
        <header className="navbar">
            <Link to={user?.role === 'admin' ? '/owner-dashboard' : '/'} className="nav-brand">
                🍔 CanteenHub
            </Link>

            <nav className="nav-links">
                {user?.role === 'admin' ? (
                    <>
                        <Link to="/owner-dashboard" className="nav-item">Dashboard</Link>
                        <Link to="/owner-menu" className="nav-item">Menu Manager</Link>
                    </>
                ) : (
                    <>
                        <Link to="/" className="nav-item">Menu</Link>
                        <Link to="/track" className="nav-item">
                            Orders
                            {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
                        </Link>
                        <button className="nav-item" onClick={onCartClick} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            🛒 Cart
                            {cartCount > 0 && <span className="badge" style={{ marginLeft: '0.25rem' }}>{cartCount}</span>}
                        </button>
                    </>
                )}

                <a
                    href="https://github.com/MYUVAN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-item"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        textDecoration: 'none',
                        color: 'inherit',
                        marginLeft: '1rem'
                    }}
                >
                    <svg height="20" width="20" aria-hidden="true" viewBox="0 0 16 16" version="1.1" fill="currentColor">
                        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.46-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                    </svg>
                    GitHub
                </a>

                <div className="nav-item" style={{ marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--color-border)' }}>
                    <span style={{ marginRight: '1rem', fontWeight: 600 }}>{user?.name}</span>
                    <button onClick={logoutHandler} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>
                        Logout
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
