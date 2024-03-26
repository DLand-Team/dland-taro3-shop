export type HttpResultType<T> = {

	code: string,
	msg: string,
	data: T,
	success: boolean,

}
