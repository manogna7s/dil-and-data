import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import styles from "./RichTextEditor.module.css";

/**
 * TipTap-powered editorial editor.
 * Markdown shortcuts (# ##, **, -, etc.) come from StarterKit.
 * Undo/redo via history + toolbar / Ctrl+Z / Ctrl+Shift+Z.
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
      Image.configure({
        HTMLAttributes: { class: styles.image },
      }),
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

  if (!editor) return null;

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
          .setImage({ src: url, alt })
          .run();
      });
      return;
    }
    const url = window.prompt("Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
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
          <ToolbarBtn
            label="Code block"
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            {"</>"}
          </ToolbarBtn>
          <span className={styles.sep} />
          <ToolbarBtn label="Link" active={editor.isActive("link")} onClick={setLink}>
            Link
          </ToolbarBtn>
          <ToolbarBtn label="Image" onClick={addImage}>
            {onInsertImage ? "Media" : "Img"}
          </ToolbarBtn>
        </div>
      )}
      <EditorContent editor={editor} />
      {editable && (
        <p className={styles.hint}>
          Shortcuts: **bold**, *italic*, ## heading, &gt; quote, - list · Ctrl+Z undo
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
