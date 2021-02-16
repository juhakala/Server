import "./../css/home.css"
import gitD from './../pics/icon-git-dark.png'
import linkL from './../pics/icon-link.png'
import spotG from './../pics/icon-spotify.png'

const Icon = ({ src, message, link }) => {
	return (
		<div className='hoverIcon' onClick={()=> window.open(link, "_blank")}>
			<div className='card'>
				<div className='iconWhite'>
					<img className='icon' src={src} />
				</div>
			</div>
			<div className='hidden'>
				<div className='message'>
					<p>{message}</p>
				</div>
			</div>
		</div>
	)
}

const Icons = () => {
	const git = 'Link to my Github';
	const lin = 'Link to my Linkedin';
	const spo = 'Playlist while I work';

	return (
		<div className='iconWrap'>
			<div className='overWrap'>
				<Icon src={gitD} message={git} link='https://github.com/juhakala' />
				<Icon src={linkL} message={lin} link='https://www.linkedin.com/in/hakala-juha/' />
				<Icon src={spotG} message={spo} link='https://open.spotify.com/playlist/37i9dQZF1DX692WcMwL2yW?si=phdSG5IhRoeTlMOLuWBHng' />
			</div>
		</div>
	)
}

const Item = ({ item }) => {
	var style = item.done === 0 ? 'title': 'notDone';
	style = item.done === 1 ? 'done' : style;
	return (
		<li className={style}>
			{item.content}
		</li>
	)
}
const Home = () => {
	// 0-head, 1-done, 2-not done 
	const todo = [
		{done: 0, content: 'Chat'},
		{done: 1, content: 'connect and disconnect from socket.io server with open and close'},
		{done: 1, content: 'fetch/show messages from database'},
		{done: 1, content: 'write messages'},
		{done: 1, content: 'Scroll down on new message'},
		{done: 1, content: 'injection/xss protection'},
		{done: 2, content: 'get author from login'},
		{done: 2, content: 'report button for messages'},
		{done: 0, content: 'Map'},
		{done: 1, content: 'feth from database'},
		{done: 1, content: 'zoom/move with mouse'},
		{done: 1, content: 'fullscreen on/off db-click'},
		{done: 1, content: 'start on whole map/center'},
		{done: 2, content: 'show all maps'},
		{done: 0, content: 'Map-processing'},
		{done: 1, content: 'update map with data from app'},
		{done: 1, content: 'draw just 5km radius from home (ATM jsut 1 base map)'},
		{done: 1, content: 'make more maps if location outside of current map'},
		{done: 0, content: 'Android app (kotlin/java)'},
		{done: 1, content: 'get location data'},
		{done: 1, content: 'store location data until send to server'},
		{done: 1, content: 'send location data to server'},
		{done: 0, content: 'Login'},
		{done: 1, content: 'generate jwt-access-token'},
		{done: 1, content: 'generate jwt-refresh-token'},
		{done: 2, content: 'redirect/hide login page'},
		{done: 0, content: 'Admin'},
		{done: 2, content: 'see token(s)'},
		{done: 2, content: 'delete token(s)'},
		{done: 2, content: 'show reported messages'},
		{done: 2, content: 'delete/accept reported messages'},
		{done: 0, content: 'Server Loggin'},
		{done: 2, content: 'stdout (atm. map updates)'},
		{done: 2, content: 'stderr'},
		{done: 1, content: 'log server events to page'},
		{done: 2, content: 'realtime update'},
		{done: 0, content: 'General ideas/fixes'},
		{done: 2, content: 'start chat at bottom and dont scroll down on new messages when reading upper messages'},
		{done: 2, content: 'css the sh*t out of the pages(no bootstrap or other libraries, since that would be too easy)'},
		{done: 2, content: 'add resume/about me page'},
		{done: 2, content: 'add suggestion box? or is chat enought'}

	]
	return (
		<>
		<div className='homeWrap'>
			<div className='aboutWrap'>
				<h1>About this site:</h1>
				<p>
				<strong>Frontend:</strong> Javascript and React.<br />
				<strong>Backend:</strong> Nodejs and Python.<br />
				<strong>Database:</strong> MySQL.<br />
				Running on Raspberry Pi 4 model B.<br />
				<strong>Map:</strong> Plotting location points to black background thus slowly drawing map of helsinki area.<br />
				Updating as I learn and have time.</p>
			</div>
			<div className='todoWrap'>
				<h1>To-do:</h1>
				<ul className='list'>
					{todo.map((item,i) => <Item key={i} item={item} />)}
				</ul>
			</div>
			<Icons />
		</div>
		</>
	)
}

export default Home
