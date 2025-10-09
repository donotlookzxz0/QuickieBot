import React, { useEffect, useState } from "react";
import "../styles/ResourceList.css";

export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("https://quickiebot.onrender.com/api/resources");
        const data = await res.json();
        setResources(data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) return <p className="loading-text">Loading resources...</p>;
  if (resources.length === 0)
    return <p className="empty-text">No resources uploaded yet.</p>;

  return (
    <div className="resource-list">
      {resources.map((r) => (
        <div key={r.id} className="resource-card">
          {/* Thumbnail Section */}
          {r.thumbnail ? (
            <img
              src={`https://quickiebot.onrender.com/uploads/${r.thumbnail}`}
              alt="Thumbnail"
              className="resource-thumb"
            />
          ) : (
            <div className="resource-thumb placeholder">No Thumbnail</div>
          )}

          <div className="card-header">
            <div className="file-icon"></div>
            <h3 className="file-name">{r.filename}</h3>
          </div>

          <p className="file-description">
            {r.description || "No description provided."}
          </p>

          {r.uploaded_at && (
            <p className="file-date">
              Uploaded: {new Date(r.uploaded_at).toLocaleString()}
            </p>
          )}

          <a
            href={`https://quickiebot.onrender.com/uploads/${r.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="download-link"
          >
            View / Download
          </a>
        </div>
      ))}
    </div>
  );
}
