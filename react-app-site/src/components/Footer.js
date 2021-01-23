import { useState } from "react"
import ChatWindow from "./ChatWindow"

const Footer = () => {
	const [chatToggle, setChatToggle] = useState(sessionStorage.getItem('chatToggle') === "true" ? true : false);

	const toggleChat = () => {
		sessionStorage.setItem('chatToggle', !chatToggle);
		setChatToggle(!chatToggle);
	}
	return (
		<>
			<div className="navBar navFooter">
				<div className="navItem" id="navNameParent">
					<p className="navName" id="navName1">Juha Hakala</p>
					<p className="navName" id="navName2">jhakala</p>
				</div>
				<div className="navItem navChat" onClick={toggleChat}>
					Chat
				</div>
			</div>
			<ChatWindow chatToggle={chatToggle}/>
		</>
	)
}

export default Footer