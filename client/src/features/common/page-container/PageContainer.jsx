import Navbar from '../nav/NavBar';
import styles from './pageContainer.module.scss'; 

export default function PageContainer({
    navLinks,
    loggedIn = true,
    children,
    fullHeight = false,
}) {
    return (
        <>
        <Navbar
          links = {navLinks}
          loggedIn = {loggedIn}
          />
          <div className={`${styles.pageContainer} ${fullHeight ? styles.fullHeight : ''}`}>
				{children}
			</div>
        </>
    )
}