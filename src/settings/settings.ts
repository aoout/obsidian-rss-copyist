export interface RSSCopyistSettings {
	tag: string;
	loadWebpageText: boolean
}

export const DEFAULT_SETTINGS: RSSCopyistSettings = {
	tag: "feed",
	loadWebpageText: false
};
