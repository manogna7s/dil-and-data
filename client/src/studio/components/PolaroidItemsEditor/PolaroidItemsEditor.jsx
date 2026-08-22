import { useState } from "react";
import MediaPicker from "../media/MediaPicker";
import styles from "./PolaroidItemsEditor.module.css";

const BLANK_ITEM = {
  image: "",
  alt: "",
  heading: "",
  tagline: "",
  align: "left",
};

function PolaroidItemsEditor({ items = [], onChange }) {
  const [pickerIndex, setPickerIndex] = useState(null);

  function patchItem(index, partial) {
    const next = items.map((item, i) => (i === index ? { ...item, ...partial } : item));
    onChange(next);
  }

  function addItem() {
    onChange([...items, { ...BLANK_ITEM }]);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.editor}>
      <p className={styles.lede}>
        Each row is one bucket-list dream — polaroid on the left or right, heading and tagline
        beside it.
      </p>

      {items.length === 0 ? (
        <p className={styles.empty}>No polaroids yet. Add your first one below.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={index} className={styles.card}>
              <div className={styles.cardHead}>
                <span>Item {index + 1}</span>
                <button type="button" className={styles.remove} onClick={() => removeItem(index)}>
                  Remove
                </button>
              </div>

              <div className={styles.mediaRow}>
                {item.image ? (
                  <img src={item.image} alt="" className={styles.thumb} />
                ) : (
                  <div className={styles.thumbPlaceholder}>No image</div>
                )}
                <button
                  type="button"
                  className={styles.mediaBtn}
                  onClick={() => setPickerIndex(index)}
                >
                  {item.image ? "Change photo" : "Upload or choose"}
                </button>
              </div>

              <label className={styles.field}>
                <span>Heading</span>
                <input
                  value={item.heading}
                  onChange={(e) => patchItem(index, { heading: e.target.value })}
                  placeholder="Main title for this item"
                />
              </label>

              <label className={styles.field}>
                <span>Tagline</span>
                <textarea
                  rows={2}
                  value={item.tagline}
                  onChange={(e) => patchItem(index, { tagline: e.target.value })}
                  placeholder="Short description (optional)"
                />
              </label>

              <label className={styles.field}>
                <span>Polaroid side</span>
                <select
                  value={item.align === "right" ? "right" : "left"}
                  onChange={(e) => patchItem(index, { align: e.target.value })}
                >
                  <option value="left">Left — text on the right</option>
                  <option value="right">Right — text on the left</option>
                </select>
              </label>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className={styles.addBtn} onClick={addItem}>
        + Add polaroid item
      </button>

      <MediaPicker
        open={pickerIndex !== null}
        title="Choose polaroid photo"
        mode="single"
        accept="image"
        initialFolder="gallery"
        onClose={() => setPickerIndex(null)}
        onSelect={(selection) => {
          if (pickerIndex === null) return;
          const media = Array.isArray(selection) ? selection[0] : selection;
          if (media?.url) {
            patchItem(pickerIndex, { image: media.url, alt: media.alt || "" });
          }
          setPickerIndex(null);
        }}
      />
    </div>
  );
}

export default PolaroidItemsEditor;
