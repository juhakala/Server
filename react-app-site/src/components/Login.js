import axios from 'axios'
import './../css/login.css';

const Login = () => {
	axios.get('/api/login').then(resp => {
		console.log(resp.data);
	})
	return (
		<div className='loginContainer'>
			<div className='loginWrap'>

			</div>
		</div>
	)
}

export default Login