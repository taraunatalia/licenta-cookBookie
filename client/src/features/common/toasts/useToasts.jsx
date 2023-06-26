import { useReducer } from 'react';
import { v4 as generateId } from 'uuid';
import Toast from './Toast';
import styles from './toast.module.scss';

const timers = new Map();

function reducer(state, action) {
	switch (action.type) {
	case 'add': {
		return {
			toasts: [...state.toasts, action.toast],
		};
	}
	case 'remove': {
		return {
			toasts: state.toasts.filter((toast) => toast.id !== action.id),
		};
	}
	default:
	}
	return {
		toasts: [],
	};
}

function addToastAction(toast) {
	return {
		type: 'add',
		toast,
	};
}

function removeToastAction(id) {
	return {
		type: 'remove',
		id,
	};
}

export default function useToasts() {
	const [state, dispatch] = useReducer(reducer, { toasts: [] });

	const addToast = ({ message, type, duration = 5000 }) => {
		const toast = {
			id: generateId(),
			message,
			type: type || 'success',
			duration,
		};
		dispatch(addToastAction(toast));
		const timerId = setTimeout(() => {
			timers.delete(toast.id);
			dispatch(removeToastAction(toast.id));
		}, duration);
		timers.set(toast.id, timerId);
	};

	const removeToast = (id) => {
		timers.delete(id);
		dispatch(removeToast(id));
	};

	function ToastContainer() {
		return (
			<div className={styles['toasts-container']}>
				{state.toasts.map((toast) => (
					<Toast
						key={toast.id}
						toast={toast}
					/>
				))}
			</div>
		);
	}

	return [addToast, removeToast, ToastContainer];
}
