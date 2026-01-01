import "./App.css";

function Footer() {
  return (
    <footer className="container">
      <div>
        <b>Phone</b>
        <div>
          <img className="phone" src="/images/viber.png" alt="phone" />
          +91 9381911235
        </div>
      </div>

      <div>
        <b>Email</b>
        <div className="email">kiranpunna58@gmail.com</div>
      </div>

      <div>
        <div style={{ marginBottom: "15px" }}>
          <b>Follow Me On</b>
        </div>
        <div className="social-media">
          <a>
            <img src="/images/linkedin.png" alt="linkedin" />
          </a>
          <a>
            <img src="/images/github-sign.png" alt="github" />
          </a>
          <a>
            <img src="/images/instagram.png" alt="instagram" />
          </a>
        </div>
      </div>

      <div style={{ opacity: 0.6, fontSize: "15px" }}>
        ⓒ Kiran Punna 2025
      </div>
    </footer>
  );
}

export default Footer;
