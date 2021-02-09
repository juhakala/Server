import "./../css/home.css"

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
		{done: 2, content: 'nothing yet'},
		{done: 0, content: 'Admin'},
		{done: 2, content: 'show reported messages'},
		{done: 2, content: 'delete/accept reported messages'},
		{done: 0, content: 'Server Loggin'},
		{done: 2, content: 'stdout'},
		{done: 2, content: 'stderr'},
		{done: 2, content: 'log server events to page'},
		{done: 2, content: 'realtime update'}

	]
	return (
		<>
			<div className='aboutWrap'>
				<h1>About this site:</h1>
				<p>
				<strong>Frontend:</strong> Javascript and React.<br />
				<strong>Backend:</strong> Nodejs and Python.<br />
				<strong>Database:</strong> MySQL.<br />
				Own server running on Raspberry Pi 4 for learning.<br />
				<strong>Map:</strong> Placing my location points to black background thus slowly drawing map of helsinki area.<br />
				Updating as I learn and have time.</p>
			</div>
			<div className='todoWrap'>
				<h1>To-do:</h1>
				<ul className='list'>
					{todo.map((item,i) => <Item key={i} item={item} />)}
				</ul>
			</div>
		</>
	)
}

export default Home
