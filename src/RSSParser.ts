import * as xml2js from "xml-js";

export class RSSParser {
	static parser(text: string) {
		const result = xml2js.xml2js(text);
		console.log(result);
		const items = result.elements
			.filter((e) => e.name == "rss" || e.name == "feed")[0]
			.elements[0].elements.filter(
				(element) => element.name == "item" || element.name == "entry"
			);
		console.log(items);

		const itemsResults = [];
		items.forEach((item) => {
			const itemsResult = {};
			item.elements.forEach((element) => {
				if (element.name == "title")
					itemsResult["title"] = element.elements[0].text
						? element.elements[0].text
						: element.elements[0].cdata;
				if (element.name == "description")
					itemsResult["content"] = element.elements[0].text
						? element.elements[0].text
						: element.elements[0].cdata;
				if (element.name == "author")
					itemsResult["author"] = element.elements[0].text
						? element.elements[0].text
						: element.elements[0].cdata;
				if (element.name == "link")
					itemsResult["link"] = element.elements[0].text
						? element.elements[0].text
						: element.elements[0].cdata;
				if (element.name == "pubDate")
					itemsResult["pubDate"] = element.elements[0].text
						? element.elements[0].text
						: element.elements[0].cdata;
			});
			itemsResults.push(itemsResult);
		});
		console.log(itemsResults);
		const feed = {
			items: itemsResults,
		};
		return feed;
	}
}
