import { useEffect, useState } from "react";
import Footer from "./Footer";
import "./Project.css";
import "./App.css";
import SideCard from "./SideCard";
import api from "./Api";
import { getUserId, getToken, getUsername } from "./auth";
import toast from "react-hot-toast";

export default function Projects() {
  const [projectDetails, setProjectDetails] = useState([]);
  const [upvotedProjects, setUpvotedProjects] = useState(new Set());
  const [selectedProject, setSelectedProject] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects/getallprojects");
        setProjectDetails(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const checkUserUpvotes = async (projects) => {
    const userId = getUserId();
    const token = getToken();
    
    if (!userId || !token || projects.length === 0) {
      return;
    }

    const parsedUserId = parseInt(userId, 10);
    
    if (isNaN(parsedUserId)) {
      console.error("Invalid user_id:", userId);
      
      return;
    }

    const upvoted = new Set();

    for (const project of projects) {
      try {
        const res = await api.get("/project_upvote/is_project_upvote", {
          params: {
            project_id: project.project_id,
            user_id: parsedUserId
          }
        });

        if (res.data.is_upvoted === true) {
          upvoted.add(project.project_id);
        }
      } catch (err) {
        console.error(`Error checking upvote for project ${project.project_id}:`, err);
      }
    }
    
    setUpvotedProjects(upvoted);
  };

  useEffect(() => {
    if (getToken() && getUserId() && projectDetails.length > 0) {
      checkUserUpvotes(projectDetails);
    }
  }, [projectDetails]);

  const handleUpvote = async (projectId) => {
    const token = getToken();
    if (!token) {
      alert("Please login to upvote!");
      window.location.href = "/login";
      return;
    }

    if (upvotedProjects.has(projectId)) {
      alert("You have already upvoted this project!");

      return;
    }

    try {
      const response = await api.post(
        "/project_upvote/",
        {
          project_id: projectId,
          dir: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUpvotedProjects(prev => new Set([...prev, projectId]));
      setProjectDetails(prev =>
        prev.map(project =>
          project.project_id === projectId
            ? { ...project, project_votes: project.project_votes + 1 }
            : project
        )
      );

      
      toast.success(response.data.message || "Thanks for upvoting!");
    } catch (error) {
      console.error("Error upvoting:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      } else if (error.response?.status === 409) {
        alert("You have already upvoted this project!");
        setUpvotedProjects(prev => new Set([...prev, projectId]));
      } else {
        alert(error.response?.data?.detail || "Failed to upvote. Please try again.");
      }
    }
  };

  const handleCommentSubmit = async () => {
    const token = getToken();
    if (!token) {
      alert("Please login to comment!");
      window.location.href = "/login";
      return;
    }

    if (!commentText.trim()) {
      alert("Please enter a comment!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(
        "/comments/",
        {
          project_id: selectedProject.project_id,
          comment: commentText
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Use the comment_id returned from the backend
      const newComment = {
        id: response.data.comment_id,
        comment: commentText,
        project_id: selectedProject.project_id,
        comments_user: {
          user_id: parseInt(getUserId(), 10),
          username: getUsername() || "Anonymous"
        }
      };

      setProjectDetails(prev =>
        prev.map(project =>
          project.project_id === selectedProject.project_id
            ? {
                ...project,
                project_comments: [...project.project_comments, newComment]
              }
            : project
        )
      );

      setSelectedProject(prev => ({
        ...prev,
        project_comments: [...prev.project_comments, newComment]
      }));

      setCommentText("");
      
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");

        window.location.href = "/login";
      } else {
        
        toast.error(error.response?.data?.detail || "Failed to post comment. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = getToken();
    if (!token) {
      alert("Please login to delete comments!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await api.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the project details state
      setProjectDetails(prev =>
        prev.map(project =>
          project.project_id === selectedProject.project_id
            ? {
                ...project,
                project_comments: project.project_comments.filter(
                  comment => comment.id !== commentId
                )
              }
            : project
        )
      );

      // Update the selected project state
      setSelectedProject(prev => ({
        ...prev,
        project_comments: prev.project_comments.filter(
          comment => comment.id !== commentId
        )
      }));

      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      } else if (error.response?.status === 403) {
        toast.error("You can only delete your own comments!");
      } else {
        toast.error(error.response?.data?.detail || "Failed to delete comment.");
      }
    }
  };

  const openCommentsPanel = (project) => {
    setSelectedProject(project);
  };

  const closeCommentsPanel = () => {
    setSelectedProject(null);
    setCommentText("");
  };

  // Check if the current user owns a comment
  const isCommentOwner = (commentUserId) => {
    const currentUserId = getUserId();
    if (!currentUserId) return false;
    return parseInt(currentUserId, 10) === commentUserId;
  };

  return (
    <>
      <div className="projects-container" id="projects">
        <SideCard />
        <h1 className="projects-title">Projects</h1>

        {projectDetails.length === 0 && (
          <p style={{ color: "white", textAlign: "center" }}>
            No projects found
          </p>
        )}

        {projectDetails.map((details) => (
          <div className="project-card" key={details.project_id}>
            <div className="project-content">
              <div className="project-image-container">
                <img
                  src={`https://images.unsplash.com/${details.ImageUrl}?auto=format&fit=crop&h=390&w=450&q=80`}
                  alt="Project preview"
                />
                <div className="project-image-overlay"></div>
              </div>

              <div className="project-info">
                <div className="project-number">{details.project_id}</div>

                <h2 className="project-title">{details.ProjectName}</h2>

                <p className="project-description">{details.ProjectContent}</p>

                <div className="project-tech">
                  <div className="project-tech-label">Tech Stack</div>

                  <div className="tech-stack">
                    {details.TechStcak?.split(",").map((tech, index) => (
                      <span className="tech-tag" key={index}>
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="project-actions">
                  <a
                    className="action-btn"
                    href={details.GitHubLink}
                    target="_blank"
                    rel="noreferrer"
                    title="View GitHub Repository"
                  >
                    <img src="/images/preview.png" alt="GitHub" />
                  </a>

                  <a
                    className="action-btn"
                    href={details.PreviewLink}
                    target="_blank"
                    rel="noreferrer"
                    title="View Live Demo"
                  >
                    <img src="/images/web-programming.png" alt="Preview" />
                  </a>

                  <button
                    className="action-btn"
                    onClick={() => openCommentsPanel(details)}
                    title="View Comments"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <img src="/images/comments.png" alt="Comments" />
                  </button>
                  <h6
                    style={{
                      marginTop: "43.9px",
                      marginLeft: "128.2px",
                      position: "absolute"
                    }}
                  >
                    {details.project_comments.length}
                  </h6>

                  <button
                    className="action-btn"
                    onClick={() => handleUpvote(details.project_id)}
                    title={upvotedProjects.has(details.project_id) ? "Already Liked" : "Like Project"}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <img
                      src={
                        upvotedProjects.has(details.project_id)
                          ? "/images/upheart.png"
                          : "/images/heart.png"
                      }
                      alt="Like"
                    />
                  </button>
                  <h6
                    style={{
                      marginTop: "43.9px",
                      marginLeft: "186.2px",
                      position: "absolute"
                    }}
                  >
                    {details.project_votes}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <>
          <div className="body-cmt" style={{ position: "absolute" }}>
            <div
              className="comments-overlay"
              onClick={closeCommentsPanel}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
                zIndex: 999
              }}
            />

            <div
              className="comments-sidebar"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "450px",
                maxWidth: "90vw",
                height: "600px",
                marginTop: "56px",
                borderRadius: "15px",
                background:
                  "linear-gradient(135deg, rgba(144,238,144,0.35), rgba(173,216,230,0.35), rgba(255,182,193,0.35), rgba(221,160,221,0.35), rgba(255,255,153,0.35))",
                backdropFilter: "blur(12px)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                animation: "slideIn 0.3s ease-out"
              }}
            >
              <div
                style={{
                  padding: "18px",
                  borderBottom: "1px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                  Comments ({selectedProject.project_comments.length})
                </h3>
                <button
                  onClick={closeCommentsPanel}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer"
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                className="hide-scroll"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px"
                }}
              >
                {selectedProject.project_comments.length === 0 ? (
                  <p style={{ textAlign: "center", opacity: 0.7 }}>
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  selectedProject.project_comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        background: "rgba(255,255,255,0.65)",
                        borderRadius: "12px",
                        padding: "14px",
                        marginBottom: "14px",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                        position: "relative"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "6px"
                        }}
                      >
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg,#4a9eff,#9b6cff)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700
                          }}
                        >
                          {comment.comments_user.username
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>
                          {comment.comments_user.username}
                        </span>
                      </div>

                      <p style={{ margin: 0, lineHeight: "1.5", paddingRight: "30px" }}>
                        {comment.comment}
                      </p>

                      {/* Show delete button only if user is logged in and owns the comment */}
                      {getToken() && isCommentOwner(comment.comments_user.user_id) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          style={{
                            position: "absolute",
                            top: "14px",
                            right: "14px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px"
                          }}
                          title="Delete comment"
                        >
                          <img 
                            className="delete-comment" 
                            src="/images/trash.png" 
                            alt="Delete"
                            style={{
                              width: "20px",
                              height: "20px",
                              opacity: 0.6,
                              transition: "opacity 0.2s"
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = "1"}
                            onMouseLeave={(e) => e.target.style.opacity = "0.6"}
                          />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div
                style={{
                  padding: "14px",
                  borderTop: "1px solid rgba(255,255,255,0.4)"
                }}
              >
                {getToken() ? (
                  <>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        padding: "12px",
                        border: "none",
                        outline: "none",
                        marginBottom: "10px",
                        resize: "none"
                      }}
                    />
                    <button
                      onClick={handleCommentSubmit}
                      disabled={isSubmitting || !commentText.trim()}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "none",
                        fontWeight: 700,
                        background:
                          "linear-gradient(135deg,#4a9eff,#9b6cff)",
                        color: "white",
                        cursor: "pointer"
                      }}
                    >
                      {isSubmitting ? "Posting..." : "Post Comment"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => (window.location.href = "/login")}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: 700,
                      background:
                        "linear-gradient(135deg,#4a9eff,#9b6cff)",
                      color: "white"
                    }}
                  >
                    Login to comment
                  </button>
                )}
              </div>
            </div>

            <style>{`
              @keyframes slideIn {
                from {
                  transform: translateX(-100%);
                }
                to {
                  transform: translateX(0);
                }
              }

              .hide-scroll {
                scrollbar-width: none;      /* Firefox */
                -ms-overflow-style: none;   /* IE / Edge */
              }

              .hide-scroll::-webkit-scrollbar {
                display: none;              /* Chrome / Safari */
              }
            `}</style>
          </div>
        </>
      )}

      <hr className="br-line" style={{ margin: "auto" }} />
      <Footer />

    
    </>
  );
}