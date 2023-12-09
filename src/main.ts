import { Plugin, TFile, TFolder } from "obsidian";
import FeedsFolder from "./feed";
import { getNotesWithTag } from "./utils/obsidianUtils";
import { DEFAULT_SETTINGS, RSSCopyistSettings } from "./settings/settings";

export default class RSSCopyistPlugin extends Plugin {
	settings: RSSCopyistSettings;
	async onload() {
		await this.loadSettings();
		this.addCommand({
			id: "get-the-feed",
			name: "Get the newlest articels from the feed",
			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile() as TFile;
				if (!activeFile) return false;
				const tags =
					this.app.metadataCache.getFileCache(activeFile)?.frontmatter?.tags ?? [];
				if (!tags.includes(this.settings.tag)) return false;
				if (!checking) {
					this.getFeedFolder(activeFile).then((folder) => {
						this.parseFeed(folder);
					});
				}
				return true;
			},
		});
		this.addCommand({
			id: "get-all-feeds",
			name: "Get the newlest articels from all feeds",
			callback: async () => {
				const files = getNotesWithTag(this.app, "feed");
				files.forEach(async (file) => {
					const folder = await this.getFeedFolder(file);
					await this.parseFeed(folder);
				});
			},
		});
		this.addCommand({
			id: "clear-all-feeds",
			name: "Clear the articels from all feeds",
			callback: async () => {
				const files = getNotesWithTag(this.app, this.settings.tag);
				for (const file of files) {
					const folder = await this.getFeedFolder(file);
					await this.app.vault.delete(folder,true);
				}
			},
		});
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async getFeedFolder(file: TFile) {
		const folderPath = file.parent.path + "/" + file.basename;
		let folder = this.app.vault.getAbstractFileByPath(folderPath);
		if (!(folder instanceof TFolder)) {
			folder = await this.app.vault.createFolder(folderPath);
		}
		if (!folder) return;
		return folder as TFolder;
	}

	async parseFeed(folder: TFolder) {
		const feedMetadata = this.getFeedMetadata(folder);
		const template = await this.getTemplate(folder);
		if (feedMetadata && template != "") {
			const feedsFolder = new FeedsFolder(folder.path);
			feedsFolder.syncFeed(
				this.app.vault,
				feedMetadata?.["url"],
				template,
				parseInt(feedMetadata?.["newestNum"])
			);
		}
	}

	getFeedMetadata(folder: TFolder) {
		const result = this.app.vault.getAbstractFileByPath(
			folder.parent.path + "/" + folder.name + ".md"
		);
		if (result instanceof TFile) {
			return this.app.metadataCache.getFileCache(result)?.frontmatter;
		}
	}

	async getTemplate(folder: TFolder): Promise<string> {
		const result = this.app.vault.getAbstractFileByPath(folder.parent.path + "/template.md");
		if (result instanceof TFile) {
			return await this.app.vault.cachedRead(result);
		} else {
			if (folder.parent) {
				return this.getTemplate(folder.parent);
			} else {
				return "";
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	onunload() {}
}
