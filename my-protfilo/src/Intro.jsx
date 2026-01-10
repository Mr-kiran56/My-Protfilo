import "./Intro.css";
import "./App.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./Api";
import Footer from "./Footer";
import SideCard from "./SideCard";
import { getToken, getUserId } from "./auth";

function Intro({ ShowAlert }) {
  const [src_image, setSrcImage] = useState("/images/nolike.png");
  const upvoted_src = "/images/yeslike.png";

  
  const [profileLikes, setprofileLikes] = useState({
    total_profile_upvotes: 0
  });

  const Upvotes = async () => {
    try {
      const votes = await api.get("/profile_upvote/getall-upvotes");
      setprofileLikes(votes.data);
    } catch (error) {
      console.error("Error fetching upvotes:", error);
    }
  };

  const isUpVote = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await api.get("/profile_upvote/is_upvote", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.is_upvoted === true) {
        setSrcImage(upvoted_src);
      }
    } catch (err) {
      console.error("Error checking upvote status:", err);
    }
  };

  useEffect(() => {
    Upvotes();
    isUpVote();
  }, []);

  const [displayText, setDisplayText] = useState({ normal: "", highlight: "" });
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const sentences = [
    { normal: "Welcome to my AI-powered profile — ", highlight: "I'm Kiran Punna." },
    { normal: "I build intelligent, scalable solutions using ", highlight: "Machine Learning and Generative AI." },
    { normal: "Discover my technical journey, projects, and ", highlight: "problem-solving approach." },
    { normal: "Interact with my Spirit AI bot to get ", highlight: "detailed insights and information." }
  ];

  useEffect(() => {
    const current = sentences[sentenceIndex];
    const fullText = current.normal + current.highlight;
    const typedLength = displayText.normal.length + displayText.highlight.length;

    const timer = setTimeout(() => {
      if (!isDeleting && typedLength === fullText.length) {
        setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && typedLength === 0) {
        setIsDeleting(false);
        setSentenceIndex((prev) => (prev + 1) % sentences.length);
      } else {
        const newLength = isDeleting ? typedLength - 1 : typedLength + 1;

        const normalPart = fullText.slice(0, current.normal.length);
        const highlightPart = fullText.slice(current.normal.length);

        setDisplayText({
          normal: normalPart.slice(0, Math.min(newLength, normalPart.length)),
          highlight:
            newLength > normalPart.length
              ? highlightPart.slice(0, newLength - normalPart.length)
              : ""
        });
      }
    }, 8);

    return () => clearTimeout(timer);
  }, [displayText, sentenceIndex, isDeleting]);

  const PostUpvote = async () => {
    if (src_image === upvoted_src) {
      alert("You have already upvoted!");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("Please login to upvote!");
      window.location.href = "/login";
      return;
    }

    try {
      console.log("Sending upvote request...");
      
      const response = await api.post(
        "/profile_upvote/",
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Upvote response:", response.data);
      
      setSrcImage(upvoted_src);
      await Upvotes();
      alert(response.data.message || "Thanks for upvoting!");
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      } else if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Failed to upvote. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="sentence-container">
        <div className="animated-sentence">
          {displayText.normal}
          <span id="inner-text">{displayText.highlight}</span>
          <span className="cursor">|</span>
        </div>
      </div>

      <SideCard />

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
            <Link className="link" to="/resume" onClick={() => ShowAlert("resume")}>
              <li><div className="circle1">Resume</div></li>
            </Link>

            <Link className="link" to="/project">
              <li><div className="circle2">Projects</div></li>
            </Link>

            <Link className="link" to="/contact">
              <li><div className="circle3">Contact</div></li>
            </Link>
          </ul>
        </div>
      </div>

      <div className="profile-social-media">
        <div className="social-media-new">
          <a href="https://www.linkedin.com/in/kiran-punna-b50774330/" target="_blank" rel="noreferrer">
            <img src="/images/linkedin (1).png" alt="linkedin" />
          </a>

          <a href="https://github.com/Mr-kiran56" target="_blank" rel="noreferrer">
            <img src="/images/github.png" alt="github" />
          </a>

          <a href="https://leetcode.com/u/kiran_punna/" target="_blank" rel="noreferrer">
            <img src="/images/leetcode.png" alt="leetcode" />
          </a>

          <button className="upvote-wrapper"
            onClick={PostUpvote}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            
             
            }}
          >
            <img
              style={{ height: "40px", width: "40px" }}
              className="upvote"
              src={src_image}
              alt="star"
            />
          </button>

          <h6
          
          className="like-cmt" >
            {profileLikes.total_profile_upvotes}
            <span style={{ marginLeft: "14px" }}>
              Persons Liked This Profile
            </span>
          </h6>
        </div>
      </div>

      <hr className="br-line" style={{ margin: "auto" }} />
      <Footer />
    </>
  );
}

export default Intro;