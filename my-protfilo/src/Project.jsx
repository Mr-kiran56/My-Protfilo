import Footer from "./Footer";
import "./Project.css";
import "./App.css"

export default function Projects() {
  return (
    <>
 
      <div className="projects-container" id="projects">
        <h1 className="projects-title">Projects</h1>

        {/* Project 1 */}
        <div className="project-card">
          <div className="project-content">
            <div className="project-image-container">
              <img
                src="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop"
                alt="WildVision"
                className="project-image"
              />
              <div className="project-image-overlay"></div>
            </div>

            <div className="project-info">
              <div className="project-number">01</div>
              <h2 className="project-title">
                WildVision — Real-Time Animal Detection
              </h2>

              <p className="project-description">
                A real-time animal detection system identifying 95+ animal
                species with 97% accuracy using CNN models. Built with PyTorch
                and Flask, streaming live camera input with a responsive UI.
              </p>

              <div className="project-tech">
                <div className="project-tech-label">Tech Stack</div>
                <div className="tech-stack">
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">PyTorch</span>
                  <span className="tech-tag">Flask</span>
                  <span className="tech-tag">OpenCV</span>
                  <span className="tech-tag">HTML/CSS</span>
                  <span className="tech-tag">Bootstrap</span>
                  <span className="tech-tag">NumPy</span>
                  <span className="tech-tag">Pandas</span>
                </div>
              </div>

              <div className="project-actions">
                <a className="action-btn">
                  <img src="https://cdn-icons-png.flaticon.com/128/709/709612.png" />
                </a>
                <a className="action-btn">
                  <img src="https://cdn-icons-png.flaticon.com/128/6062/6062646.png" />
                </a>
                <a className="action-btn">
                  <img src="https://cdn-icons-png.flaticon.com/128/1041/1041916.png" />
                </a>
                <a className="action-btn like">
                  <img src="https://cdn-icons-png.flaticon.com/128/2589/2589175.png" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Project 2 */}
        <div className="project-card">
          <div className="project-content">
            <div className="project-image-container">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
                className="project-image"
              />
              <div className="project-image-overlay"></div>
            </div>

            <div className="project-info">
              <div className="project-number">02</div>
              <h2 className="project-title">
                NoteCraft — AI-Powered Note Generator
              </h2>

              <p className="project-description">
                Intelligent note-taking app that generates structured notes
                using NLP with smart summarization and tagging.
              </p>

              <div className="project-tech">
                <div className="project-tech-label">Tech Stack</div>
                <div className="tech-stack">
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">NLP</span>
                  <span className="tech-tag">TensorFlow</span>
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">Node.js</span>
                  <span className="tech-tag">MongoDB</span>
                </div>
              </div>

              <div className="project-actions">
                <a className="action-btn">
                  <img src="https://cdn-icons-png.flaticon.com/128/709/709612.png" />
                </a>
                <a className="action-btn">
                  <img src="https://cdn-icons-png.flaticon.com/128/6062/6062646.png" />
                </a>
                <a className="action-btn">
                  <img src="https://cdn-icons-png.flaticon.com/128/1041/1041916.png" />
                </a>
                <a className="action-btn like">
                  <img src="https://cdn-icons-png.flaticon.com/128/2589/2589175.png" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

       <hr className="br-line" style={{ margin:"auto"}} />

    <Footer/>
    </>
  );
}
