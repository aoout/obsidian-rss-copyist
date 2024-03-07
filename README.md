# Obsidian RSS Copyist Plugin

## Usage

Create a note and tag it with the `feed` tag to represent an **RSS feed**. The corresponding updated articles will be collected into a folder with the same name, located in the root directory of the directory where the feed notes are located.

And, place a `template.md` file at the same level, or in a higher-level directory, to provide a template for all **RSS feeds** under it.

After these final preparations, you can run the `Get the newlest articles from all feeds` command to get the latest subscription articles.

>[!note]
>On the desktop side, the parsing effect is better than on the mobile side.

## FileTree Example

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
