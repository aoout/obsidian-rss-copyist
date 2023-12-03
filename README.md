# Obsidian RSS Copyist Plugin

## Usage

Create a folder to represent a feed. Place the {{feed}}.md file and template.md file in its parent's root directory to represent feedsurl and templates. 

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

```
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
where contains(file.folder, this.file.folder) and file.name != this.file.name
and (!this.showunreadonly or unread)
sort file.mtime DESC 
```

# 示例库

具体如何使用，请参考我制作的[示例库](https://github.com/aoout/ObsidianRSSExample)。
