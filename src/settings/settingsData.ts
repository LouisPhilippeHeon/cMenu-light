import type { Command } from "obsidian";
export const APPEND_METHODS = ["body", "workspace"];
export const AESTHETIC_STYLES = ["glass", "default"];

export interface cMenuSettings {
  aestheticStyle: string;
  menuCommands: Command[];
  appendMethod: string;
  cMenuBottomValue: number;
}

export const DEFAULT_SETTINGS: cMenuSettings = {
  aestheticStyle: "default",
  menuCommands: [
    {
      id: "cmenu-light:editor:toggle-bold",
      name: "Toggle bold",
      icon: "bold-glyph",
    },
    {
      id: "cmenu-light:editor:toggle-italics",
      name: "Toggle italics",
      icon: "italic-glyph",
    },
    {
      id: "cmenu-light:editor:toggle-strikethrough",
      name: "Toggle strikethrough",
      icon: "strikethrough-glyph",
    },
    {
      id: "cmenu-light:underline",
      name: "Toggle underline",
      icon: "underline",
    },
    {
      id: "cmenu-light:superscript",
      name: "Toggle superscript",
      icon: "superscript",
    },
    {
      id: "cmenu-light:subscript",
      name: "Toggle subscript",
      icon: "subscript",
    },
    {
      id: "cmenu-light:editor:toggle-code",
      name: "Toggle code",
      icon: "code-glyph",
    },
    {
      id: "cmenu-light:codeblock",
      name: "Toggle codeblock",
      icon: "square-code",
    },
    {
      id: "cmenu-light:editor:toggle-blockquote",
      name: "Toggle blockquote",
      icon: "quote-glyph",
    },
  ],
  appendMethod: "workspace",
  cMenuBottomValue: 4.25,
};
