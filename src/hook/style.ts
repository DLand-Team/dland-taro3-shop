import { CommonUtil } from "@/util/common-util";

export const useClass = (content: { [className: string]: boolean }): string => {
	let name = '';
	for (let key in content) {
		if (content[key]) {
			name += key + ' ';
		}
	}
	return name;
}

export const useModuleClass = (
	module: { [className: string]: string },
	content: { [className: string]: boolean },
): string => {
	let name = '';
	for (let key in content) {
		if (content[key]) {
			let n = module[key];
			if (CommonUtil.stringIsNull(n)) {
				name += key + ' ';
			} else {
				name += n + ' ';
			}
		}
	}
	return name;
}
