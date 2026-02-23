import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const API = "/api/photos";

  const fetchImages = async () => {
    try {
      const res = await axios.get(API);
      setImages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // 🔒 Disable right-click globally
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    window.addEventListener("contextmenu", disableRightClick);

    return () => {
      window.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  // 🔒 Block inspect shortcuts + ESC + Arrow navigation
  useEffect(() => {
    const handleKey = (e) => {
      // Block common dev shortcuts
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }

      if (selectedIndex === null) return;

      if (e.key === "Escape") setSelectedIndex(null);

      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      }

      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev === 0 ? images.length - 1 : prev - 1
        );
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, images.length]);

  const showNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="container">
      <h1>Photos</h1>

      <div className="gallery">
        {images.map((img, index) => (
          <div key={img.id} className="image-wrapper">
            <img
              src={img.url}
              alt=""
              onClick={() => setSelectedIndex(index)}
              onContextMenu={(e) => e.preventDefault()}
              draggable="false"
            />
          </div>
        ))}
      </div>

      {/* 🔥 Modal */}
      {selectedIndex !== null && (
        <div className="modal" onClick={() => setSelectedIndex(null)}>

          {/* Close */}
          <span
            className="close-btn"
            onClick={() => setSelectedIndex(null)}
          >
            &times;
          </span>

          {/* Prev */}
          <button className="nav-btn left" onClick={showPrev}>
            &#10094;
          </button>

          {/* Image */}
          <img
            className="modal-image"
            src={images[selectedIndex].url}
            alt=""
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}  // 🔒 disabled here too
            draggable="false"
          />

          {/* Next */}
          <button className="nav-btn right" onClick={showNext}>
            &#10095;
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Haranathx™. All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;