import type { cMenuSettings } from "src/settings/settingsData";
import { App, Command, MarkdownView, ButtonComponent } from "obsidian";
import { setMenuVisibility } from "src/util/statusBarConstants";

export function selfDestruct() {
  let cMenuModalBar = document.getElementById("cMenuModalBar");
  if (cMenuModalBar) {
    if (cMenuModalBar.firstChild) {
      cMenuModalBar.removeChild(cMenuModalBar.firstChild);
    }
    cMenuModalBar.remove();
  }
}

export function cMenuPopover(app: App, settings: cMenuSettings): void {
  function createMenu() {
    const generateMenu = () => {
      var cMenu = createEl("div");
      cMenu.style.bottom = `${settings.cMenuBottomValue}em`;
      cMenu.setAttribute("id", "cMenuModalBar");
      settings.aestheticStyle == "default"
        ? cMenu.addClass("cMenuDefaultAesthetic")
        : cMenu.addClass("cMenuGlassAesthetic");
      settings.appendMethod == "workspace"
        ? document.body
            .querySelector(".mod-vertical.mod-root")
            .insertAdjacentElement("afterbegin", cMenu)
        : document.body.appendChild(cMenu);
      settings.menuCommands.forEach((item: Command) => {
        var button = new ButtonComponent(cMenu);
        button
          .setIcon(item.icon)
          .setClass("cMenuCommandItem")
          .setTooltip(item.name)
          .onClick(() => {
            // A sidedock leaf may be focused: refocus the note before running
            const leaf = app.workspace.getMostRecentLeaf();
            if (
              leaf?.view instanceof MarkdownView &&
              !app.workspace.getActiveViewOfType(MarkdownView)
            ) {
              app.workspace.setActiveLeaf(leaf, { focus: true });
            }
            //@ts-ignore
            app.commands.executeCommandById(item.id);
          });
      });
    };
    // Use the most recent leaf of the root split (or pop-outs) so focusing
    // a sidedock leaf doesn't hide the menu of the note being edited
    const leaf = app.workspace.getMostRecentLeaf();
    const Markdown = leaf?.view instanceof MarkdownView ? leaf.view : null;
    if (Markdown) {
      if (!document.getElementById("cMenuModalBar")) {
        generateMenu();
      }
      // Hide the menu while the focused note is in reading mode
      setMenuVisibility(Markdown.getMode() !== "preview");
    } else {
      selfDestruct();
    }
  }
  createMenu();
}
