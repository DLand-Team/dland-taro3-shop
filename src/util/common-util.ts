export class CommonUtil {

	public static stringIsNull(s: string | null | undefined): boolean {
		return s == null || s == '' || s.trim() == '';
	}

	public static richHtml(s: string): string {
		return s.replace(/<img src=/gi, '<img style="max-width:100%;height:auto" src=');
	}

}
