import { NavLink, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { capitalize } from '../utils';
import styles from './navbar.module.scss';

export default function Navbar ({ links, loggedIn}){
    const navigate = useNavigate();
	const [menuOpened, setMenuOpened] = useState(false);

    const signOut = () => {
        localStorage.clear();
        navigate('/login');
    };

    const navLinks = (
        <>
        {loggedIn && (
				<NavLink
					className={({ isActive }) => `link-btn ${isActive
						? 'selected' : ''}`}
					key="home"
					onClick={() => setMenuOpened(false)}
					to="/"
				>
					Acasa
				</NavLink>
			)}
			{links && links.map((link) => (
				<NavLink
					className={({ isActive }) => `link-btn ${isActive
						? 'selected' : ''}`}
					key={link.name}
					onClick={() => setMenuOpened(false)}
					to={`/${link.link}`}
				>
					{capitalize(link.name)}
				</NavLink>
			))}
			{loggedIn && (
				<NavLink
					className={({ isActive }) => `link-btn ${isActive
						? 'selected' : ''}`}
					key="profile"
					onClick={() => setMenuOpened(false)}
					to="/profile"
				>
					Profil Personal
				</NavLink>
			)}
        </>
    );

    return (
        <nav className={styles.navbar}>
			<div className={styles.links}>
				{navLinks}
			</div>
			<div className={styles['menu-button-container']}>
				<button
					aria-label="Menu button"
					className={`${styles['menu-button']} ${menuOpened ? styles.close : ''}`}
					onClick={() => setMenuOpened(!menuOpened)}
					type="button"
				>
					<div className={`${styles.line} ${styles['line-top']}`} />
					<div className={`${styles.line} ${styles['line-bottom']}`} />
				</button>
			</div>
			<div className={styles.logo}>
				<NavLink to={loggedIn ? '/' : '/login'}>CookBookie</NavLink>
			</div>
			{loggedIn && (
				<button
					className="link-btn"
					onClick={signOut}
					type="button"
				>
					Deconectare
				</button>
			)}
			<div className={`${styles.menu} ${menuOpened ? '' : styles.hidden}`}>
				{navLinks}
			</div>
		</nav>
    );
}