import { request, Notice, Vault, htmlToMarkdown, Platform } from "obsidian";
import { DateTime } from "luxon";
import { RSSParser } from "./RSSParser";
import * as DOMPurify from "isomorphic-dompurify";
import { Readability} from "@mozilla/readability";

function convertToValidFilename(string: string): string {
	// eslint-disable-next-line no-useless-escape
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
		newestNum: number,
		loadWebpageText: boolean
	): Promise<void> {
		if (!newestNum) {
			newestNum = 5;
		}
		const name = this.folderPath.split("/").slice(-1)[0];
		new Notice("Sync Feed: " + name);
		const content = await this.getUrlContent(feedUrl);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		content.items.slice(0, newestNum).forEach(async (item: any) => {
			let mdcontent = htmlToMarkdown(item.content);
			if(loadWebpageText){
				mdcontent = await this.loadWebpageText(item.link);
			}
			const images = mdcontent.match(/!\[.*?\]\((.*?)\)/) ?? ["", ""];
			const firstImage = images[1];
			const text = this.parseItem(template, item)
				.replaceAll("{{item.firstImage}}", firstImage ?? "")
				.replaceAll("{{item.feed}}", name ?? "");

			const filePath = this.folderPath + "/" + convertToValidFilename(item.title) + ".md";
			vault.create(filePath, text).then((file) => {
				console.log("Note created :" + file.basename);
				new Notice("Note created :" + file.basename);
			});
		});
	}

	async getUrlContent(url: string) {
		const data = await request({
			url: url,
			method: "GET",
		});
		if (Platform.isDesktop) {
			const module = await import("rss-parser");
			const parser = new module.default();
			return await parser.parseString(data);
		} else {
			return RSSParser.parser(data);
		}
	}

	async loadWebpageText(url:string){
		// the code is from https://github.com/DominikPieper/obsidian-ReadItLater/blob/master/src/parsers/WebsiteParser.ts
		const link = new URL(url);
		const response = await request({ method: "GET", url: link.href });
		const document = new DOMParser().parseFromString(response, "text/html");
		const originBasElements = document.getElementsByTagName("base");
		let originBaseUrl = null;
		if (originBasElements.length > 0) {
			originBaseUrl = originBasElements.item(0).getAttribute("href");
			Array.from(originBasElements).forEach((originBasEl) => {
				originBasEl.remove();
			});
		}
		const baseEl = document.createElement("base");
		const getBaseUrl = (url: string, origin: string) => {
			const baseURL = new URL(url, origin);
			return baseURL.href;
		};
		baseEl.setAttribute("href", getBaseUrl(originBaseUrl ?? link.href, link.origin));
		document.head.append(baseEl);
		const cleanDocumentBody = DOMPurify.sanitize(document.body.innerHTML);
		document.body.innerHTML = cleanDocumentBody;
		return new Readability(document).parse().content;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parseItem(template: string, item: any): string {
		return template
			.replaceAll("{{item.title}}", item.title ?? "")
			.replaceAll("{{item.content}}", htmlToMarkdown(item.content) ?? "")
			.replaceAll("{{item.author}}", item.author ?? "")
			.replaceAll("{{item.link}}", item.link ?? "")
			.replaceAll("{{item.pubDate}}", DateTime.fromHTTP(item.pubDate).toISODate() ?? "");
	}
}
