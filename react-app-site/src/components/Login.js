import axios from 'axios'
import { useState } from 'react';
import './../css/login.css';

const Form = () => {
	const [email, setEmail] = useState('');
	const [passwd, setPasswd] = useState('');
	const updateEmail = (event) => {
		setEmail(event.target.value);
	}
	const updatePasswd = (event) => {
		setPasswd(event.target.value);
	}
	const loginSubmit = async event => {
		event.preventDefault();
		const data = {
			email: email,
			passwd: passwd
		}
		axios
			.post('/api/login', data)
			.then(resp => {
//				if (resp)
//				setToken(resp.data);
//				console.log(resp);
				console.log('data', resp.data);
			})
			.catch(err => {
				console.log('err', err);
			})
		console.log('data', data);
	}
	return (
		<div className='loginFormWrap'>
			<form onSubmit={loginSubmit}>
				<input type='email' placeholder='email@host.com' onChange={updateEmail} />
				<br />
				<input type='password' placeholder='***' onChange={updatePasswd} />
				<br />
				<input className='inputHover' type='submit' placeholder='SUBMIT' />
			</form>
		</div>
	)
}

const Login = () => {
//	axios.get('/api/login').then(resp => {
//		console.log(resp.data);
//	})
	return (
		<div className='loginContainer'>
			<div className='loginWrap'>
				<Form />
			</div>
		</div>
	)
}

export default Login
