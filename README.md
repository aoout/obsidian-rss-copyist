# Obsidian RSS Copyist Plugin

## Usage

To use this plugin, you need to create a note and tag it with the `feed` tag to represent an **RSS feed**. The plugin will then collect the updated articles from this feed into a folder with the same name, located in the root directory of the directory where the feed notes are located.

Additionally, you need to place a `template.md` file at the same level, or in a higher-level directory, to provide a template for all **RSS feeds** under it. This template will be used to format the articles collected from the RSS feeds.

After these final preparations, you can run the `Get the newest articles from all feeds` command to get the latest subscription articles. This command will fetch the latest articles from all RSS feeds you have set up and format them according to the template you provided.

>[!note]
>It's worth noting that the parsing effect of this plugin is better on the desktop side than on the mobile side. This means that you may get more accurate and complete article content on your desktop than on your mobile device.

## FileTree Example

Here's an example of how your file structure might look like after setting up the plugin:
```
.
└── RSS/
    ├── obsidian
    ├── sppai
    ├── steam/
    │   ├── gameUpdate1
    │   ├── gameUpdate2
    │   ├── gameUpdate1.md
    │   └── gameUpdate2.md
    ├── obsidian.md
    ├── sppai.md
    └── template.md
```

## My Template

Here's an example of what your `template.md` file might look like:
```
---
feed: "{{item.feed}}"
url: "{{item.link}}"
author: "{{item.author}}"
date: "{{item.pubDate}}"
firstImage: "{{item.firstImage}}"
unread: true
---
{{item.content}}
```

## Feed.md Example

And here's an example of what your `feed.md` file might look like:
``````
---
url: https://rsshub.app/sspai/index
newestNum: 10
showunreadonly: true
tags:
- feed
---
```dataview
table dateformat(file.mtime, "yyyy.MM.dd") AS "publish date",
"![](" + firstImage + ")"
where file.folder = this.file.folder + "/" + this.file.name
and (!this.showunreadonly or unread)
sort file.mtime DESC 
```
``````


## How RSS Articles Are Parsed here

This plugin uses the `xml-js` library to parse RSS feeds. The process is straightforward:

1. The XML feed content is converted to JavaScript objects using `xml2js.xml2js()`
2. The parser extracts key fields like title, description, author, link, publication date and even the content from each RSS item
3. The extracted content is then formatted according to the template and saved as individual markdown files

So what I want to say is, this parsing process is really simple, to the point where it cannot be as universally compatible as some mature RSS services. Sometimes, the parsing just fails.









