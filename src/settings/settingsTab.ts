import RSSCopyistPlugin from "../main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class RSSCopyistSettingTab extends PluginSettingTab {
	plugin: RSSCopyistPlugin;
	constructor(app: App, plugin: RSSCopyistPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Tag")
			.setDesc("The tag is used to identify feeds.")
			.addText((text) =>
				text
					.setPlaceholder("feed")
					.setValue(this.plugin.settings.tag)
					.onChange(async (value) => {
						this.plugin.settings.tag = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("LoadWebpageText")
			.setDesc("Load text from Webpage.")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.loadWebpageText).onChange(async (value) => {
					this.plugin.settings.loadWebpageText = value;
					await this.plugin.saveSettings();
				});
			});
	}
}
