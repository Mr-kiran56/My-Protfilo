import "./Sidecard.css";
import { useEffect } from "react";
import "./App.css"
import { Link } from "react-router-dom";
import "./Intro.css"
function SideCard() {

useEffect(() => {
  const existing = document.querySelector(".message-alert");
  if (existing) existing.remove();

  const alertBox = document.createElement("div");
  alertBox.className = "message-alert";

  alertBox.innerHTML = `
    <div class="alert-text" style="cursor:pointer">
      <div>
        <img class="ai-chat" src="/images/chat-ai.png" />
      </div>
      <b>Chat With SpiritAI</b>
      <p style="margin-left:60px">Get To Know me..</p>
    </div>
  `;

 alertBox.onclick = () => {
  window.open("/chatbot", "_blank");
};
  document.body.appendChild(alertBox);
}, []);

}

export default SideCard;
