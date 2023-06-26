import Dialog from '../../common/dialog/Dialog';
import useEditUser from '../../common/hooks/useEditUser';
import styles from './dialog.module.scss';

export default function EditUserDialog({
	user, opened, onUserUpdated, cancel,
}) {
	const [updateUser, disabled, component] = useEditUser(user, false, onUserUpdated, styles);

	return (
		<Dialog
			cancel={{ showCancel: true, callback: cancel }}
			confirm={{ callback: updateUser, label: 'Update', disabled }}
			opened={opened}
			title="Edit user"
		>
			<div className={styles['form-container']}>
				{component}
			</div>
		</Dialog>
	);
}
