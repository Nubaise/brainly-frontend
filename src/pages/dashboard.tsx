import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/Shareicon";
import { CreateContentModal } from "../components/CreateContentModal";
import { Sidebar } from "../components/Sidebar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface Content {
  _id: string;
  title: string;
  link?: string;
  type?: "twitter" | "youtube" | "linkedin" | "other";
}

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContents();
  }, []);

  async function fetchContents() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContents(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
      } else {
        console.error("Failed to fetch contents:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function shareContent() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const shareUrl = `${window.location.origin}/brain/${response.data.shareLink}`;
      await navigator.clipboard.writeText(shareUrl);
      alert(`Share link copied!\n\n${shareUrl}`);
    } catch (error) {
      console.error("Failed to create share link:", error);
      alert("Failed to create share link");
    }
  }

  return (
    <div>
      <Sidebar />

      <div className="p-4 ml-72 min-h-screen bg-gray-100">
        <CreateContentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            fetchContents();
          }}
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              My Second Brain
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {contents.length}{" "}
              {contents.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setModalOpen(true)}
              variant="primary"
              startIcon={<PlusIcon />}
              text="Add content"
            />
            <Button
              onClick={shareContent}
              variant="secondary"
              startIcon={<ShareIcon />}
              text="Share brain"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : contents.length === 0 ? (
          /* EMPTY STATE */
          <div className="relative w-full h-[420px] bg-white rounded-lg border-2 border-dashed border-gray-300">
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">🧠</div>

              <p className="text-xl text-gray-700 font-semibold mb-2">
                Your brain is empty
              </p>

              <p className="text-sm text-gray-500">
                Start adding content to build your second brain
              </p>
            </div>

            {/* Bottom-center CTA */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Button
                onClick={() => setModalOpen(true)}
                variant="primary"
                startIcon={<PlusIcon />}
                text="Add your first content"
              />
            </div>
          </div>
        ) : (
          /* CONTENT GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contents.map((content) => (
              <Card
                key={content._id}
                _id={content._id}
                title={content.title}
                link={content.link || ""}
                type={content.type}
                onDelete={fetchContents}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
