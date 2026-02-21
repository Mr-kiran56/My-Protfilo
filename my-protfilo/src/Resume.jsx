import "./Resume.css"
import "./App.css"
import Footer from "./Footer";
import SideCard from "./SideCard";
import toast from "react-hot-toast";


function Resume(){
const baseURL = "/api";

function downloadWord() {
  window.location.href = `${baseURL}/download-word`;
  toast.success("Thanks! For Downloading my Resume")
}


    return(
        
        <>
       

    <div className="resume-container">
        {/* <SideCard/> */}

        <div className="btn-div">
        <button className="btn-resume" onClick={downloadWord}>Download Resume</button>
    </div>
    <h1 className="resume-title">Resume</h1>
        <div className="section">
            <h2 className="section-title">Work Experience</h2>
            <div className="content-card">
                <div className="job-header">
                    <div className="job-title">Infosys Springboard — AIML Intern</div>
                    <div className="job-duration">Nov 2025 – Present</div>
                </div>
                <ul>
                    <li>Built an end-to-end Medical Risk Classification and Personalized Diet Recommendation System using OCR-extracted    
clinical data with robust DVC pipelines for data versioning and reproducible preprocessing workflows.</li>
                    <li>Implemented ensemble models (XGBoost, Random Forest) achieving 99% accuracy, along with a pretrained BERT- 
based medical intent classifier for precise query understanding.</li>
                    <li>Designed a hallucination-free RAG framework with vector databases to generate personalized diet plans.</li>
                    <li>Built with MLOps readiness using GitHub Actions CI/CD and AWS for scalable deployment, monitoring,and 
continuous improvement. </li>

                </ul>
            </div>
        </div>

        
        <div className="section">
            <h2 className="section-title">Education</h2>
            <div className="content-card">
                <div className="job-header">
                    <div className="job-title">B.Tech (CSE–AI), Annamacharya Institute of Technology & Sciences</div>
                    <div className="job-duration">2023 – Present | CGPA: 9.3</div>
                </div>
            </div>
        </div>

       
        <div className="section">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
                <div className="skill-category">
                    <div className="skill-category-title">Programming Languages</div>
                    <div className="skills-list">
                        <span className="skill-tag">Python</span>
                        <span className="skill-tag">Java</span>
                        <span className="skill-tag">SQL</span>
                        <span className="skill-tag">JavaScript</span>
                    </div>
                </div>

                <div className="skill-category">
                    <div className="skill-category-title">Generative AI</div>
                    <div className="skills-list">
                        <span className="skill-tag">LLMs</span>
                        <span className="skill-tag">LangChain</span>
                        <span className="skill-tag">Hugging Face</span>
                        <span className="skill-tag">Prompt Engineering</span>
                        <span className="skill-tag">RAG</span>
                    </div>
                </div>

                <div className="skill-category">
                    <div className="skill-category-title">Databases</div>
                    <div className="skills-list">
                        <span className="skill-tag">PostgreSQL</span>
                        <span className="skill-tag">MySQL</span>
                        <span className="skill-tag">MongoDB</span>
                        <span className="skill-tag">Pinecone</span>
                        <span className="skill-tag">Chroma</span>
                    </div>
                </div>

                <div className="skill-category">
                    <div className="skill-category-title">Frameworks & Libraries</div>
                    <div className="skills-list">
                        <span className="skill-tag">PyTorch</span>
                        <span className="skill-tag">Scikit-learn</span>
                        <span className="skill-tag">NumPy</span>
                        <span className="skill-tag">Pandas</span>
                        <span className="skill-tag">Matplotlib</span>
                        <span className="skill-tag">Seaborn</span>
                        <span className="skill-tag">FastAPI</span>
                        <span className="skill-tag">Flask</span>
                        <span className="skill-tag">React</span>
                        <span className="skill-tag">Streamlit</span>
                    </div>
                </div>

                <div className="skill-category">
                    <div className="skill-category-title">Tools</div>
                    <div className="skills-list">
                        <span className="skill-tag">Git</span>
                        <span className="skill-tag">GitHub</span>
                        <span className="skill-tag">Postman</span>
                    </div>
                </div>

                <div className="skill-category">
                    <div className="skill-category-title">ML & Data Skills</div>
                    <div className="skills-list">
                        <span className="skill-tag">Machine Learning</span>
                        <span className="skill-tag">Deep Learning</span>
                        <span className="skill-tag">CNNs</span>
                        <span className="skill-tag">RNNs</span>
                        <span className="skill-tag">LSTMs</span>
                        <span className="skill-tag">Transformers</span>
                        <span className="skill-tag">NLP</span>
                        <span className="skill-tag">Data Visualization</span>
                        <span className="skill-tag">Data Preprocessing</span>
                    </div>
                </div>
            </div>
        </div>

     
        <div className="section">
            <h2 className="section-title">Achievements</h2>
            <div className="achievement-item">
                <div className="achievement-title">• ML Mania — National Level Tech Fest</div>
                <div className="achievement-desc">Secured 2nd place at Project Explore for the NoteCraft project</div>
            </div>
            <div className="achievement-item">
                <div className="achievement-title">• Touchstone Elocution Competition</div>
                <div className="achievement-desc">Winner of college-level elocution and essay writing competitions</div>
            </div>
            <div className="achievement-item">
                <div className="achievement-title">• Young Trucks Competition — Naukri</div>
                <div className="achievement-desc">Secured 98.5 percentile at the national level</div>
            </div>
            <div className="achievement-item">
                <div className="achievement-title">• ATF-ALGO Scholarship Program — Nationwide</div>
                <div className="achievement-desc">Achieved Top 7.8% in coding rounds and applications</div>
            </div>
        </div>
    </div>
       <hr className="br-line" style={{ margin:"auto"}} />
    <Footer/>
        
        </>

    );
}
export default Resume;