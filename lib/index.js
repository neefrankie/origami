const buildPage = require('./build-page');

const matrix = [
	{
		"title": "支持",
		"items": [
			{
				"text": "关于我们",
				"href": "http://www.ftchinese.com/m/corp/aboutus.html"
			},
			{
				"text": "职业机会",
				"href": "http://www.ftchinese.com/jobs/?from=ft"
			},
			{
				"text": "问题回馈",
				"href": "http://www.ftchinese.com/m/corp/faq.html"
			},
			{
				"text": "联系方式",
				"href": "http://www.ftchinese.com/m/corp/contact.html"
			}
		]
	},
	{
		"title": "法律事务",
		"items": [

			{
				"text": "服务条款",
				"href": "http://www.ftchinese.com/m/corp/service.html"
			},
			{
				"text": "版权声明",
				"href": "http://www.ftchinese.com/m/corp/copyright.html"
			}
		]
	},
	{
		"title": "服务",
		"items": [
			{
				"text": "广告业务",
				"href": "http://www.ftchinese.com/m/corp/sales.html"
			},
			{
				"text": "会议活动",
				"href": "http://www.ftchinese.com/m/events/event.html"
			},
			{
				"text": "会员信息中心",
				"href": "http://www.ftchinese.com/m/marketing/home.html"
			},
			{
				"text": "最新动态",
				"href": "http://www.ftchinese.com/m/marketing/ftc.html"
			},
			{
				"text": "合作伙伴",
				"href": "http://www.ftchinese.com/m/corp/partner.html"
			}
		]
	},
	{
		"title": "关注我们",
		"items": [
			{
				"text": "微信",
				"href": "http://www.ftchinese.com/m/corp/follow.html"
			},
			{
				"text": "微博",
				"href": "http://weibo.com/ftchinese"
			},
			{
				"text": "Linkedin",
				"href": "https://www.linkedin.com/company/4865254?trk=hp-feed-company-name"
			},
			{
				"text": "Facebook",
				"href": "https://www.facebook.com/financialtimeschinese"
			},
			{
				"text": "Twitter",
				"href": "https://twitter.com/FTChinese"
			}
		]
	},
	{
		"title": "FT产品",
		"items": [
			
			{
				"text":"FT研究院",
				"href": "http://www.ftchinese.com/m/marketing/intelligence.html"
			},
			{
				"text":"FT商学院",
				"href": "http://www.ftchinese.com/channel/mba.html"
			},
			{
				"text":"FT电子书",
				"href": "http://www.ftchinese.com/m/marketing/ebook.html"
			},
			{
				"text":"数据新闻",
				"href": "http://www.ftchinese.com/channel/datanews.html"
			},
			{
				"text": "FT英文版",
				"href": "https://www.ft.com/"
			}
		]
	}
];

class Footer {
/**
 * @param {String} theme - `dark` or `light`
 */
	constructor(theme) {
		this.theme = theme;
	}

	get data() {
		return {
			footer: {
				theme: `theme-${this.theme}`,
				matrix,
				copyrightYear: (new Date()).getFullYear()
			}
		}
	}

	async buildDist() {
		await buildPage(Object.assign({
			name: `o-footer-${this.theme}`,
			template: 'partials/o-footer.html'
		}, this.data))
	}

	static async init() {
		const themes = ['dark', 'light'];
		const instances = [];
		for (let theme of themes) {
			const footer = new Footer(theme);
			footer.buildDist();
			instances.push(footer);
		}
		return instances;
	}
}

if (require.main == module) {
	Footer.init()
		.catch(err => {
			console.log(err);
		});
}

module.exports = Footer;