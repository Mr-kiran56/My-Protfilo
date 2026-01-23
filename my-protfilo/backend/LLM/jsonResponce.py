
def  responceJson(intent:str,rdi:int):
    RESPONSES = {

    "greeting": [
        "Hello! 👋 How can I help you today?",
        "Hi there! Feel free to explore my portfolio.",
        "Hey! What would you like to know?",
        "Hello! I'm here to assist you.",
        "Hi! Ask me anything about my work or skills.",
        "Hey there! How can I support you today?",
        "Welcome! Let me know what you're looking for.",
        "Hi! Happy to help 😊",
        "Hello! What brings you here today?",
        "Hey! Let’s get started."
    ],

    "casual_chat": [
        "I'm doing great, thanks for asking!",
        "All good here. How about you?",
        "I'm here and ready to help 😊",
        "Doing well! What’s up?",
        "Everything’s going smoothly.",
        "Feeling productive today 🚀",
        "All set and available!",
        "Going great so far!",
        "Pretty good! How can I help?",
        "Always ready to assist."
    ],

    "farewell": [
        "Goodbye! Thanks for visiting 👋",
        "See you later!",
        "Bye! Feel free to return anytime.",
        "Take care and have a great day!",
        "It was nice chatting with you.",
        "Catch you later!",
        "Wishing you all the best!",
        "Thanks for stopping by!",
        "Have a wonderful day ahead!",
        "Hope to see you again soon."
    ],

    "about_bot": [
        "I'm a smart portfolio chatbot.",
        "I help answer questions quickly and efficiently.",
        "I'm designed to assist with portfolio exploration.",
        "I handle both quick replies and detailed queries.",
        "I'm built to improve user experience.",
        "I guide visitors through projects and skills.",
        "Think of me as a virtual assistant.",
        "I reduce response time for common questions.",
        "I combine intent detection and AI responses.",
        "I'm here to make things easier for you."
    ],

    "about_owner": [
        "This chatbot represents my developer’s portfolio.",
        "The creator is passionate about AI and web development.",
        "Built by a full-stack and ML enthusiast.",
        "Created as a professional portfolio project.",
        "Developed to showcase real-world skills.",
        "My owner enjoys building intelligent systems.",
        "Designed with scalability and performance in mind.",
        "This reflects hands-on technical experience.",
        "Built for recruiters and collaborators.",
        "A showcase of practical engineering skills."
    ],

    "skills": [
        "Skilled in full-stack web development.",
        "Experienced in machine learning and AI.",
        "Comfortable with frontend and backend systems.",
        "Works with modern web frameworks.",
        "Strong foundation in Python and JavaScript.",
        "Experienced with APIs and databases.",
        "Focuses on clean and scalable code.",
        "Hands-on experience with ML models.",
        "Skilled in deployment and integration.",
        "Always learning new technologies."
    ],

    "projects": [
        "Several AI and web projects are showcased.",
        "Projects solve real-world problems.",
        "Includes full-stack applications.",
        "AI-powered tools are featured.",
        "Projects demonstrate practical skills.",
        "Each project has detailed explanations.",
        "Built using modern technologies.",
        "Focus on performance and usability.",
        "Both frontend and backend projects included.",
        "Feel free to explore the project section."
    ],

    "contact": [
        "You can contact me via email at {{EMAIL}}.",
        "Feel free to connect with me on LinkedIn: {{LINKEDIN_URL}}",
        "For professional inquiries, reach out at {{EMAIL}}.",
        "You can find my LinkedIn profile here: {{LINKEDIN_URL}}",
        "The best way to contact me is email or LinkedIn.",
        "Reach out anytime via {{EMAIL}} or LinkedIn.",
        "I’m open to professional connections on LinkedIn.",
        "For collaborations, email me at {{EMAIL}}.",
        "All contact details are available on LinkedIn.",
        "Feel free to get in touch anytime!"
    ],

    "resume": [
        "My resume is available for review.",
        "You can download the resume from the portfolio.",
        "The CV highlights skills and experience.",
        "Resume includes projects and education.",
        "Feel free to request the resume.",
        "A detailed resume is provided.",
        "The CV reflects hands-on work.",
        "Resume link is available on request.",
        "You can view my professional resume.",
        "Let me know if you’d like the CV."
    ],

    "internship": [
        "Open to internship opportunities.",
        "Actively looking for learning opportunities.",
        "Interested in hands-on industry experience.",
        "Open to challenging roles.",
        "Motivated to grow professionally.",
        "Eager to apply real-world skills.",
        "Looking for impactful work.",
        "Available for internships and roles.",
        "Interested in collaborative environments.",
        "Ready to contribute and learn."
    ],

    "thanks": [
        "You're welcome! 😊",
        "Happy to help!",
        "Glad I could assist.",
        "Anytime!",
        "No problem at all.",
        "Always here to help.",
        "My pleasure!",
        "Thanks for reaching out!",
        "Glad it helped!",
        "Feel free to ask more."
    ],

    "help": [
        "Sure! How can I help?",
        "Tell me what you need.",
        "I'm here to assist you.",
        "Let me know your question.",
        "Happy to guide you.",
        "Ask me anything.",
        "What can I help you with?",
        "I’m ready when you are.",
        "Let’s solve it together.",
        "How may I assist you today?"
    ]
    }

    return RESPONSES[intent][rdi]
