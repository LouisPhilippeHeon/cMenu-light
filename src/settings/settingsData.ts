import type { Command } from "obsidian";
export const APPEND_METHODS = ["body", "workspace"];
export const AESTHETIC_STYLES = ["glass", "default"];

export interface cMenuSettings {
  aestheticStyle: string;
  menuCommands: Command[];
  appendMethod: string;
  cMenuBottomValue: number;
  cMenuNumRows: number;
}

export const DEFAULT_SETTINGS: cMenuSettings = {
  aestheticStyle: "default",
  menuCommands: [
    {
      id: "cmenu-light:editor:toggle-bold",
      name: "cMenu Light: Toggle bold",
      icon: "bold-glyph",
    },
    {
      id: "cmenu-light:editor:toggle-italics",
      name: "cMenu Light: Toggle italics",
      icon: "italic-glyph",
    },
    {
      id: "cmenu-light:editor:toggle-strikethrough",
      name: "cMenu Light: Toggle strikethrough",
      icon: "strikethrough-glyph",
    },
    {
      id: "cmenu-light:underline",
      name: "cMenu Light: Toggle underline",
      icon: "underline",
    },
    {
      id: "cmenu-light:superscript",
      name: "cMenu Light: Toggle superscript",
      icon: "superscript",
    },
    {
      id: "cmenu-light:subscript",
      name: "cMenu Light: Toggle subscript",
      icon: "subscript",
    },
    {
      id: "cmenu-light:editor:toggle-code",
      name: "cMenu Light: Toggle code",
      icon: "code-glyph",
    },
    {
      id: "cmenu-light:codeblock",
      name: "cMenu Light: Toggle codeblock",
      icon: "square-code",
    },
    {
      id: "cmenu-light:editor:toggle-blockquote",
      name: "cMenu Light: Toggle blockquote",
      icon: "quote-glyph",
    },
  ],
  appendMethod: "workspace",
  cMenuBottomValue: 4.25,
  cMenuNumRows: 9,
};
