import "./Intro.css";
import "./App.css"
import { useState, useEffect } from "react";

import Footer from "./Footer";
import { Link } from "react-router-dom";
import SideCard from "./SideCard";
function Intro({ShowAlert}) {
  
  const [displayText, setDisplayText] = useState('');
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const sentences = [
    "Welcome to my AI-powered profile — I'm Kiran Punna.",
    "I build intelligent, scalable solutions using Machine Learning and Generative AI.",
    "Discover my technical journey, projects, and problem-solving approach.",
    "Interact with my personal AI bot to get detailed insights and information."
  ];

  useEffect(() => {
    const currentSentence = sentences[sentenceIndex];
    const typingSpeed = isDeleting ? 10 : 12;
    const pauseBeforeDelete = 3000;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentSentence) {
        setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setSentenceIndex((prev) => (prev + 1) % sentences.length);
      } else if (isDeleting) {
        setDisplayText(currentSentence.substring(0, displayText.length - 1));
      } else {
        setDisplayText(currentSentence.substring(0, displayText.length + 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, sentenceIndex, isDeleting]);

  return (
    <>
      <div className="sentence-container">
        <div className="animated-sentence">
          {displayText}
          <span className="cursor">|</span>
        </div> 
      </div>
      <SideCard/>
      
      <div className="main">
      
       
        <div className="profile"></div>

        <div className="main-content">
          <h1>Hii I'm Kiran Punna</h1>
          <p className="about-bit">A Bit About Me</p>
          <p className="about-me">
            3rd-year BTech student specializing in Machine Learning, Deep Learning,
            and Generative AI, focused on building intelligent, real-world solutions
            with measurable impact.
          </p>

          <ul className="circles">
            <Link  onClick={()=>ShowAlert('resume')} className="link" to="/resume"><li> <div className="circle1">Resume</div></li></Link>
                   <Link to="/project" className="link">    <li><div className="circle2">Projects</div></li></Link>
                          <Link to="/contact" className="link">    <li><div className="circle3">Contact</div></li></Link>
         
        
          </ul>
        </div>
      </div>

      <hr className="br-line" style={{ margin:"auto"}} />

      <Footer/>
    </>
  );
}

export default Intro;