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

function generateSocialTags (config)  {

	if (!config) {
		config = {
			url: '{{url}}',
			title: '{{title}}',
			summary: '{{summary}}'
		}
	}

	const socialUrls = [
		{
		  name: "wechat",
		  text: "微信",
		  url: `http://service.weibo.com/share/share.php?&appkey=4221537403&url=${config.url}&title=【${config.title}】${config.summary}&ralateUid=1698233740&source=FT中文网&sourceUrl=http://www.ftchinese.com/&content=utf8&ccode=2G139005`
		},
		{name: "weibo",
	    text: "微博",
	    url: `http://www.linkedin.com/shareArticle?mini=true&url=${config.url}&title=${config.title}&summary=${config.summary}&source=FT中文网`
	  },
	  {
      name: "linkedin",
      text: "领英",
      url: `http://www.linkedin.com/shareArticle?mini=true&url=${config.url}&title=${config.title}&summary=${config.summary}&source=FT中文网`
    },
    {
      name: "facebook",
      text: "Facebook",
      url: `http://www.facebook.com/sharer.php?u=${config.url}`
    },
    {
      name: "twitter",
      text: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${config.url}&amp;text=【${config.title}】{{summary}}&amp;via=FTChinese`
    }
	];

	const socials = config.links 
		? socialUrls.filter(social => config.links.indexOf(social.name) > -1)
		: socialUrls;
		
	return buildSocialList(socials);
};

export default generateSocialTags;