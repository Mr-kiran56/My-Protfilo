import { Routes, Route } from "react-router-dom";
import Intro from "./Intro";
import Contact from "./Contact";
import Navbar from "./Navbar";
import Background from "./Background";
import Chatbot from "./Chatbot";
import Resume from "./Resume";
import Project  from "./Project";
import { useState } from "react";
import Alert from "./Alert";


function App() {

  const [alert, setalert] = useState(null);
  const ShowAlert=(messege)=>{

    setalert({msg:messege})

setTimeout(() => {
  setalert(null)
  
}, 2000);

  }




  return (
  <>
  <Background/>
  <Navbar />
  <Alert alert={alert}/>
  <Routes>

    <Route path="/" element={<Intro ShowAlert={ShowAlert} />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/resume" element={<Resume />} />
    <Route path="/project" element={<Project/>}/>

    <Route path="/chatbot" element={<Chatbot/>}/>

</Routes>
</>

  );
}

export default App;
