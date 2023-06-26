const {resolve} = require('path');
const buildPage = require('./build-page');

const themes = ['dark', 'light'];

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
		if (!themes.includes(theme)) {
			throw new Error(`Cannot create a Footer instance.\nOnly those themes allowed: ${themes.join(' | ')}`)
		}
		this.theme = theme;
		this.distDir = resolve(__dirname, '../dist');
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
		return await buildPage(Object.assign({
			out: `${this.distDir}/o-footer-${this.theme}.html`,
			template: 'dist.html',
			inline: true
		}, this.data))
	}

	static async init() {
		const instances = [];
		for (let theme of themes) {
			const footer = new Footer(theme);
			try {
				await footer.buildDist();
			} catch (e) {
				console.log(e);
			}
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