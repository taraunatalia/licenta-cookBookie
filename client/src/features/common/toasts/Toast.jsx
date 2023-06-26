import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Store from '../../../store';
import styles from './toast.module.scss';

export default function Toast({ toast }) {
	const store = useContext(Store);

	const close = () => {
		store.removeToast(toast.id);
	};

	return (
		<div className={`${styles.toast} ${styles[toast.type]}`}>
			{toast.message}
			<button
				className={styles['close-button']}
				onClick={close}
				type="button"
			>
				<FontAwesomeIcon icon={faTimes} />
			</button>
		</div>
	);
}
