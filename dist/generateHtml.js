'use strict';

const listItem = social => `
	<li class="o-share__action o-share__${social.name}">
		<a href="${social.url}" target="_blank" title="分享到${social.text}">
			<i>${social.text}</i>
		</a>
	</li>
`;

const buildSocialList = socials => `
	<ul>
		${socials.map(listItem)}
	</ul>
`;

/*
 * @param {Object} config - optional
 * @param {String} config.url
 * @param {String} config.title
 * @param {String} config.summary
 * @param {Array} config.links - ['wechat', 'weibo', 'linkedin', 'facebook', twitter], determine which social platform will be shown. If not specified, default to all.
 */
function generateHtml (
	{url='{{url}}', title='{{title}}', summary='{{summary}}', links=null} = config)  {

	const socialUrls = [
		{
		  name: "wechat",
		  text: "微信",
		  url: `http://www.ftchinese.com/m/corp/qrshare.html?title=${title}&url=${url}&ccode=2C1A1408`
		},
		{name: "weibo",
	    text: "微博",
	    url: `http://service.weibo.com/share/share.php?&appkey=4221537403&url=${url}&title=【${title}】${summary}&ralateUid=1698233740&source=FT中文网&sourceUrl=http://www.ftchinese.com/&content=utf8&ccode=2G139005`
	  },
	  {
      name: "linkedin",
      text: "领英",
      url: `http://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}&source=FT中文网`
    },
    {
      name: "facebook",
      text: "Facebook",
      url: `http://www.facebook.com/sharer.php?u=${url}`
    },
    {
      name: "twitter",
      text: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${url}&amp;text=【${title}】{{summary}}&amp;via=FTChinese`
    }
	];

	const socials = links 
		? socialUrls.filter(social => links.indexOf(social.name) > -1)
		: socialUrls;
		
	return buildSocialList(socials);
}

module.exports = generateHtml;
