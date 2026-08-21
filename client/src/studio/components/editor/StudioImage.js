import Image from "@tiptap/extension-image";

/**
 * TipTap Image with placement + size.
 * Left/right float so surrounding rich-text fills beside the image.
 */
export const StudioImage = Image.extend({
  name: "image",

  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "top",
        parseHTML: (element) =>
          element.getAttribute("data-align") ||
          element.getAttribute("data-placement") ||
          "top",
        renderHTML: (attributes) => ({
          "data-align": attributes.align || "top",
        }),
      },
      size: {
        default: "md",
        parseHTML: (element) => element.getAttribute("data-size") || "md",
        renderHTML: (attributes) => ({
          "data-size": attributes.size || "md",
        }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const align = HTMLAttributes["data-align"] || "top";
    const size = HTMLAttributes["data-size"] || "md";
    return [
      "img",
      {
        ...HTMLAttributes,
        class: ["studio-img", `align-${align}`, `size-${size}`].join(" "),
      },
    ];
  },
});

export default StudioImage;
