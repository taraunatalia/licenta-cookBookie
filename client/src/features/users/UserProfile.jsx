import {
	useContext, useCallback, useEffect, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Store from '../../store';
import useEditUser from '../common/hooks/useEditUser';
import useFetch from '../common/hooks/useFetch';
import PageContainer from '../common/page-container/PageContainer';
import ConfirmUserDeleteDialog from './user-dialogs/ConfirmUserDeleteDialog';
import styles from './users.module.scss';

export default function UserProfile() {
	const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
	const [user, setUser] = useState(null);
	const customFetch = useFetch();
	const navigate = useNavigate();
	const [deleteOpened, setDeleteOpened] = useState(false);
	const store = useContext(Store);

	const getUser = useCallback(() => {
        const loadData = async () => {
		const res = await customFetch('http://localhost:8080/user');
		if (res.status === 200) {
			const result = await res.json();
			setUser(result.user);
			setIsAdmin(result.user?.role?.isAdmin);
		}
    }
    loadData();
	}, []);

	useEffect(getUser, []);

	const onUserUpdated = () => navigate('/');

	const [updateUser, disabled, component] = useEditUser(user, true, onUserUpdated);

	const deleteAccount = useCallback(async () => {
		const res = await customFetch('http://localhost:8080/user', {
			method: 'DELETE',
		});
		if (res.status === 200) {
			store.addToast({ message: 'Account deleted successfully', type: 'success' });
			localStorage.clear();
			navigate('/login');
		}
	}, [store]);

	return (
		<PageContainer
			loggedIn
			navLinks={[isAdmin ? {link: 'users', name: 'Utilizatori'} : {link: 'userRecipes', name: 'Retele mele'}]}
		>
			<div className="list-item-container">
				<h2 className={styles.title}>Editează profil</h2>
				{component}
				<div className={styles['user-actions']}>
					<button
						className="danger-btn"
						onClick={() => setDeleteOpened(true)}
						type="button"
					>
						Șterge contul
					</button>
					<button
						className="primary-btn"
						disabled={disabled}
						onClick={updateUser}
						type="button"
					>
						Actualizează contul
					</button>
				</div>
			</div>
			<ConfirmUserDeleteDialog
				cancel={() => setDeleteOpened(false)}
				email="account"
				onConfirm={deleteAccount}
				opened={deleteOpened}
				profile="true"
			/>
		</PageContainer>
	);
}
