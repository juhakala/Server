import axios from 'axios'

const Login = () => {
	axios.get('/api/login').then(resp => {
		console.log(resp.data);
	})
	return (
		<>
			<h2>Login page</h2>
		</>
	)
}

export default Login