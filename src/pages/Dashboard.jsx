import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";
import { Plus, Trash2, FolderOpen } from "lucide-react";

function Dashboard() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newFolder, setNewFolder] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const { role } = useContext(AuthContext);
  const { searchQuery } = useContext(SearchContext);

  // Fetch all folders
  const fetchFolders = async () => {
    try {
      const res = await API.get("/folders");
      setFolders(res.data);
    } catch (err) {
      console.error("Failed to load folders:", err);
    }
  };

  // Fetch notes for selected folder
  const fetchNotes = async (folderId) => {
    try {
      const res = await API.get(`/notes/folder/${folderId}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  // Add folder (Admin only)
  const handleAddFolder = async (e) => {
    e.preventDefault();
    if (!newFolder.trim()) return;
    try {
      await API.post("/folders", { name: newFolder });
      setNewFolder("");
      fetchFolders();
    } catch (err) {
      console.error("Error adding folder:", err);
    }
  };

  // Delete folder (Admin only)
  const handleDeleteFolder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this folder and all its notes?")) return;
    try {
      await API.delete(`/folders/${id}`);
      fetchFolders();
      if (selectedFolder === id) setSelectedFolder(null);
    } catch (err) {
      console.error("Error deleting folder:", err);
    }
  };

  // Upload note (Admin only)
  const handleUploadNote = async (e) => {
    e.preventDefault();
    if (!file || !title || !selectedFolder) return alert("Select file, title, and folder.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("folderId", selectedFolder);

    try {
      await API.post("/notes", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setFile(null);
      setTitle("");
      fetchNotes(selectedFolder);
      alert("✅ Note uploaded!");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await API.delete(`/notes/${noteId}`);
      fetchNotes(selectedFolder);
      if (previewUrl && previewUrl.includes(noteId)) setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed!");
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) fetchNotes(selectedFolder);
  }, [selectedFolder]);

  // Filtered lists
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      {!selectedFolder ? (
        <>
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">
            {role === "ADMIN" ? "Admin Panel" : "My Notes"}
          </h1>

          {role === "ADMIN" && (
            <div className="flex justify-center mb-8">
              <form onSubmit={handleAddFolder} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Create new folder..."
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition"
                >
                  <Plus size={18} /> Add
                </button>
              </form>
            </div>
          )}

          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {filteredFolders.map((folder) => (
              <motion.div
                key={folder.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative bg-white rounded-2xl p-6 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center"
                onClick={() => setSelectedFolder(folder.id)}
              >
                <FolderOpen size={48} className="text-blue-500 mb-3 group-hover:text-blue-700 transition" />
                <h2 className="text-base font-semibold text-gray-800 truncate w-full text-center">
                  {folder.name}
                </h2>
                {role === "ADMIN" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id);
                    }}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">📝 Notes</h2>
            <button
              onClick={() => setSelectedFolder(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ⬅ Back to Folders
            </button>
          </div>

          {role === "ADMIN" && (
            <form onSubmit={handleUploadNote} className="border p-4 rounded-lg bg-gray-50 mb-6">
              <input
                type="text"
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border p-2 rounded mb-2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Upload
              </button>
            </form>
          )}

          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{note.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Uploaded on {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <button
                      onClick={() => setPreviewUrl(note.fileUrl)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      👁 Preview
                    </button>
                    <a href={note.fileUrl} download className="text-green-600 hover:text-green-800">
                      ⬇ Download
                    </a>
                    {role === "ADMIN" && (
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑 Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No notes found in this folder.</p>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full md:w-11/12 lg:w-4/5 h-[90vh] rounded-xl shadow-lg overflow-hidden relative">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold text-xl z-50"
            >
              ✖
            </button>
            <iframe src={previewUrl} title="Note Preview" className="w-full h-full"></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
