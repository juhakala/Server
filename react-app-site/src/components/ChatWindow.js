import "./../css/chat.css"
import miniU from './../pics/miniU.png'
import upArrow from './../pics/arrow-up.png'
import downArrow from './../pics/arrow-down.png'
import { useEffect, useState } from "react"
import axios from 'axios'
import React from 'react';
import {socket} from "./../services/Socket";


const ChatWrite = ({ socket }) => {
	const keyboardEvents = (event) => {
		event.persist();
		if (event.key === 'Enter') {
			if (!event.shiftKey) {
				event.preventDefault();
				if (event.target.value.trim()) {
					socket.emit('chat', event.target.value);
					event.target.value = "";
				}
			}
		}
	}
	return (
		<div className="chatWrite">
			<textarea onKeyPress={keyboardEvents}></textarea>
		</div>
	)
}

const Message = ({ message }) => {
	const start = new Date(message.send_date);
	return (
		<li className="left"><span className="pull-left">
				<img src={miniU} alt="User Avatar" className="img-circle" />
			</span>
			<div className='chat-body'>
				<div>
					<strong className="name">{message.author}</strong><small className="pull-right text-muted">
						<span className="clock">&#128346;</span>{start.toLocaleDateString("en-FI")} {start.toLocaleTimeString("fi-EN", {hour: '2-digit', minute:'2-digit'})}</small>
				</div>
				<p>{message.content}</p>
			</div>
		</li>
	)

}

const ChatArea = ({ socket }) => {
	const [messages, setMessages] = useState([]);
	const [more, setMore] = useState(true);
	useEffect(() => {
		axios
			.get('/api/messages/0')
			.then(resp => {
				setMessages(resp.data);
			});
	}, []);

	useEffect(() => {
		socket.on('addmessage', (data) => { addToMessages(data); })
		return () => socket.removeListener('addmessage');
	}, [messages]);

	function addToMessages(data) {
		setMessages(messages.concat(data));
		document.getElementsByClassName('chatArea')[0].scroll({ top: document.getElementsByClassName('chatArea')[0].scrollHeight + 1000, behavior: 'smooth' });
	}

	const loadMoreMessages = () => {
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
		<div className="chatArea">
			<div className="loadBtnDiv">
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
	
	useEffect(() => {
	if (chatToggle === true) {
		socket.connect();
		socket.on('connection', (resp) => {
			console.log('connected with :', resp.numClients);
		});
	} else {
		socket.removeAllListeners();
		socket.disconnect();
	}
}, [chatToggle]);
	const chatSizeClass = {
		"height": "100vh",
	}
	if (chatToggle === false)
		return null;
	return (
		<div className="chatWindow" style={chatSizeToggle ? chatSizeClass : null}>
			<ChatHeader chatSizeToggle={chatSizeToggle} handleChatSize={handleChatSize}/>
			<ChatArea socket={socket}/>
			<ChatWrite socket={socket}/>
		</div>
	)
}

export default ChatWindow