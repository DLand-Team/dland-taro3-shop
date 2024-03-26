export type ProductDetailType = {

	id: number,
	valid: 0 | 1,
	createUser: string,
	createTime: string,
	modifyUser: string,
	modifyTime: string,
	name: string,
	brief: string,
	price: number,
	memberPrice: number,
	categoryId: number,
	categoryName: string,
	coverImgUrl: string,
	detailHtml: string,
	detailRaw: string,
	sold: number,
	recommend: number,
	needPetCleaning: number,
	imgList: Array<string>,

}
