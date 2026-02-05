import "./Contact.css";
import "./App.css";
import Footer from "./Footer";
import SideCard from "./SideCard";
import api from "./Api"
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
function Contact() {

  const [firstname,setFirstname]=useState("");
  const [secondname,setSecondname]=useState("");
  const [email,setEmail]=useState("");
  const [subject,setSubject]=useState("");
  const [message,setMessage]=useState("");



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post("/contact/", {
      firstname,
      secondname,
      email,
      subject,
      message,
    });
    
     await api.post("/contact_email/email", {
      firstname,
      secondname,
      email,
      subject,
      message,
    });

    

    setFirstname("");
    setSecondname("");
    setEmail("");
    setSubject("");
    setMessage("");

    toast.success("Thanks for connecting! I will reply shortly 🙌");
  } catch (error) {
    console.error("Contact failed:", error);

   toast.error(
  error.response?.data?.detail || "Failed to send message"
);

  }
};






  return (
    <>
      <div className="container-detail">
        <SideCard/>
        <div className="details">
          <h1>Contact</h1>
          <p>Looking forward to hearing from you</p>
          <h3>Phone</h3>
          <p>+91 9381911235</p>
          <h3>Email</h3>
          <p>kiranpunna58@gmail.com</p>
        </div>

        <div className="form-detail" style={{ marginTop: "18px" }}>
          <form onSubmit={handleSubmit}>
            <div className="first-input">
              <div>
                <label htmlFor="first-name">First Name *</label>
                <input type="text" id="first-name" value={firstname}  
                onChange={(e)=>{setFirstname(e.target.value)}} required />
              </div>

              <div>
                <label htmlFor="last-name">Last Name *</label>
                <input type="text" id="last-name" value={secondname} 
                 onChange={(e)=>{setSecondname(e.target.value)}} required/>
              </div>
            </div>

            <div className="first-input" style={{ marginTop: "30px" }}>
              <div>
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" value={email}
                 onChange={(e)=>{setEmail(e.target.value)}} required />
              </div>

              <div>
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" value={subject}
                 onChange={(e)=>{setSubject(e.target.value)}} required />
              </div>
            </div>

            <div style={{ marginTop: "30px" }}>
              <label htmlFor="message">Message</label><br />
              <textarea id="text-area" rows="5"
               onChange={(e)=>{setMessage(e.target.value)}} value={message} required></textarea>
            </div>

            <div className="btn-div-contact">
              <button className="btn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <hr style={{ width: "93.5%", opacity: 0.3,margin:" auto"}} />

      <Footer />
    </>
  );
}

export default Contact;
