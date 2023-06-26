import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Store from '../../store';
import PageContainer from '../common/page-container/PageContainer';
import UserForm from '../users/UserForm';
import styles from './auth.module.scss';

export default function Register(){
    const navigate = useNavigate();
	const [fetching, setFetching] = useState(false);
	//const customFetch = useFetch();
    const [validForm, setValidForm] = useState(false);
    const [user, setUser] = useState({});
	const store = useContext(Store);
    
    useEffect(() => {
        if (localStorage.getItem('auth-token')) {
			navigate('/');
		}
	}, []);

    const submitForm = async () => {
		 if (!validForm || fetching) {
		 	return;
		 }
		setFetching(true);
        const res = await fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        });
		setFetching(false);
        if(res.status === 200){
            store.addToast({ message: 'Contul a fost creat cu succes!', type: 'success' });
			const result = await res.json();
			localStorage.setItem('auth-token', result.token);
			localStorage.setItem('isAdmin', false);
			navigate('/');
        }
    };

    return (
		<PageContainer
			fullHeight
			loggedIn={false}
		>
        <div className={styles['auth-container']}>
				<h2 className={styles.title}>Înregistrare</h2>
				<UserForm
					enterHandler={submitForm}
					setUser={setUser}
					setValid={setValidForm}
					user={user}
				/>
				<div className="form-actions">
					<button
						className="primary-action primary-btn"
						disabled={!validForm || fetching}
						onClick={submitForm}
						type="submit"
					>
						Înregistrare
					</button>
					<p className="secondary-action">
						<Link to="/login">Log in</Link>
						{' '}
						
					</p>
				</div>
			</div>
			</PageContainer>
    )
}