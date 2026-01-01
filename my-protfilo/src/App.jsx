import { Routes, Route } from "react-router-dom";
import Intro from "./Intro";
import Contact from "./Contact";
import Navbar from "./Navbar";
import Background from "./Background";
import Footer from "./Footer"
import Chatbot from "./chatbot";

function App() {
  return (
  <>
  <Background/>
  <Navbar />
  <Routes>
    <Route path="/" element={<Intro />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/chatbot" element={<Chatbot />} />
  </Routes>
</>

  );
}

export default App;
