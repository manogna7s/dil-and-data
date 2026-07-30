import { useEffect, useRef, useState } from "react";
import styles from "./ImageCropModal.module.css";

/**
 * Lightweight image cropper — exports a JPEG/PNG File for replace/upload.
 * No third-party crop library; selection rectangle + canvas export.
 */
function ImageCropModal({ src, fileName = "cropped.jpg", onCancel, onConfirm }) {
  const imgRef = useRef(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [box, setBox] = useState({ x: 10, y: 10, w: 80, h: 80 }); // % of displayed image
  const dragRef = useRef(null);

  useEffect(() => {
    function onMove(e) {
      if (!dragRef.current || !imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const { mode, startX, startY, origin } = dragRef.current;
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;

      if (mode === "move") {
        const dx = px - startX;
        const dy = py - startY;
        setBox({
          w: origin.w,
          h: origin.h,
          x: clamp(origin.x + dx, 0, 100 - origin.w),
          y: clamp(origin.y + dy, 0, 100 - origin.h),
        });
      } else if (mode === "resize") {
        const w = clamp(px - origin.x, 8, 100 - origin.x);
        const h = clamp(py - origin.y, 8, 100 - origin.y);
        setBox({ ...origin, w, h });
      }
    }

    function onUp() {
      dragRef.current = null;
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  async function handleConfirm() {
    const img = imgRef.current;
    if (!img || !natural.w) return;

    const sx = (box.x / 100) * natural.w;
    const sy = (box.y / 100) * natural.h;
    const sw = (box.w / 100) * natural.w;
    const sh = (box.h / 100) * natural.h;

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sw));
    canvas.height = Math.max(1, Math.round(sh));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92)
    );
    if (!blob) return;
    const base = fileName.replace(/\.[^.]+$/, "") || "cropped";
    const file = new File([blob], `${base}-cropped.jpg`, { type: "image/jpeg" });
    onConfirm?.(file);
  }

  return (
    <div className={styles.scrim} role="dialog" aria-modal="true" aria-label="Crop image">
      <div className={styles.panel}>
        <header className={styles.bar}>
          <h2>Crop image</h2>
          <div className={styles.actions}>
            <button type="button" className={styles.ghost} onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className={styles.primary} onClick={handleConfirm}>
              Apply crop
            </button>
          </div>
        </header>
        <p className={styles.hint}>Drag the frame to move · drag the corner to resize</p>
        <div className={styles.stage}>
          <div className={styles.frame}>
            <img
              ref={imgRef}
              src={src}
              alt=""
              className={styles.image}
              draggable={false}
              onLoad={(e) => {
                setNatural({
                  w: e.currentTarget.naturalWidth,
                  h: e.currentTarget.naturalHeight,
                });
              }}
            />
            <div
              className={styles.crop}
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.w}%`,
                height: `${box.h}%`,
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                const rect = imgRef.current.getBoundingClientRect();
                dragRef.current = {
                  mode: "move",
                  startX: ((e.clientX - rect.left) / rect.width) * 100,
                  startY: ((e.clientY - rect.top) / rect.height) * 100,
                  origin: { ...box },
                };
              }}
            >
              <button
                type="button"
                className={styles.handle}
                aria-label="Resize crop"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dragRef.current = {
                    mode: "resize",
                    startX: 0,
                    startY: 0,
                    origin: { ...box },
                  };
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export default ImageCropModal;
