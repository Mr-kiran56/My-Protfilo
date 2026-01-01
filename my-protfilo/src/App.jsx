import { Routes, Route } from "react-router-dom";
import Intro from "./Intro";
import Contact from "./Contact";
import Navbar from "./Navbar";
import Background from "./Background";
import Footer from "./Footer"

function App() {
  return (
  <>
  <Background/>
  <Navbar />
  <Routes>
    <Route path="/" element={<Intro />} />
    <Route path="/contact" element={<Contact />} />
  </Routes>
</>

  );
}

export default App;
