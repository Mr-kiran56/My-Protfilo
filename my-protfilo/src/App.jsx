import { Routes, Route } from "react-router-dom";
import Intro from "./Intro";
import Contact from "./Contact";
import Navbar from "./Navbar";
import Background from "./Background";
import Chatbot from "./chatbot";
import Resume from "./Resume";
import Project  from "./Project";


function App() {
  return (
  <>
  <Background/>
  <Navbar />
  <Routes>
    <Route path="/" element={<Intro />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/resume" element={<Resume />} />
    <Route path="/project" element={<Project/>}
/>  
</Routes>
</>

  );
}

export default App;
