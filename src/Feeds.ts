import { request, Notice, Vault, htmlToMarkdown } from "obsidian";
import Parser from "rss-parser";
import { DateTime } from "luxon";

function convertToValidFilename(string: string): string {
	return string.replace(/[\/|\\:*?"<>]/g, " ");
}

export default class FeedsFolder {
	folderPath: string;
	feedUrl: string;

	constructor(folderPath: string) {
		this.folderPath = folderPath;
	}

	async syncFeed(
		vault: Vault,
		feedUrl: string,
		template: string,
		newestNum: number
	): Promise<void> {
		if (!newestNum) {
			newestNum = 5;
		}
		const name = this.folderPath.split("/").at(-1);
		new Notice("Sync Feed: " + name);
		const content = await this.getUrlContent(feedUrl);
		content.items.slice(0, newestNum).forEach((item: any) => {
			const mdcontent = htmlToMarkdown(item.content);
			const images = mdcontent.match(/!\[.*?\]\((.*?)\)/) ?? ["", ""];
			const firstImage = images[1];
			const text = this.parseItem(template, item).replace(
				"{{item.firstImage}}",
				firstImage ?? ""
			);

			const filePath =
				this.folderPath +
				"/" +
				convertToValidFilename(item.title) +
				".md";
			vault.create(filePath, text).then((file) => {
				console.log("Note created :" + file.basename);
				new Notice("Note created :" + file.basename);
			});
		});
	}

	async getUrlContent(url: string) {
		const parser: Parser = new Parser();
		const text = request({
			url: url,
			method: "GET",
		});
		return parser.parseString(await text);
	}

	parseItem(template: string, item: any): string {
		return template
			.replace("{{item.title}}", item.title ?? "")
			.replace("{{item.content}}", htmlToMarkdown(item.content) ?? "")
			.replace("{{item.description}}", item.description ?? "")
			.replace("{{item.author}}", item.author ?? "")
			.replace("{{item.link}}", item.link ?? "")
			.replace("{{item.guid}}", item.guid ?? "")
			.replace("{{item.comments}}", item.comments ?? "")
			.replace("{{item.categories}}", item.categories ?? "")
			.replace(
				"{{item.pubDate}}",
				DateTime.fromHTTP(item.pubDate).toISODate() ?? ""
			);
	}
}
