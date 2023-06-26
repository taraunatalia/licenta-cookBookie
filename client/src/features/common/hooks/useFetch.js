import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Store from '../../../store';

const fetchWrapper = (navigate, store) => ( url, options, showErrors = true)  => {
	const method = options?.method || 'GET';
	const body = options?.body;
	const token = localStorage.getItem('auth-token');
	return fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body,
	}).then(async (res) => {
		if (res.status !== 200) {
			const message = res.status === 500
				? 'Internal server error. Please try again later'
				: (await res.json())?.message;
			if (showErrors) {
				store.addToast({ message, type: 'error' });
			}
		}
		if (res.status === 401) {
			localStorage.clear();
			navigate('/login');
		} else if (res.status === 403) {
			navigate('/');
		}
		return res;
	}).catch((error) => {
		store.addToast({ message: 'Server error. Please try again later', type: 'error' });
		return error;
	});
};

export default function useFetch() {
	const navigate = useNavigate();
	const store = useContext(Store);
	return fetchWrapper(navigate, store);
}