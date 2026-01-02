import "./Contact.css";
import "./App.css";
import Footer from "./Footer";
import SideCard from "./SideCard";

function Contact() {
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
          <form>
            <div className="first-input">
              <div>
                <label htmlFor="first-name">First Name *</label>
                <input type="text" id="first-name" />
              </div>

              <div>
                <label htmlFor="last-name">Last Name *</label>
                <input type="text" id="last-name" />
              </div>
            </div>

            <div className="first-input" style={{ marginTop: "30px" }}>
              <div>
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" />
              </div>

              <div>
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" />
              </div>
            </div>

            <div style={{ marginTop: "30px" }}>
              <label htmlFor="message">Message</label><br />
              <textarea id="text-area" rows="5"></textarea>
            </div>

            <div className="btn-div">
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
