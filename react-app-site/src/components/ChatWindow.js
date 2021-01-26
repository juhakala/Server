import "./../css/chat.css"
import upArrow from './../pics/arrow-up.png'
import downArrow from './../pics/arrow-down.png'
import { useEffect, useState } from "react"
import axios from 'axios'

const Message = ({ message }) => {
	const start = new Date(message.time);
	return (
		<li>
			<p>{start.toLocaleDateString("en-FI")} {start.toLocaleTimeString("fi-EN", {hour: '2-digit', minute:'2-digit'})}</p>
			<p>{message.content}</p>
			<p>-{message.author}</p>
			<p></p>
		</li>
	)

}

const ChatArea = ({ messages }) => {
	return (
		<div>
			<ul>
				{messages.map(message => <Message key={message.id} message={message}/>)}
			</ul>
		</div>
	)
}

const ChatHeader = ({ chatSizeToggle,handleChatSize }) => {
	return (
		<div className="chatHead">
			<div className="chatItem">
				<img className="chatHeadImg" src={chatSizeToggle ? downArrow : upArrow} onClick={handleChatSize} title="title" alt="alt"></img>
			</div>
		</div>
	)
}

const ChatWindow = ({ chatToggle }) => {
	const [chatSizeToggle, setChatSizeToggle] = useState(false);
	const [messages, setMessages] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get(`/api/messages/${messages.length}`);
			setMessages(messages.concat(result.data));
			console.log(messages.length);
			console.log(messages);
			console.log(result.data);
			console.log('messages got');
		}
		fetchData();
	}, []);

	const handleChatSize = () => {
		setChatSizeToggle(!chatSizeToggle);
	}
	const chatSizeClass = {
		"height": "100vh",
	}
	if (chatToggle === false)
		return null;
	return (
		<div className="chatWindow" style={chatSizeToggle ? chatSizeClass : null}>
			<ChatHeader chatSizeToggle={chatSizeToggle} handleChatSize={handleChatSize}/>
			<ChatArea messages={messages} />
		</div>
	)
}

export default ChatWindow