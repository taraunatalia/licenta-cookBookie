import {
	useEffect, useContext, useCallback, useState,
} from 'react';
import Store from '../../store';
import useFetch from '../common/hooks/useFetch';
import PageContainer from '../common/page-container/PageContainer';
import AddUserDialog from './user-dialogs/AddUserDialog';
import ConfirmUserDeleteDialog from './user-dialogs/ConfirmUserDeleteDialog';
import styles from './users.module.scss';

export default function ManageUsers() {
	const [users, setUsers] = useState([]);
	const customFetch = useFetch();
	const store = useContext(Store);
	const [addUserOpened, setAddUserOpened] = useState(false);
	//const [selectedUser, setSelectedUser] = useState(null);
	const [userToDelete, setUserToDelete] = useState(null);

	const getUsers = useCallback( () => {
		const loadData = async () => {
		const res = await customFetch('http://localhost:8080/admin');
		if (res.status === 200) {
			const result = await res.json();
			setUsers(result.users);
		}
	}
	loadData();
	}, []);

	useEffect(getUsers, []);

	const onUserAdded = useCallback(() => {
		getUsers();
		setAddUserOpened(false);
	}, []);


	const deleteUser = useCallback( () => {
		const loadData = async () => {
		setUserToDelete(null);
		const token = localStorage.getItem('auth-token');
		const res = await fetch('http://localhost:8080/admin', {
			method: 'DELETE',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
            },
			body: JSON.stringify({ id: userToDelete._id }),
		});
		if (res.status === 200) {
			store.addToast({ message: 'User deleted successfully!' });
			getUsers();
		}
	}
	loadData();
	}, [userToDelete, store]);

	return (
		<PageContainer
			loggedIn
			navLinks={[{link: 'users', name: 'Utilizatori'}]}
		>
			<div className="category-container">
				<div className="title-row">
					<p className="title">
						Total Utilizatori (
						{(users.length || 1) - 1}
						)
					</p>
					<button
						className="primary-btn"
						onClick={() => setAddUserOpened(true)}
						type="button"
					>
						Adaugă Utilizator
					</button>
				</div>
				{users.map((user) => !user.currentUser && (
					<div
						className={`list-item-container ${styles['user-container']}`}
						key={user._id}
					>
						<div className={styles.container}>
							<p>Nume:</p>
							<span>{user.name}</span>
						</div>
						<div className={styles.container}>
							<p>Email:</p>
							<span>{user.email}</span>
						</div>
						<div className={`${styles.container} ${styles.actions}`}>
							<div>
								<button
									className="danger-btn"
									onClick={() => setUserToDelete(user)}
									type="button"
								>
									Șterge
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
			<AddUserDialog
				cancel={() => setAddUserOpened(false)}
				onUserAdded={onUserAdded}
				opened={addUserOpened}
			/>
			<ConfirmUserDeleteDialog
				cancel={() => setUserToDelete(null)}
				email={userToDelete?.email}
				onConfirm={deleteUser}
				opened={userToDelete}
			/>
		</PageContainer>
	);
}
