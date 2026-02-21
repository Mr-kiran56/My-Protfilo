import { useEffect, useState } from "react";
import Footer from "./Footer";
import "./Project.css";
import "./App.css";
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
    if (!userId || !token || projects.length === 0) return;

    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) { console.error("Invalid user_id:", userId); return; }

    const upvoted = new Set();
    for (const project of projects) {
      try {
        const res = await api.get("/project_upvote/is_project_upvote", {
          params: { project_id: project.project_id, user_id: parsedUserId }
        });
        if (res.data.is_upvoted === true) upvoted.add(project.project_id);
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
    if (!token) { alert("Please login to upvote!"); window.location.href = "/login"; return; }
    if (upvotedProjects.has(projectId)) { alert("You have already upvoted this project!"); return; }

    try {
      const response = await api.post(
        "/project_upvote/",
        { project_id: projectId, dir: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpvotedProjects(prev => new Set([...prev, projectId]));
      setProjectDetails(prev =>
        prev.map(p => p.project_id === projectId ? { ...p, project_votes: p.project_votes + 1 } : p)
      );
      toast.success(response.data.message || "Thanks for upvoting!");
    } catch (error) {
      console.error("Error upvoting:", error);
      if (error.response?.status === 401) { alert("Session expired. Please login again."); window.location.href = "/login"; }
      else if (error.response?.status === 409) { alert("You have already upvoted this project!"); setUpvotedProjects(prev => new Set([...prev, projectId])); }
      else alert(error.response?.data?.detail || "Failed to upvote. Please try again.");
    }
  };

  const handleCommentSubmit = async () => {
    const token = getToken();
    if (!token) { alert("Please login to comment!"); window.location.href = "/login"; return; }
    if (!commentText.trim()) { alert("Please enter a comment!"); return; }

    setIsSubmitting(true);
    try {
      const response = await api.post(
        "/comments/",
        { project_id: selectedProject.project_id, comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
        prev.map(p =>
          p.project_id === selectedProject.project_id
            ? { ...p, project_comments: [...p.project_comments, newComment] }
            : p
        )
      );
      setSelectedProject(prev => ({ ...prev, project_comments: [...prev.project_comments, newComment] }));
      setCommentText("");
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
      if (error.response?.status === 401) { alert("Session expired. Please login again."); window.location.href = "/login"; }
      else toast.error(error.response?.data?.detail || "Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = getToken();
    if (!token) { alert("Please login to delete comments!"); return; }
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await api.delete(`/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
      setProjectDetails(prev =>
        prev.map(p =>
          p.project_id === selectedProject.project_id
            ? { ...p, project_comments: p.project_comments.filter(c => c.id !== commentId) }
            : p
        )
      );
      setSelectedProject(prev => ({
        ...prev,
        project_comments: prev.project_comments.filter(c => c.id !== commentId)
      }));
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (error.response?.status === 401) { alert("Session expired. Please login again."); window.location.href = "/login"; }
      else if (error.response?.status === 403) toast.error("You can only delete your own comments!");
      else toast.error(error.response?.data?.detail || "Failed to delete comment.");
    }
  };

  const openCommentsPanel = (project) => setSelectedProject(project);
  const closeCommentsPanel = () => { setSelectedProject(null); setCommentText(""); };
  const isCommentOwner = (commentUserId) => {
    const currentUserId = getUserId();
    if (!currentUserId) return false;
    return parseInt(currentUserId, 10) === commentUserId;
  };

  return (
    <>
      <div className="projects-container" id="projects">
        <h1 className="projects-title">Projects</h1>

        {projectDetails.length === 0 && (
          <p style={{ color: "#888", textAlign: "center", fontStyle: "italic" }}>No projects found.</p>
        )}

        {projectDetails.map((details) => (
          <div className="project-card" key={details.project_id}>
            <div className="project-content">

              {/* Image */}
              <div className="project-image-container">
                <img
                  src={`https://images.unsplash.com/${details.ImageUrl}?auto=format&fit=crop&h=500&w=450&q=80`}
                  alt="Project preview"
                />
                <div className="project-image-overlay" />
              </div>

              {/* Info */}
              <div className="project-info">
                <div className="project-number">{details.project_id}</div>

                {/* Title + description */}
                <div>
                  <h2 className="project-title">{details.ProjectName}</h2>
                  <p className="project-description" style={{ marginTop: "10px" }}>
                    {details.ProjectContent}
                  </p>
                </div>

                {/* Tech stack */}
                <div className="project-tech">
                  <div className="project-tech-label">Tech Stack</div>
                  <div className="tech-stack">
                    {details.TechStcak?.split(",").map((tech, index) => (
                      <span className="tech-tag" key={index}>{tech.trim()}</span>
                    ))}
                  </div>
                </div>

                {/* Actions — counts inline, no absolute positioning */}
                <div className="project-actions">

                  {/* GitHub */}
                  <a
                    className="action-btn"
                    href={details.GitHubLink}
                    target="_blank"
                    rel="noreferrer"
                    title="View GitHub Repository"
                  >
                    <img src="/images/preview.png" alt="GitHub" />
                  </a>

                  {/* Live preview */}
                  <a
                    className="action-btn"
                    href={details.PreviewLink}
                    target="_blank"
                    rel="noreferrer"
                    title="View Live Demo"
                  >
                    <img src="/images/web-programming.png" alt="Preview" />
                  </a>

                  {/* Comments */}
                  <button
                    className="action-btn"
                    onClick={() => openCommentsPanel(details)}
                    title="View Comments"
                    style={{ background: "none", border: "1.5px solid rgba(0,0,0,0.08)", cursor: "pointer" }}
                  >
                    <img src="/images/comments.png" alt="Comments" />
                  </button>
                  <span className="action-count">{details.project_comments.length}</span>

                  {/* Upvote */}
                  <button
                    className="action-btn"
                    onClick={() => handleUpvote(details.project_id)}
                    title={upvotedProjects.has(details.project_id) ? "Already Liked" : "Like Project"}
                    style={{ background: "none", border: "1.5px solid rgba(0,0,0,0.08)", cursor: "pointer" }}
                  >
                    <img
                      src={upvotedProjects.has(details.project_id) ? "/images/upheart.png" : "/images/heart.png"}
                      alt="Like"
                    />
                  </button>
                  <span className="action-count">{details.project_votes}</span>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comments sidebar */}
      {selectedProject && (
        <div className="body-cmt" style={{ position: "absolute" }}>
          <div
            className="comments-overlay"
            onClick={closeCommentsPanel}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 999 }}
          />

          <div
            className="comments-sidebar"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "440px",
              maxWidth: "92vw",
              height: "620px",
              marginTop: "52px",
              borderRadius: "16px",
              background: "linear-gradient(160deg, rgba(255,248,240,0.97), rgba(240,232,255,0.97))",
              backdropFilter: "blur(16px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              animation: "slideIn 0.3s cubic-bezier(0.22,1,0.36,1)"
            }}
          >
            {/* Header */}
            <div style={{
              padding: "18px 20px",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontFamily: "'Fraunces', serif", fontWeight: 700, color: "#1a1a1a" }}>
                Comments <span style={{ fontWeight: 400, color: "#888", fontSize: "15px" }}>({selectedProject.project_comments.length})</span>
              </h3>
              <button onClick={closeCommentsPanel} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#888", lineHeight: 1 }}>✕</button>
            </div>

            {/* List */}
            <div className="hide-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {selectedProject.project_comments.length === 0 ? (
                <p style={{ textAlign: "center", color: "#aaa", marginTop: "40px", fontStyle: "italic" }}>No comments yet. Be the first!</p>
              ) : (
                selectedProject.project_comments.map((comment) => (
                  <div key={comment.id} style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "14px",
                    marginBottom: "12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    position: "relative"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #c97d4e, #8b5e8b)",
                        color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: "14px", flexShrink: 0
                      }}>
                        {comment.comments_user.username.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: "14px", color: "#1a1a1a" }}>
                        {comment.comments_user.username}
                      </span>
                    </div>
                    <p style={{ margin: 0, lineHeight: "1.6", fontSize: "14px", color: "#444", paddingRight: "28px" }}>
                      {comment.comment}
                    </p>
                    {getToken() && isCommentOwner(comment.comments_user.user_id) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        title="Delete comment"
                        style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                      >
                        <img
                          className="delete-comment"
                          src="/images/trash.png"
                          alt="Delete"
                          style={{ width: "18px", height: "18px", opacity: 0.45, transition: "opacity 0.2s" }}
                          onMouseEnter={(e) => e.target.style.opacity = "1"}
                          onMouseLeave={(e) => e.target.style.opacity = "0.45"}
                        />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
              {getToken() ? (
                <>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment…"
                    rows={3}
                    style={{
                      width: "100%", borderRadius: "10px", padding: "12px",
                      border: "1.5px solid rgba(0,0,0,0.1)", outline: "none",
                      marginBottom: "10px", resize: "none", fontSize: "14px",
                      fontFamily: "inherit", background: "#fafafa"
                    }}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={isSubmitting || !commentText.trim()}
                    style={{
                      width: "100%", padding: "12px", borderRadius: "10px", border: "none",
                      fontWeight: 700, fontSize: "14px", letterSpacing: "0.02em",
                      background: "linear-gradient(135deg, #c97d4e, #8b5e8b)",
                      color: "white", cursor: "pointer", opacity: (isSubmitting || !commentText.trim()) ? 0.5 : 1,
                      transition: "opacity 0.2s"
                    }}
                  >
                    {isSubmitting ? "Posting…" : "Post Comment"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => (window.location.href = "/login")}
                  style={{
                    width: "100%", padding: "12px", borderRadius: "10px", border: "none",
                    fontWeight: 700, background: "linear-gradient(135deg, #c97d4e, #8b5e8b)",
                    color: "white", cursor: "pointer"
                  }}
                >
                  Login to comment
                </button>
              )}
            </div>
          </div>

          <style>{`
            @keyframes slideIn {
              from { transform: translateX(-100%); }
              to   { transform: translateX(0); }
            }
            .hide-scroll { scrollbar-width: none; -ms-overflow-style: none; }
            .hide-scroll::-webkit-scrollbar { display: none; }
          `}</style>
        </div>
      )}

      <hr className="br-line" style={{ margin: "auto" }} />
      <Footer />
    </>
  );
}