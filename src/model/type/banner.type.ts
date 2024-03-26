export type BannerType = {
	id: number;
	valid: number;
	createUser: string;
	createTime: string;
	modifyUser: string;
	modifyTime: string;
	title: string;
	coverUrl: string;
	redirectType: "NONE" | "IMAGE" | "PRODUCT" | "RICHTEXT" | "PAGE";
	productId: number;
	redirectImgUrl: string;
	linkUrl: string;
	contentHtml: string;
	contentRaw: string;
};
