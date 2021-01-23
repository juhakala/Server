import "./../css/chat.css"
import upArrow from './../pics/arrow-up.png'
import downArrow from './../pics/arrow-down.png'
import { useState } from "react"


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
		</div>
	)
}

export default ChatWindow