import { useCallback, useEffect, useState } from 'react';

export default function UserForm({
    user,
    setUser,
    setValid = () => { },
    initialUser = null,
    onErrorsChange = () => {},
    enterHandler = () => {},
}) {
    const [name, setName] = useState(initialUser?.name || '');
	const [email, setEmail] = useState(initialUser?.email || '');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [errors, setErrors] = useState({});
    const emailRegex = /^[a-zA-Z]+.*@.{3,}\..+$/;

    useEffect(() => {
		onErrorsChange(errors, {
			name,
			email,
			password,
			passwordConfirm,
		});
	}, [errors]);

    useEffect(() => {
		if (initialUser) {
			setName(initialUser?.name || '');
			setEmail(initialUser?.email || '');
		}
	}, [initialUser]);

    const handleNameChange = useCallback((e) => {
		setName(e.target.value);
		setUser({
			...user,
			name: e.target.value,
		});
	}, [user]);

    const handleEmailChange = useCallback((e) => {
		setEmail(e.target.value);
		let emailError = null;
		if (!emailRegex.test(e.target.value)) {
			emailError = 'Please enter a valid email address.';
		} else {
			setUser({
				...user,
				email: e.target.value,
			});
		}
		setErrors({
			...errors,
			email: emailError,
		});
	}, [user, errors]);

    const handlePasswordChange = useCallback((e) => {
		setPassword(e.target.value);
		let passwordError = null;
		let passwordConfirmError = null;
		if (e.target.value.length < 8) {
			passwordError = 'Password must be at least 8 characters long';
		} else {
			setUser({
				...user,
				password: e.target.value,
			});
		}
		if (passwordConfirm !== '' && e.target.value !== passwordConfirm) {
			passwordConfirmError = 'The passwords do not match.';
		}
		setErrors({
			...errors,
			password: passwordError,
			passwordConfirm: passwordConfirmError,
		});
	}, [user, errors]);

    const handlePasswordConfirmChange = useCallback((e) => {
		setPasswordConfirm(e.target.value);
		let passwordConfirmError = null;
		if (password !== e.target.value) {
			passwordConfirmError = 'The passwords do not match.';
		}
		setErrors({
			...errors,
			passwordConfirm: passwordConfirmError,
		});
	}, [errors]);

    useEffect(() => {
		if (name === '' || email === '' || password === '' || passwordConfirm === '') {
			setValid(false);
			return;
		}
		const anyError = Object.values(errors).reduce((prev, current) => {
			if (prev || current !== null) {
				return true;
			}
			return false;
		});
		setValid(!anyError);
	}, [name, email, password, passwordConfirm, errors]);

	const keyPressHandler = (e) => {
		if (e.key === 'Enter') {
			enterHandler();
		}
	};

    return (
        <>
        <div className="form-group">
				<label htmlFor="name">Nume</label>
				<input
					className="form-control"
					id="name"
					name="name"
					onChange={handleNameChange}
					onKeyPress={keyPressHandler}
					placeholder="Tărău Damaris"
					required
					type="text"
					value={name}
				/>
				<div className="spacer" />
			</div>
            <div className="form-group">
				<label htmlFor="email">Email</label>
				<input
					className="form-control"
					id="email"
					name="email"
					onChange={handleEmailChange}
					onKeyPress={keyPressHandler}
					placeholder="damaris@example.com"
					required
					type="email"
					value={email}
				/>
				<p className="error-message">{errors.email || ''}</p>
			</div>
            <div className="form-group">
				<label htmlFor="password">Parola</label>
				<input
					className="form-control"
					id="password"
					name="password"
					onChange={handlePasswordChange}
					onKeyPress={keyPressHandler}
					required
					type="password"
					value={password}
				/>
				<p className="error-message">{errors.password || ''}</p>
			</div>
            <div className="form-group">
				<label htmlFor="password">Confirmă Parola</label>
				<input
					className="form-control"
					id="passwordConfirm"
					name="passwordConfirm"
					onChange={handlePasswordConfirmChange}
					onKeyPress={keyPressHandler}
					required
					type="password"
					value={passwordConfirm}
				/>
				<p className="error-message">{errors.passwordConfirm || ''}</p>
			</div>
        </>
    )
}