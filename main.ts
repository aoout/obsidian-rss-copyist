import { Plugin, TFile, TFolder } from "obsidian";
import FeedsFolder from "src/Feeds";

export default class SimpleRSSPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "get-feed",
			name: "Get the newlest articels from all feeds",
			callback: async () => {
				await this.parseAllFeeds(
					this.app.workspace.getActiveFile()?.parent ?? null
				);
			},
		});
	}

	async parseAllFeeds(folder: TFolder | null) {
		if (!folder) {
			return;
		}
		this.parseOneFeed(folder);
		
		folder.children.forEach((item) => {
			console.log(`children: ${item.name}`);
			console.log(`???: ${item instanceof TFolder}`);
			if (item instanceof TFolder) {
				
				if (
					item.children.filter((subitem) => {
						return subitem instanceof TFolder;
					}).length == 0
				) {
					this.parseOneFeed(item);
					console.log(`parseOneFeed: ${item.name}`);
					
				} else {
					this.parseAllFeeds(item);
					console.log(`parseAllFeed: ${item.name}`);
				}
			}
		});
	}

	async parseOneFeed(folder: TFolder) {
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
			folder.path + "/feed.md"
		);
		if (result instanceof TFile) {
			return this.app.metadataCache.getFileCache(result)?.frontmatter;
		}
	}

	async getTemplate(folder: TFolder): Promise<string> {
		const result = this.app.vault.getAbstractFileByPath(
			folder.path + "/template.md"
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

	onunload() {}
}
