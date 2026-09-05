import Paragraph from "@tiptap/extension-paragraph";

/**
 * Paragraph with optional drop-cap — large first letter for editorial openings.
 * Toggle from the rich-text toolbar; survives in saved HTML as class + data attr.
 */
export const StudioParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      dropCap: {
        default: false,
        parseHTML: (element) =>
          element.classList.contains("drop-cap") ||
          element.getAttribute("data-drop-cap") === "true",
        renderHTML: (attributes) => {
          if (!attributes.dropCap) return {};
          return {
            class: "drop-cap",
            "data-drop-cap": "true",
          };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      toggleDropCap:
        () =>
        ({ commands, editor }) => {
          const current = editor.getAttributes("paragraph").dropCap;
          return commands.updateAttributes("paragraph", {
            dropCap: !current,
          });
        },
      setDropCap:
        (value = true) =>
        ({ commands }) =>
          commands.updateAttributes("paragraph", { dropCap: Boolean(value) }),
    };
  },
});

export default StudioParagraph;
