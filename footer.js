const data = {
	"theme": "theme-dark",
	"matrix": [
		{
			"title": "支持",
			"items": [
				{
					"text": "关于我们",
					"href": "http://www.ftchinese.com/m/events/event.html"
				},
				{
					"text": "问题回馈",
					"href": "http://www.ftchinese.com/marketing/home"
				},
				{
					"text": "联系方式",
					"href": "http://www.ftchinese.com/marketing/home"
				},
				{
					"text": "职业机会",
					"href": "http://www.ftchinese.com/marketing/home"
				}
			]
		},
		{
			"title": "法务",
			"items": [

				{
					"text": "服务条款",
					"href": "http://www.ftchinese.com/marketing/home"
				},
				{
					"text": "版权声明",
					"href": "http://www.ftchinese.com/marketing/home"
				}
			]
		},
		{
			"title": "服务",
			"items": [
				{
					"text": "广告业务",
					"href": "http://www.ftchinese.com/m/events/event.html"
				},
				{
					"text": "会议活动",
					"href": "http://www.ftchinese.com/m/events/event.html"
				},
				{
					"text": "会员信息中心",
					"href": "http://www.ftchinese.com/marketing/home"
				},
				{
					"text": "最新动态",
					"href": "http://www.ftchinese.com/marketing/home"
				},
				{
					"text": "合作伙伴",
					"href": "http://www.ftchinese.com/marketing/home"
				}
			]
		},
		{
			"title": "关注我们",
			"items": [
				{
					"text": "微信",
					"href": "http://www.ftchinese.com/m/events/event.html"
				},
				{
					"text": "微博",
					"href": "http://www.ftchinese.com/marketing/home"
				},
				{
					"text": "Linkedin",
					"href": "http://www.ftchinese.com/marketing/home"
				},
				{
					"text": "Facebook",
					"href": "http://www.ftchinese.com/marketing/home"
				},
				{
					"text": "Twitter",
					"href": "http://www.ftchinese.com/marketing/home"
				}
			]
		}
	],
	"copyrightYear": (new Date()).getUTCFullYear(),
};

function generateDate () {
	const ITEMS_PER_COLUMN = 5;

	function chunk (oldArray, size) {
		const newArray = [];

		while (oldArray.length) {
			newArray.push(oldArray.splice(0, size));
		}

		return newArray;
	}

	data.matrix.forEach((section, i) => {
		// give each section an identifier
		section.index = i;
		// calculate which section layout to use (1, 2, 4 or 6)
		section.layout = Math.ceil(section.items.length / ITEMS_PER_COLUMN);
		// split the items into equally sized chunks
		section.columns = chunk(section.items.slice(0), ITEMS_PER_COLUMN);
		// and mark it as collapsible or not
		section.collapsible = section.columns.length > 1;
	});

	return data;
};

console.log(generateDate());