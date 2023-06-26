import { useCallback, useContext, useState } from 'react';
import Store from '../../../store';
import Dialog from '../../common/dialog/Dialog';
import useFetch from '../../common/hooks/useFetch';
import UserForm from '../UserForm';
import styles from './dialog.module.scss';

export default function AddUserDialog({ cancel, opened, onUserAdded }) {
	const [user, setUser] = useState({
		isAdmin: false,
	});
	const customFetch = useFetch();
	const store = useContext(Store);
	const [isValid, setIsValid] = useState(false);

	const saveUser = useCallback(async () => {
		if (!isValid) {
			return;
		}
		const newUser = {
			...user,
			role: user.isAdmin ? 'admin' : 'user',
		};
		const res = await customFetch('http://localhost:8080/admin', {
			method: 'POST',
			body: JSON.stringify(newUser),
		});
		if (res.status === 200) {
			store.addToast({ message: 'User created successfully', type: 'success' });
			onUserAdded();
		}
	}, [user, isValid, store]);

	return (
		<Dialog
			cancel={{ showCancel: true, callback: cancel }}
			confirm={{ callback: saveUser, label: 'Adaugă', disabled: !isValid }}
			opened={opened}
			title="Adauga utilizator"
		>
			<div className={styles['form-container']}>
				<UserForm
					enterHandler={saveUser}
					setUser={setUser}
					setValid={setIsValid}
					user={user}
				/>
				<div className={styles.admin}>
					<label>
						<input
							checked={user?.role?.isAdmin}
							id="admin"
							name="admin"
							onChange={(e) => setUser({ ...user, isAdmin: e.target.checked })}
							type="checkbox"
						/>
						Administrator
					</label>
				</div>
			</div>
		</Dialog>
	);
}
