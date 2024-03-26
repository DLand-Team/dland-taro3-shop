export class UserInfoEntity {
	id: number;
	mobile: string = '';
	wechatOpenId: string = '';
	nickname: string = '';
	avatar: string | '' = '';
	gender: number = 0;
	housekeeper: number = 0;
	totalPoints: number = 0;
	membership: number = 0;
	membershipId: number = 0;
	membershipName: string = '';
	membershipActiveDate: string = '';
	membershipExpireDate: string = '';
	status: number = 0;
	token: string = '';
	housekeeperAvatar: string = '';
	housekeeperName: string = '';
	housekeeperNo: string = '';
}
