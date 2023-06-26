import {
	useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import Store from '../../../store';
import UserForm from '../../users/UserForm';
import useFetch from './useFetch';

export default function useEditUser(user, profile, onUserUpdated = () => {}, styles = {}) {
	const [editedUser, setEditedUser] = useState({ ...user, isAdmin: user?.role?.isAdmin });
	const customFetch = useFetch();
	const store = useContext(Store);
	const [errors, setErrors] = useState({});
	const [fields, setFields] = useState({});

	useEffect(() => {
		setEditedUser({ ...user, isAdmin: user?.role?.isAdmin });
	}, [user]);

	const disabled = useMemo(
		() => fields.password !== ''
			&& (fields.passwordConfirm === '' || errors.password || errors.passwordConfirm),
		[errors, fields],
	);

	const updateUser = useCallback(async () => {
		if (disabled) {
			return;
		}
		const updatedUser = {
			userId: user._id,
			role: editedUser.isAdmin ? 'manager' : 'user',
		};
		if (editedUser.name !== '' && editedUser.name !== user.name) {
			updatedUser.name = editedUser.name;
		}
		if (editedUser.email !== '' && editedUser.email !== user.email) {
			updatedUser.email = editedUser.email;
		}
		if (fields.password !== '' && editedUser.password !== '' && !errors.passwordConfirm) {
			updatedUser.password = editedUser.password;
		}
		const url = profile ? 'user' : 'manager/user';
		const res = await customFetch('http://localhost:8080/user', {
			method: 'PATCH',
			body: JSON.stringify(updatedUser),
		});
		if (res.status === 200) {
			store.addToast({
				message: `${profile ? 'Profile' : 'User'} updated successfully`,
				type: 'success',
			});
			onUserUpdated();
		}
	}, [editedUser, disabled, store]);

	const handleErrors = useCallback((err, newFields) => {
		setErrors(err);
		setFields(newFields);
	});

	const component = (
		<>
			<UserForm
				enterHandler={updateUser}
				initialUser={editedUser}
				onErrorsChange={handleErrors}
				setUser={setEditedUser}
				user={editedUser}
			/>
			{!profile && editedUser?.isAdmin !== undefined && (
				<div className={styles.admin}>
					<label>
						<input
							checked={editedUser?.isAdmin}
							id="admin"
							name="admin"
							onChange={(e) => setEditedUser({
								...user,
								isAdmin: e.target.checked,
							})}
							type="checkbox"
						/>
						Administrator
					</label>
				</div>
			)}
		</>
	);

	return [updateUser, disabled, component];
}