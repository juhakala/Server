import "./../css/chat.css"
import upArrow from './../pics/arrow-up.png'
import downArrow from './../pics/arrow-down.png'
import { useEffect, useState } from "react"
import axios from 'axios'
import React from 'react';

const Message = ({ message }) => {
//	console.log(message);
	const start = new Date(message.send_date);
	return (
		<li>
			<div className='chatMessage'>
				<p>{start.toLocaleDateString("en-FI")} {start.toLocaleTimeString("fi-EN", {hour: '2-digit', minute:'2-digit'})}</p>
				<p>{message.content}</p>
				<p>-{message.author}</p>
			</div>
		</li>
	)

}

const ChatArea = () => {
	const [messages, setMessages] = useState([]);
	const [more, setMore] = useState(true);
	useEffect(() => {
		axios
			.get('/api/messages/0')
			.then(resp => {
				setMessages(resp.data);
			});
	}, []);

	const loadMoreMessages = () => {
		console.log('loading');
		axios
			.get(`/api/messages/${messages.length}`)
			.then(resp => {
				if (resp.data.length === 0)
					setMore(false);
				else
					setMessages(resp.data.concat(messages));
			});
	}

	return (
		<div>
			<div>
				{more === true ? <p className='chatLoadBtn' onClick={loadMoreMessages}>load more</p> : <p className='chatLoadBtn'>all loaded</p>}
			</div>
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
			<ChatArea />
		</div>
	)
}

export default ChatWindow