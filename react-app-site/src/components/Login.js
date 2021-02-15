import axios from 'axios'
import './../css/login.css';

const Login = () => {
	axios.get('/api/login').then(resp => {
		console.log(resp.data);
	})
	return (
		<div className='loginContainer'>
			<div className='loginWrap'>
				<p>in next major update</p>
			</div>
		</div>
	)
}

export default Login
