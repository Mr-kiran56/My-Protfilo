import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from './Api'; // Import strictly for Auth if needed
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // --- NEW STATE FOR WELCOME ANIMATION ---
  const [welcomeText, setWelcomeText] = useState("How can I help you today?");
  const welcomeMessages = [
    "How can I help you today?",
    "Ask about Kiran's Projects...",
    "Ask about Kiran's Skills...",
    "I am Spirit AI, ready to assist!"
  ];

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null); 

  // --- WELCOME TEXT ANIMATION (Only runs when chat is empty) ---
  useEffect(() => {
    if (messages.length > 0) return; // Stop animation if chat started

    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % welcomeMessages.length;
      setWelcomeText(welcomeMessages[index]);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(intervalId);
  }, [messages.length]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Speech Recognition Setup - FIXED DUPLICATION
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        // Loop through ALL results from the beginning (index 0)
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Set the complete transcript (not appending to prev)
        setInputValue((finalTranscript + interimTranscript).trim());
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.log('Recognition restart prevented:', e);
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };
      
      recognitionRef.current.onerror = (e) => {
        console.error('Speech error:', e.error);
        if (e.error === 'no-speech' || e.error === 'audio-capture') {
          console.log('Recoverable error, continuing...');
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert('Speech Not Supported');
    
    if (isListening) {
      // STOP listening
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // START listening
      setInputValue(''); // Clear input before starting
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start recognition:', e);
        alert('Could not start voice recognition. Please try again.');
      }
    }
  };

  // --- MODIFIED SEND HANDLER TO ACCEPT OPTIONAL TEXT ---
  const handleSend = async (manualText = null) => {
    const textToSend = manualText || inputValue.trim();
    if (!textToSend) return;

    // Stop listening if currently active
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // 1. Add User Message
    const userMessage = { type: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true); // Show typing dots initially

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const username = localStorage.getItem('username') || 'Guest';
      const url = 'http://54.153.231.190/api/protfiloChatbot/profilechatbotResponce';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, question: textToSend }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) throw new Error("ReadableStream not supported.");

      const contentType = response.headers.get("content-type");

      // CASE A: JSON (Predefined Answer - Instant)
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setIsTyping(false);
        setMessages((prev) => [...prev, { type: 'bot', content: data.response }]);
      } 
      // CASE B: Streaming (Real-Time AI)
      else {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";
        let isFirstChunk = true;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode the chunk (stream: true handles incomplete bytes like emojis)
          const chunk = decoder.decode(value, { stream: true });
          
          if (chunk) {
             accumulatedText += chunk;

             if (isFirstChunk) {
               // 1. Hide Typing Dots
               setIsTyping(false);
               
               // 2. Create the Bot Message bubble with the first text
               setMessages((prev) => [...prev, { type: 'bot', content: accumulatedText }]);
               isFirstChunk = false;
             } else {
               // 3. Update the EXISTING message bubble (Real-time effect)
               setMessages((prev) => {
                 const newArr = [...prev];
                 const lastIndex = newArr.length - 1;
                 if (newArr[lastIndex].type === 'bot') {
                   // Append only to the last bot message
                   newArr[lastIndex] = { ...newArr[lastIndex], content: accumulatedText };
                 }
                 return newArr;
               });
             }
          }
        }
        
        // Final check if nothing came back
        if (isFirstChunk && !accumulatedText) {
           setIsTyping(false);
           setMessages((prev) => [...prev, { type: 'bot', content: "No response generated." }]);
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error:', error);
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: 'bot', content: "Something went wrong." }]);
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- RECOMMENDATION CHIPS ---
  const suggestions = [
    "Tell me about your projects",
    "What are your technical skills?",
    "How can I contact you?",
  ];

  return (
    <div className="chat-container">
      <div className="chat-messages" id="chatMessages">
        
        {/* --- WELCOME SCREEN (Only visible when no messages) --- */}
        {messages.length === 0 && (
          <div className="welcome-container">
      
            <h2 className="welcome-title">Hello, I'm Spirit AI</h2>
            <p className="welcome-subtitle">{welcomeText}</p>
            
            <div className="suggestions-grid">
              {suggestions.map((text, index) => (
                <button 
                  key={index} 
                  className="suggestion-chip"
                  onClick={() => handleSend(text)} // Send immediately on click
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- CHAT MESSAGES --- */}
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className="message-avatar">
              {msg.type === 'user' ? 'U' : 'AI'}
            </div>
            <div className="message-content">
              {msg.type === 'bot' ? (
                <ReactMarkdown>{msg.content || ''}</ReactMarkdown>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="message bot">
            <div className="message-avatar">AI</div>
            <div className="message-content" style={{ minWidth: '50px' }}>
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="input-container">
        <input
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isListening ? "🎤 Listening... (speak now)" : "Message Spirit AI..."}
          autoComplete="off"
          style={isListening ? { borderColor: '#ff4444', boxShadow: '0 0 8px rgba(255,68,68,0.5)' } : {}}
        />
        
        <button
          className={`icon-button mic-button ${isListening ? 'active' : ''}`}
          onClick={toggleListening}
          title={isListening ? 'Stop Listening' : 'Start Voice Input'}
        >
          {isListening ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 6h12v12H6z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
          )}
        </button>

        <button
          className="icon-button send-button"
          onClick={() => handleSend()}
          disabled={!inputValue.trim()}
          title="Send"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
        </button>
      </div>
    </div>
  );
}

export default Chatbot;