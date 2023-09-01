# Obsidian RSS Copyist Plugin

## Usage

Create a folder to represent a feed. Place the feed.md file and template.md file in its root directory to represent feedsurl and templates. 

## My Template

```
---
feed: {{item.feed}}
url: {{item.link}}
author: {{item.author}}
date: {{item.pubDate}}
firstImage: {{item.firstImage}}
unread: true
---
{{item.content}}
```

## Feed.md Example

```
---
url: https://rsshub.app/sspai/index
newestNum: 10
---
```
