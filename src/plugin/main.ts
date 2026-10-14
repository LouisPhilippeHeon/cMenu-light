import {
  Plugin,
  Command,
  Editor,
  MarkdownView,
  App,
} from "obsidian";
import { wait } from "src/util/util";
import { cMenuSettingTab } from "src/settings/settingsTab";
import { selfDestruct, cMenuPopover } from "src/modals/cMenuModal";
import { cMenuSettings, DEFAULT_SETTINGS } from "src/settings/settingsData";
import addIcons from "src/icons/customIcons";

export default class cMenuPlugin extends Plugin {
  app: App;
  settings: cMenuSettings;
  cMenuBar: HTMLElement;
  modCommands: Command[] = [
    {
      id: "editor:insert-embed",
      name: "Add embed",
      icon: "note-glyph",
    },
    {
      id: "editor:insert-link",
      name: "Insert markdown link",
      icon: "link-glyph",
    },
    {
      id: "editor:insert-tag",
      name: "Add tag",
      icon: "price-tag-glyph",
    },
    {
      id: "editor:insert-wikilink",
      name: "Add internal link",
      icon: "bracket-glyph",
    },
    {
      id: "editor:toggle-bold",
      name: "Toggle bold",
      icon: "bold-glyph",
    },
    {
      id: "editor:toggle-italics",
      name: "Toggle italics",
      icon: "italic-glyph",
    },
    {
      id: "editor:toggle-strikethrough",
      name: "Toggle strikethrough",
      icon: "strikethrough-glyph",
    },
    {
      id: "editor:toggle-code",
      name: "Toggle code",
      icon: "code-glyph",
    },
    {
      id: "editor:toggle-blockquote",
      name: "Toggle blockquote",
      icon: "quote-glyph",
    },
    {
      id: "editor:toggle-bullet-list",
      name: "Toggle bullet",
      icon: "bullet-list-glyph",
    },
    {
      id: "editor:toggle-checklist-status",
      name: "Toggle checklist status",
      icon: "checkbox-glyph",
    },
    {
      id: "editor:toggle-comments",
      name: "Toggle comment",
      icon: "percent-sign-glyph",
    },
    {
      id: "editor:toggle-highlight",
      name: "Toggle highlight",
      icon: "highlight-glyph",
    },
    {
      id: "editor:toggle-numbered-list",
      name: "Toggle numbered list",
      icon: "number-list-glyph",
    },
  ];

  async onload(): Promise<void> {
    console.log("cMenu v" + this.manifest.version + " loaded");
    addIcons();
    await this.loadSettings();
    this.generateCommands();
    this.addSettingTab(new cMenuSettingTab(this.app, this));
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", this.handlecMenu)
    );
    // Fires when the focused note switches between editing and reading mode
    this.registerEvent(
      this.app.workspace.on("layout-change", this.handlecMenu)
    );
  }

  generateCommands() {
    const applyCommand = (command: commandPlot, editor: Editor) => {
      const selectedText = editor.getSelection();
      const curserStart = editor.getCursor("from");
      const curserEnd = editor.getCursor("to");
      const prefix = command.prefix;
      const suffix = command.suffix || prefix;
      const setCursor = (mode: number) => {
        editor.setCursor(
          curserStart.line + command.line * mode,
          curserEnd.ch + command.char * mode
        );
      };
      const preStart = {
        line: curserStart.line - command.line,
        ch: curserStart.ch - prefix.length,
      };
      const pre = editor.getRange(preStart, curserStart);

      if (pre == prefix.trimStart()) {
        const sufEnd = {
          line: curserStart.line + command.line,
          ch: curserEnd.ch + suffix.length,
        };
        const suf = editor.getRange(curserEnd, sufEnd);
        if (suf == suffix.trimEnd()) {
          editor.replaceRange(selectedText, preStart, sufEnd); // codeblock leave blank lines
          return setCursor(-1);
        }
      }
      editor.replaceSelection(`${prefix}${selectedText}${suffix}`);
      return setCursor(1);
    };

    type commandPlot = {
      char: number;
      line: number;
      prefix: string;
      suffix: string;
    };

    type commandsPlot = {
      [key: string]: commandPlot;
    };

    const commandsMap: commandsPlot = {
      underline: {
        char: 3,
        line: 0,
        prefix: "<u>",
        suffix: "</u>",
      },
      superscript: {
        char: 5,
        line: 0,
        prefix: "<sup>",
        suffix: "</sup>",
      },
      subscript: {
        char: 5,
        line: 0,
        prefix: "<sub>",
        suffix: "</sub>",
      },
      codeblock: {
        char: 5,
        line: 1,
        prefix: "\n```\n",
        suffix: "\n```\n",
      },
    };
    const commandIcons: Record<string, string> = {
      underline: "underline",
      superscript: "superscript",
      subscript: "subscript",
      codeblock: "square-code",
    };
    // Add new commands
    Object.keys(commandsMap).forEach((type) => {
      this.addCommand({
        id: `${type}`,
        name: `Toggle ${type}`,
        icon: commandIcons[type],
        callback: async () => {
          const activeLeaf =
            this.app.workspace.getActiveViewOfType(MarkdownView);
          if (activeLeaf) {
            const view = activeLeaf;
            const editor = view.editor;
            applyCommand(commandsMap[type], editor);
            await wait(10);
            //@ts-ignore
            this.app.commands.executeCommandById("editor:focus");
          }
        },
      });
    });
    // Enhance editor commands
    this.modCommands.forEach((type) => {
      this.addCommand({
        id: `${type["id"]}`,
        name: `${type["name"]}`,
        icon: `${type["icon"]}`,
        callback: async () => {
          const activeLeaf =
            this.app.workspace.getActiveViewOfType(MarkdownView);
          const view = activeLeaf;
          const editor = view.editor;
          //@ts-ignore
          this.app.commands.executeCommandById(`${type["id"]}`);
          editor.setCursor(editor.getCursor("to"));
          await wait(10);
          //@ts-ignore
          this.app.commands.executeCommandById("editor:focus");
        },
      });
    });
  }

  onunload(): void {
    selfDestruct();
    console.log("cMenu unloaded");
    this.app.workspace.off("active-leaf-change", this.handlecMenu);
  }

  handlecMenu = (): void => {
    cMenuPopover(this.app, this.settings);
  };

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
