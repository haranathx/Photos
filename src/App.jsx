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

  // 🔥 ADD THIS HERE
  useEffect(() => {
    const grid = document.querySelector(".gallery");
    if (!grid) return;

    const resizeGridItems = () => {
      const rowHeight = 10;
      const rowGap = 15;

      grid.querySelectorAll(".image-wrapper").forEach((item) => {
        const img = item.querySelector("img");

        if (img.complete) {
          const height = img.getBoundingClientRect().height;
          const span = Math.ceil((height + rowGap) / (rowHeight + rowGap));
          item.style.gridRowEnd = `span ${span}`;
        } else {
          img.onload = () => {
            const height = img.getBoundingClientRect().height;
            const span = Math.ceil((height + rowGap) / (rowHeight + rowGap));
            item.style.gridRowEnd = `span ${span}`;
          };
        }
      });
    };

    resizeGridItems();
    window.addEventListener("resize", resizeGridItems);

    return () => window.removeEventListener("resize", resizeGridItems);
  }, [images]);


  // 🔒 Disable right-click globally
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    window.addEventListener("contextmenu", disableRightClick);

    return () => {
      window.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  // 🔥 SORT (LIFO → latest first)
  const displayImages = [...images].sort((a, b) => b.id - a.id);

  // 🔒 Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
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
          prev === displayImages.length - 1 ? 0 : prev + 1
        );
      }

      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev === 0 ? displayImages.length - 1 : prev - 1
        );
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, displayImages.length]);

  const showNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="container">
      <h1>Photos</h1>

      {/* ✅ GRID LAYOUT (correct order) */}
      <div className="gallery">
        {displayImages.map((img, index) => (
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
            src={displayImages[selectedIndex].url}
            alt=""
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
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