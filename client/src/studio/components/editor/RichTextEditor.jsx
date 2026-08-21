import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { NodeSelection } from "@tiptap/pm/state";
import { useEffect, useState } from "react";
import StudioImage from "./StudioImage";
import styles from "./RichTextEditor.module.css";

const IMAGE_POSITIONS = [
  { value: "left", label: "Left (text beside)" },
  { value: "right", label: "Right (text beside)" },
  { value: "top", label: "Top (text below)" },
  { value: "bottom", label: "Bottom (text above)" },
];

const IMAGE_SIZES = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "full", label: "Full width" },
];

/**
 * TipTap-powered editorial editor.
 * Image Position + Size controls for About / blog rich text.
 */
function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Begin writing…",
  editable = true,
  onInsertImage,
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: styles.link },
      }),
      StudioImage,
    ],
    content: value || "",
    editable,
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: styles.prose,
      },
      handleClickOn: (view, _pos, node, nodePos) => {
        if (node.type.name === "image") {
          const tr = view.state.tr.setSelection(
            NodeSelection.create(view.state.doc, nodePos)
          );
          view.dispatch(tr);
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) editor.setEditable(editable);
  }, [editable, editor]);

  const [, setToolbarTick] = useState(0);
  useEffect(() => {
    if (!editor) return undefined;
    const refresh = () => setToolbarTick((n) => n + 1);
    editor.on("selectionUpdate", refresh);
    editor.on("transaction", refresh);
    return () => {
      editor.off("selectionUpdate", refresh);
      editor.off("transaction", refresh);
    };
  }, [editor]);

  if (!editor) return null;

  const imageSelected = editor.isActive("image");
  const imageAttrs = imageSelected
    ? editor.getAttributes("image")
    : { align: "top", size: "md" };

  function setLink() {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function addImage() {
    if (onInsertImage) {
      onInsertImage((url, alt = "") => {
        if (!url) return;
        editor
          .chain()
          .focus()
          .setImage({ src: url, alt, align: "left", size: "md" })
          .run();
      });
      return;
    }
    const url = window.prompt("Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url, align: "left", size: "md" }).run();
  }

  function updateImageAttr(partial) {
    if (!editor.isActive("image")) return;
    editor.chain().focus().updateAttributes("image", partial).run();
  }

  return (
    <div className={styles.wrap}>
      {editable && (
        <div className={styles.toolbar} role="toolbar" aria-label="Formatting">
          <ToolbarBtn
            label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            ↶
          </ToolbarBtn>
          <ToolbarBtn
            label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            ↷
          </ToolbarBtn>
          <span className={styles.sep} />
          <ToolbarBtn
            label="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            B
          </ToolbarBtn>
          <ToolbarBtn
            label="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            I
          </ToolbarBtn>
          <ToolbarBtn
            label="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            U
          </ToolbarBtn>
          <span className={styles.sep} />
          <ToolbarBtn
            label="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </ToolbarBtn>
          <ToolbarBtn
            label="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </ToolbarBtn>
          <span className={styles.sep} />
          <ToolbarBtn
            label="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            ••
          </ToolbarBtn>
          <ToolbarBtn
            label="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1.
          </ToolbarBtn>
          <ToolbarBtn
            label="Quote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            “
          </ToolbarBtn>
          <span className={styles.sep} />
          <ToolbarBtn label="Link" active={editor.isActive("link")} onClick={setLink}>
            Link
          </ToolbarBtn>
          <ToolbarBtn label="Image" onClick={addImage}>
            {onInsertImage ? "Media" : "Img"}
          </ToolbarBtn>

          <span className={styles.sep} />
          <label className={styles.selectField}>
            <span>Position</span>
            <select
              value={imageAttrs.align || "top"}
              disabled={!imageSelected}
              onChange={(e) => updateImageAttr({ align: e.target.value })}
              title={
                imageSelected
                  ? "Image position"
                  : "Click an image in the editor first"
              }
            >
              {IMAGE_POSITIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.selectField}>
            <span>Size</span>
            <select
              value={imageAttrs.size || "md"}
              disabled={!imageSelected}
              onChange={(e) => updateImageAttr({ size: e.target.value })}
              title={
                imageSelected ? "Image size" : "Click an image in the editor first"
              }
            >
              {IMAGE_SIZES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <EditorContent editor={editor} />
      {editable && (
        <p className={styles.hint}>
          {imageSelected
            ? "Image selected — set Position and Size above. Left/Right: text fills beside the image."
            : "Insert Media, click the image, then choose Position and Size."}
        </p>
      )}
    </div>
  );
}

function ToolbarBtn({ children, onClick, active, disabled, label }) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${active ? styles.active : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

export default RichTextEditor;
