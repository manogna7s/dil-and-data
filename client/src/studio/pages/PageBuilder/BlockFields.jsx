import { useState } from "react";
import MediaPicker from "../../components/media/MediaPicker";
import RichTextEditor from "../../components/editor/RichTextEditor";
import {
  PAGE_BLOCK_TYPES,
  SECTION_TONES,
  defaultBlockData,
} from "../../../blocks/blockTypes";
import styles from "./BlockFields.module.css";

/**
 * Per-block settings form used by the page builder.
 */
function BlockFields({ block, onChange }) {
  const [richImageOpen, setRichImageOpen] = useState(false);
  const [richImageInsert, setRichImageInsert] = useState(null);

  if (!block) return null;
  const data = block.data || {};
  const typeDefaultTone = defaultBlockData(block.type).tone || "default";

  function set(partial) {
    onChange({ ...data, ...partial });
  }

  function setItem(listKey, index, partial) {
    const list = [...(data[listKey] || [])];
    list[index] = { ...list[index], ...partial };
    set({ [listKey]: list });
  }

  function addItem(listKey, blank) {
    set({ [listKey]: [...(data[listKey] || []), blank] });
  }

  function removeItem(listKey, index) {
    set({ [listKey]: (data[listKey] || []).filter((_, i) => i !== index) });
  }

  return (
    <div className={styles.fields}>
      <p className={styles.type}>
        {PAGE_BLOCK_TYPES.find((t) => t.type === block.type)?.label || block.type}
      </p>

      {block.type !== "hero" && (
        <label className={styles.field}>
          <span>Background</span>
          <select
            value={data.tone || typeDefaultTone}
            onChange={(e) => set({ tone: e.target.value })}
          >
            {SECTION_TONES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {block.type === "hero" && (
        <>
          <Field label="Eyebrow" value={data.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <Field label="Title" value={data.title} onChange={(v) => set({ title: v })} />
          <Field label="Tagline" value={data.tagline} onChange={(v) => set({ tagline: v })} area />
          <Field label="CTA label" value={data.ctaLabel} onChange={(v) => set({ ctaLabel: v })} />
          <Field label="CTA link" value={data.ctaTo} onChange={(v) => set({ ctaTo: v })} />
          <Field
            label="Secondary label"
            value={data.secondaryLabel}
            onChange={(v) => set({ secondaryLabel: v })}
          />
          <Field
            label="Secondary link"
            value={data.secondaryTo}
            onChange={(v) => set({ secondaryTo: v })}
          />
        </>
      )}

      {block.type === "featuredStory" && (
        <p className={styles.hint}>Pulls the latest featured published story from Content.</p>
      )}

      {block.type === "latestStories" && (
        <>
          <Field label="Title" value={data.title} onChange={(v) => set({ title: v })} />
          <Field
            label="Limit"
            value={String(data.limit ?? 6)}
            onChange={(v) => set({ limit: Number(v) || 6 })}
          />
          <Field label="See all label" value={data.seeAllLabel} onChange={(v) => set({ seeAllLabel: v })} />
          <Field label="See all link" value={data.seeAllTo} onChange={(v) => set({ seeAllTo: v })} />
        </>
      )}

      {block.type === "categories" && (
        <Field label="Title" value={data.title} onChange={(v) => set({ title: v })} />
      )}

      {block.type === "quote" && (
        <>
          <Field label="Eyebrow" value={data.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <Field label="Quote" value={data.text} onChange={(v) => set({ text: v })} area />
          <Field label="Attribution" value={data.attribution} onChange={(v) => set({ attribution: v })} />
        </>
      )}

      {block.type === "newsletter" && (
        <p className={styles.hint}>Uses the site newsletter component. Subscriber API stays wired.</p>
      )}

      {block.type === "aboutPreview" && (
        <>
          <Field label="Name" value={data.name} onChange={(v) => set({ name: v })} />
          <Field label="Role" value={data.role} onChange={(v) => set({ role: v })} />
          <Field label="Intro" value={data.intro} onChange={(v) => set({ intro: v })} area />
          <MediaField
            label="Portrait"
            url={data.portrait}
            onUrl={(url) => set({ portrait: url })}
            folder="profile"
          />
          <Field label="CTA label" value={data.ctaLabel} onChange={(v) => set({ ctaLabel: v })} />
          <Field label="CTA link" value={data.ctaTo} onChange={(v) => set({ ctaTo: v })} />
        </>
      )}

      {block.type === "features" && (
        <>
          <Field label="Title" value={data.title} onChange={(v) => set({ title: v })} />
          <ListEditor
            label="Features"
            items={data.items || []}
            onAdd={() => addItem("items", { title: "", description: "" })}
            onRemove={(i) => removeItem("items", i)}
            renderItem={(item, i) => (
              <>
                <Field
                  label="Title"
                  value={item.title}
                  onChange={(v) => setItem("items", i, { title: v })}
                />
                <Field
                  label="Description"
                  value={item.description}
                  onChange={(v) => setItem("items", i, { description: v })}
                  area
                />
              </>
            )}
          />
        </>
      )}

      {block.type === "divider" && (
        <Field label="Label" value={data.label} onChange={(v) => set({ label: v })} />
      )}

      {block.type === "image" && (
        <>
          <MediaField label="Image" url={data.url} onUrl={(url) => set({ url })} folder="gallery" />
          <Field label="Alt text" value={data.alt} onChange={(v) => set({ alt: v })} />
          <Field label="Caption" value={data.caption} onChange={(v) => set({ caption: v })} />
        </>
      )}

      {block.type === "video" && (
        <>
          <MediaField
            label="Video"
            url={data.url}
            onUrl={(url) => set({ url })}
            folder="videos"
            accept="video"
          />
          <Field label="Title" value={data.title} onChange={(v) => set({ title: v })} />
          <MediaField
            label="Poster image"
            url={data.poster}
            onUrl={(url) => set({ poster: url })}
            folder="covers"
          />
        </>
      )}

      {block.type === "richText" && (
        <>
          <Field label="Eyebrow" value={data.eyebrow} onChange={(v) => set({ eyebrow: v })} />
          <Field label="Title" value={data.title} onChange={(v) => set({ title: v })} />
          <div className={styles.editorField}>
            <span className={styles.editorLabel}>Body</span>
            <RichTextEditor
              value={data.html || ""}
              onChange={(html) => set({ html })}
              placeholder="Write about yourself… Insert images, then set Place and Size."
              onInsertImage={(insert) => {
                setRichImageInsert(() => insert);
                setRichImageOpen(true);
              }}
            />
          </div>
          <p className={styles.hint}>
            Insert an image, click it, then use Place and Size. Left/Right lets your text fill the space beside the image.
          </p>
          <MediaPicker
            open={richImageOpen}
            title="Insert image"
            mode="single"
            accept="image"
            initialFolder="gallery"
            onClose={() => {
              setRichImageOpen(false);
              setRichImageInsert(null);
            }}
            onSelect={(item) => {
              const media = Array.isArray(item) ? item[0] : item;
              if (media?.url && richImageInsert) {
                richImageInsert(media.url, media.alt || "");
              }
              setRichImageOpen(false);
              setRichImageInsert(null);
            }}
          />
        </>
      )}

      {block.type === "cta" && (
        <>
          <Field label="Title" value={data.title} onChange={(v) => set({ title: v })} />
          <Field label="Description" value={data.description} onChange={(v) => set({ description: v })} area />
          <Field label="Button label" value={data.buttonLabel} onChange={(v) => set({ buttonLabel: v })} />
          <Field label="Button link" value={data.buttonTo} onChange={(v) => set({ buttonTo: v })} />
        </>
      )}

      {block.type === "embed" && (
        <>
          <Field label="Embed HTML" value={data.html} onChange={(v) => set({ html: v })} area rows={6} />
          <Field label="Caption" value={data.caption} onChange={(v) => set({ caption: v })} />
        </>
      )}

      {block.type === "photographyCarousel" && (
        <ListEditor
          label="Photos"
          items={data.items || []}
          onAdd={() =>
            addItem("items", { title: "", location: "", src: "", alt: "" })
          }
          onRemove={(i) => removeItem("items", i)}
          renderItem={(item, i) => (
            <>
              <Field label="Title" value={item.title} onChange={(v) => setItem("items", i, { title: v })} />
              <Field label="Location" value={item.location} onChange={(v) => setItem("items", i, { location: v })} />
              <MediaField
                label="Image"
                url={item.src || item.url}
                onUrl={(url) => setItem("items", i, { src: url, url })}
                folder="gallery"
              />
              <Field label="Alt" value={item.alt} onChange={(v) => setItem("items", i, { alt: v })} />
            </>
          )}
        />
      )}

      {block.type === "gallery" && (
        <>
          <Field label="Title" value={data.title} onChange={(v) => set({ title: v })} />
          <ListEditor
            label="Images"
            items={data.items || []}
            onAdd={() => addItem("items", { url: "", alt: "" })}
            onRemove={(i) => removeItem("items", i)}
            renderItem={(item, i) => (
              <>
                <MediaField
                  label="Image"
                  url={item.url || item.src}
                  onUrl={(url) => setItem("items", i, { url })}
                  folder="gallery"
                />
                <Field label="Alt" value={item.alt} onChange={(v) => setItem("items", i, { alt: v })} />
              </>
            )}
          />
        </>
      )}

      {block.type === "timeline" && (
        <>
          <Field label="Title" value={data.title} onChange={(v) => set({ title: v })} />
          <ListEditor
            label="Entries"
            items={data.items || []}
            onAdd={() => addItem("items", { year: "", title: "", description: "" })}
            onRemove={(i) => removeItem("items", i)}
            renderItem={(item, i) => (
              <>
                <Field label="Year" value={item.year} onChange={(v) => setItem("items", i, { year: v })} />
                <Field label="Title" value={item.title} onChange={(v) => setItem("items", i, { title: v })} />
                <Field
                  label="Description"
                  value={item.description}
                  onChange={(v) => setItem("items", i, { description: v })}
                  area
                />
              </>
            )}
          />
        </>
      )}

      {block.type === "bookshelf" && (
        <>
          <Field label="Title" value={data.title} onChange={(v) => set({ title: v })} />
          <Field label="Note" value={data.note} onChange={(v) => set({ note: v })} area />
          <ListEditor
            label="Books"
            items={data.items || []}
            onAdd={() => addItem("items", { title: "", author: "", note: "", cover: "" })}
            onRemove={(i) => removeItem("items", i)}
            renderItem={(item, i) => (
              <>
                <Field label="Title" value={item.title} onChange={(v) => setItem("items", i, { title: v })} />
                <Field label="Author" value={item.author} onChange={(v) => setItem("items", i, { author: v })} />
                <Field label="Note" value={item.note} onChange={(v) => setItem("items", i, { note: v })} area />
                <MediaField
                  label="Cover"
                  url={item.cover}
                  onUrl={(url) => setItem("items", i, { cover: url })}
                  folder="books"
                />
              </>
            )}
          />
        </>
      )}

      {block.type === "faq" && (
        <>
          <Field label="Title" value={data.title} onChange={(v) => set({ title: v })} />
          <ListEditor
            label="Questions"
            items={data.items || []}
            onAdd={() => addItem("items", { question: "", answer: "" })}
            onRemove={(i) => removeItem("items", i)}
            renderItem={(item, i) => (
              <>
                <Field
                  label="Question"
                  value={item.question}
                  onChange={(v) => setItem("items", i, { question: v })}
                />
                <Field
                  label="Answer"
                  value={item.answer}
                  onChange={(v) => setItem("items", i, { answer: v })}
                  area
                />
              </>
            )}
          />
        </>
      )}
    </div>
  );
}

function Field({ label, value, onChange, area = false, rows = 3 }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {area ? (
        <textarea
          rows={rows}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input value={value || ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function MediaField({ label, url, onUrl, folder = "gallery", accept = "image" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.mediaField}>
      <Field label={label} value={url} onChange={onUrl} />
      <button type="button" className={styles.mediaBtn} onClick={() => setOpen(true)}>
        Library
      </button>
      {url && accept === "image" && <img src={url} alt="" className={styles.thumb} />}
      <MediaPicker
        open={open}
        title={`Choose ${label}`}
        mode="single"
        accept={accept}
        initialFolder={folder}
        onClose={() => setOpen(false)}
        onSelect={(item) => {
          const media = Array.isArray(item) ? item[0] : item;
          if (media?.url) onUrl(media.url);
          setOpen(false);
        }}
      />
    </div>
  );
}

function ListEditor({ label, items, onAdd, onRemove, renderItem }) {
  return (
    <div className={styles.list}>
      <div className={styles.listHead}>
        <span>{label}</span>
        <button type="button" className={styles.mediaBtn} onClick={onAdd}>
          Add
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className={styles.listItem}>
          <div className={styles.listItemHead}>
            <span>
              {label} {i + 1}
            </span>
            <button type="button" className={styles.danger} onClick={() => onRemove(i)}>
              Remove
            </button>
          </div>
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  );
}

export default BlockFields;
