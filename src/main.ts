import { Plugin, TFile, TFolder } from "obsidian";
import FeedsFolder from "./feed";
import { getNotesWithTag } from "./utils/obsidianUtils";

export default class RSSCopyistPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "get-the-feed",
			name: "Get the newlest articels from the feed",
			checkCallback:(checking:boolean) => {
				const activeFile = this.app.workspace.getActiveFile() as TFile;
				if(!activeFile) return false;
				const tags = this.app.metadataCache.getFileCache(activeFile)?.frontmatter?.tags;
				if(!(tags.includes("feed"))) return false;
				if(!checking){
					this.getFeedFolder(activeFile).then((folder)=>{
						this.parseFeed(folder);
					});
				}
				return true;
			},
		});
		this.addCommand({
			id: "get-all-feed",
			name: "Get the newlest articels from all feeds",
			callback: async () => {
				const files = getNotesWithTag(this.app,"feed");
				files.forEach(async (file)=>{
					const folder = await this.getFeedFolder(file);
					await this.parseFeed(folder);
				});
			},
		});
	}

	async getFeedFolder(file:TFile){
		const folderPath = file.parent.path + "/" + file.basename;
		const folder = await this.app.vault.createFolder(folderPath);
		if(!folder) return;
		return folder;
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
		const result = this.app.vault.getAbstractFileByPath(
			folder.parent.path + "/template.md"
		);
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
