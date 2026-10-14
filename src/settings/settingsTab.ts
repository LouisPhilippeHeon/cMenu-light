import type cMenuPlugin from "src/plugin/main";
import { CommandPicker } from "src/modals/suggesterModals";
import {
  App,
  Command,
  Setting,
  PluginSettingTab,
  TextComponent,
  ButtonComponent,
  ExtraButtonComponent,
  setIcon,
  debounce,
} from "obsidian";
import { APPEND_METHODS, AESTHETIC_STYLES } from "src/settings/settingsData";

export class cMenuSettingTab extends PluginSettingTab {
  plugin: cMenuPlugin;
  appendMethod: string;
  saveSettingsDebounced = debounce(() => this.plugin.saveSettings(), 200);

  constructor(app: App, plugin: cMenuPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Display settings" });
    new Setting(containerEl)
      .setName("cMenu append method")
      .setDesc(
        "Choose where cMenu gets attached."
      )
      .addDropdown((dropdown) => {
        let methods: Record<string, string> = {};
        APPEND_METHODS.map((method) => (methods[method] = method));
        dropdown.addOptions(methods);
        dropdown
          .setValue(this.plugin.settings.appendMethod)
          .onChange((appendMethod) => {
            this.plugin.settings.appendMethod = appendMethod;
            this.plugin.saveSettings();
          });
      });
    new Setting(containerEl)
      .setName("cMenu aesthetic")
      .setDesc(
        "Choose between a glass morphism and default style for cMenu."
      )
      .addDropdown((dropdown) => {
        let aesthetics: Record<string, string> = {};
        AESTHETIC_STYLES.map(
          (aesthetic) => (aesthetics[aesthetic] = aesthetic)
        );
        dropdown.addOptions(aesthetics);
        dropdown
          .setValue(this.plugin.settings.aestheticStyle)
          .onChange((aestheticStyle) => {
            this.plugin.settings.aestheticStyle = aestheticStyle;
            this.plugin.saveSettings();
          });
      });
    new Setting(containerEl)
      .setName("cMenu position")
      .setDesc("Distance between cMenu and the bottom of the workspace.")
      .addSlider((slider) => {
        slider
          .setLimits(0, 20, 0.25)
          .setValue(this.plugin.settings.cMenuBottomValue)
          .setInstant(true)
          .onChange((value) => {
            this.plugin.settings.cMenuBottomValue = value;
            this.saveSettingsDebounced();
          })
      });

    containerEl.createDiv({ cls: "cMenuSettingsCommandsHeader" }, (div) => {
      div.createEl("h2", { text: "Commands" });
      new ButtonComponent(div)
        .setIcon("plus")
        .setTooltip("Add")
        .onClick(() => {
          new CommandPicker(this.plugin, () => this.display()).open();
        });
    });

    const cMenuCommandsContainer = containerEl.createEl("div", {
      cls: "cMenuSettingsTabsContainer",
    });
    // Drag and drop reordering, initiated from the item handles
    let draggedEl: HTMLElement | null = null;
    let oldIndex = -1;
    const indexOf = (el: HTMLElement) =>
      Array.from(cMenuCommandsContainer.children).indexOf(el);
    cMenuCommandsContainer.addEventListener("dragstart", (event) => {
      draggedEl = (event.target as HTMLElement).closest(".cMenuSettingsItem");
      if (!draggedEl) return;
      oldIndex = indexOf(draggedEl);
      if (event.dataTransfer) {
        event.dataTransfer.setData("text/plain", "");
        // Drag the whole item rather than just the handle
        const rect = draggedEl.getBoundingClientRect();
        event.dataTransfer.setDragImage(
          draggedEl,
          event.clientX - rect.left,
          event.clientY - rect.top
        );
      }
      // Let the browser snapshot the drag image before dimming the item
      setTimeout(() => draggedEl?.addClass("sortable-ghost"));
    });
    cMenuCommandsContainer.addEventListener("dragover", (event) => {
      if (!draggedEl) return;
      event.preventDefault();
      const target = (event.target as HTMLElement).closest(
        ".cMenuSettingsItem"
      ) as HTMLElement | null;
      if (!target || target === draggedEl) return;
      const rect = target.getBoundingClientRect();
      const after = event.clientY > rect.top + rect.height / 2;
      cMenuCommandsContainer.insertBefore(
        draggedEl,
        after ? target.nextSibling : target
      );
    });
    cMenuCommandsContainer.addEventListener("drop", (event) => {
      event.preventDefault();
    });
    cMenuCommandsContainer.addEventListener("dragend", () => {
      if (!draggedEl) return;
      draggedEl.removeClass("sortable-ghost");
      const newIndex = indexOf(draggedEl);
      draggedEl = null;
      if (newIndex === oldIndex) return;
      const arrayResult = this.plugin.settings.menuCommands;
      const [removed] = arrayResult.splice(oldIndex, 1);
      arrayResult.splice(newIndex, 0, removed);
      this.plugin.saveSettings();
    });
    this.plugin.settings.menuCommands.forEach((newCommand: Command) => {
      const itemEl = cMenuCommandsContainer.createDiv({
        cls: "cMenuSettingsItem",
      });
      setIcon(
        itemEl.createDiv({ cls: "cMenuSettingsItemIcon" }),
        newCommand.icon
      );
      new TextComponent(itemEl)
        .setPlaceholder(newCommand.id)
        .setValue(newCommand.name)
        .onChange((name) => {
          newCommand.name = name;
          this.saveSettingsDebounced();
        })
        .inputEl.addClass("cMenuSettingsItemName");
      new ExtraButtonComponent(itemEl)
        .setIcon("lucide-x")
        .setTooltip("Delete")
        .onClick(async () => {
          this.plugin.settings.menuCommands.remove(newCommand);
          await this.plugin.saveSettings();
          this.display();
        });
      const handleEl = itemEl.createDiv({ cls: "cMenuSettingsItemHandle" });
      setIcon(handleEl, "lucide-menu");
      handleEl.draggable = true;
    });
  }
}
