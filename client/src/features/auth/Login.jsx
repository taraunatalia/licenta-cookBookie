import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from '../common/page-container/PageContainer';
import styles from './auth.module.scss';

export default function Login(){
    const [email, setEmail]= useState('');
    const [ password, setPassword]= useState('');
    const [fetching, setFetching] = useState(false);
    const navigate = useNavigate();

    useEffect(()=> {// daca is logat merg in home
        if(localStorage.getItem('auth-token')){
            navigate('/');
        }
    }, []
    )

    async function login (){
        if(fetching){
            return;
        }
        setFetching(true);
        const credentials = {
            email,
            password
        };
        const res = await fetch('http://localhost:8080/auth/signin' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
        });
        setFetching(false);
        if(res.status === 200){
            const rasp = await res.json();
            localStorage.setItem('auth-token', rasp.token);//salvez token
            //localStorage.setItem('isAdmin', role.isAdmin);
            navigate('/');
        }
        
    }
    const keyPressHandler = (e) => {
		if (e.key === 'Enter') {
			login();
		}
	};

    return (
        <PageContainer
          fillHeight
          loggedIn={false}
          >
        <div className={styles['auth-container']} >
            <h2 className={styles.title} >Login</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
						className="form-control"
						id="email"
						name="email"
						onChange={(e) => setEmail(e.target.value)}
						onKeyPress={keyPressHandler}
						placeholder="damaris@example.com"
						required
						type="email"
						value={email}
					/>
            </div>
            <div className="form-group">
					<label htmlFor="password">Parola</label>
					<input
						className="form-control"
						id="password"
						name="password"
						onChange={(e) => setPassword(e.target.value)}
						onKeyPress={keyPressHandler}
						required
						type="password"
						value={password}
					/>
					<div className="spacer" />
				</div>
                <div className="form-actions">
					<button
						className="primary-action primary-btn"
						disabled={fetching}
						onClick={login}
						type="submit"
					>
						Login
					</button>
					<p className="secondary-action">
						<Link to="/register">Înregistrare</Link>
						{' '}
					
					</p>
				</div>
        </div>
        </PageContainer>
    )


}
