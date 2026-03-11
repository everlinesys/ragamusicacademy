import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../shared/api";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNew = id === "new";

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    oldPrice: "",
    thumbnail: "",
    introBunnyVideoId: "",
  });

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // ================= LOAD COURSE =================
  useEffect(() => {
    if (isNew) return;

    async function load() {
      try {
        const { data } = await api.get(`/courses/${id}`);

        setForm({
          title: data.title || "",
          description: data.description || "",
          price: data.price ?? "",
          oldPrice: data.oldPrice ?? "",
          thumbnail: data.thumbnail || "",
          introBunnyVideoId: data.introBunnyVideoId || "",
        });
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [id, isNew]);

  // ================= THUMBNAIL =================
  async function uploadThumbnail(file) {
    if (!file) return;

    const fd = new FormData();
    fd.append("thumbnail", file);

    setUploading(true);

    try {
      const res = await api.post("/uploads/course-thumbnail", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm((p) => ({ ...p, thumbnail: res.data.url }));
    } catch (err) {
      console.error(err);
    }

    setUploading(false);
  }

  // ================= VIDEO =================
  async function uploadVideo(file) {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const { data } = await api.post(
        "/admin/bunny/create-video-simple",
        { title: file.name }
      );

      const { videoId, uploadUrl } = data;

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.floor((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        setUploading(false);

        setForm((p) => ({
          ...p,
          introBunnyVideoId: videoId,
        }));
      };

      xhr.send(file);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  }

  // ================= SAVE =================
  async function save(e) {
    e.preventDefault();

    if (!form.title || !form.description) {
      alert("Title & description required");
      return;
    }

    if (!form.price) {
      alert("Price is required");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
    };

    try {
      if (isNew) {
        await api.post("/courses", payload);
      } else {
        await api.put(`/courses/${id}`, payload);
      }

      navigate("/admin/courses");
    } catch (err) {
      console.error(err);
      alert("Failed to save course");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 px-2 py-10">

      <h2 className="text-2xl font-semibold">
        {isNew ? "Create Course" : "Edit Course"}
      </h2>

      <form onSubmit={save} className="space-y-6">

        {/* TITLE */}
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Course Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        {/* DESCRIPTION */}
        <textarea
          className="w-full border rounded-lg p-3"
          rows={4}
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* PRICE */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className="border rounded-lg p-3"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <input
            className="border rounded-lg p-3"
            placeholder="Old Price"
            type="number"
            value={form.oldPrice}
            onChange={(e) =>
              setForm({ ...form, oldPrice: e.target.value })
            }
          />
        </div>

        {/* THUMBNAIL */}
        <div>
          <p className="text-sm mb-2">Cover Image</p>

          {form.thumbnail && (
            <img
              src={
                import.meta.env.VITE_API_URL.replace("/api", "") +
                form.thumbnail
              }
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              uploadThumbnail(e.target.files[0])
            }
          />
        </div>

        {/* INTRO VIDEO */}
        <div>
          <p className="text-sm mb-2">Intro Video</p>

          {uploading && (
            <div className="text-sm text-gray-500">
              Uploading {progress}%
            </div>
          )}

          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              uploadVideo(e.target.files[0])
            }
          />

          {form.introBunnyVideoId && (
            <p className="text-xs text-green-600 mt-2">
              Video uploaded ✔
            </p>
          )}
        </div>

        {/* SAVE */}
        <button className="px-6 py-3 bg-black text-white rounded-lg">
          {isNew ? "Create Course" : "Save Changes"}
        </button>

      </form>
    </div>
  );
}