import "./Sidecard.css";
import { useEffect } from "react";

function SideCard() {
  useEffect(() => {
    const existing = document.querySelector(".message-alert");
    if (existing) existing.remove();

    const alertBox = document.createElement("div");
    alertBox.className = "message-alert";


    alertBox.innerHTML = `
      <img class="ai-chat" src="/images/chat-ai.png" />
      <div class="alert-text">
        <b>Chat with SpiritAI</b>
        <p>Get to know me better</p>
      </div>
    `;

    alertBox.onclick = () => {
      window.open("/chatbot", "_blank");
    };

    document.body.appendChild(alertBox);
  }, []);

  return null;
}

export default SideCard;
