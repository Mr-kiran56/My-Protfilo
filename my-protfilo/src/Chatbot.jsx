import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from './Api';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputValue('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    const message = inputValue.trim();
    if (!message) return;

    // Add user message
    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Get username from localStorage or use default
      const username = localStorage.getItem('username') || 'guest';

      console.log('📤 Sending request:', { userName: username, question: message });

      // Call API endpoint
      const response = await api.post('/protfiloChatbot/profilechatbotResponce', {
        userName: username,
        question: message,
      });

      console.log('📥 Received response:', response.data);

      // Extract bot response safely
      let botContent = '';
      
      if (!response.data) {
        botContent = 'Sorry, I received an empty response.';
      } else if (typeof response.data === 'string') {
        botContent = response.data;
      } else if (response.data.response) {
        botContent = response.data.response;
      } else if (response.data.messages && response.data.messages.length > 0) {
        const lastMessage = response.data.messages[response.data.messages.length - 1];
        botContent = typeof lastMessage === 'string' ? lastMessage : lastMessage.content || JSON.stringify(lastMessage);
      } else {
        botContent = 'I received your message but had trouble formatting the response.';
      }
      
      console.log('✅ Bot content:', botContent);

      // Add bot response
      const botMessage = { 
        type: 'bot', 
        content: botContent
      };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('❌ Error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      const errorMessage = { 
        type: 'bot', 
        content: `Sorry, I encountered an error: ${error.response?.data?.detail || error.message || 'Please try again.'}` 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" id="chatMessages">
        {/* Welcome message */}
        <div className="welcome-message">
          <h2>Welcome to Spirit AI Assistant</h2>
          <p>How can I help you today?</p>
        </div>

        {/* Message list */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.type}`}
          >
            <div className="message-avatar">
              {msg.type === 'user' ? 'U' : 'AI'}
            </div>
            <div className="message-content">
              {msg.type === 'bot' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="message bot">
            <div className="message-avatar">AI</div>
            <div className="message-content">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input container */}
      <div className="input-container">
        <input
          type="text"
          className="chat-input"
          id="chatInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          autoComplete="off"
          disabled={isListening}
        />
        <button
          className="mic-button"
          onClick={toggleListening}
          style={{
            backgroundColor: isListening ? '#ff4444' : '#666',
            color: 'white',
            marginTop: '3px',
            height: '40px',
            width: '40px',
            borderRadius: '20px',
            fontSize: '18px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isListening ? 'Stop listening' : 'Start voice input'}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        >
          🎤
        </button>
        <button
          className="send-button"
          id="sendButton"
          onClick={handleSend}
          disabled={!inputValue.trim() || isListening}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;