/*
 * @param {Array} socials - Array of socials object.
 * @param {Object} social - required.
 * @param {String} social.name - social platform's name in English
 * @param {String} social.url - social platform's share api
 * @param {String} social.text - social paltform's name in Chinese
 * @param {Boolean | String} sprite - whether use svg sprite as icon image. `true` use the default svg file. If the value is a string, it should be a valid URL poiting to the svg file.
 */
function buildSocialList(socials, sprite) {
// Note the tertiary operator within tertiary operator.
// If sprite exits, then test whether it is a string. If sprite is a string, use it as URL, otherwise use the default URL.
// If sprite does not exits, URL is null.
  const spriteUrl = sprite 
    ? ((typeof sprite === 'string') ? sprite : '/bower_components/ftc-social-images/static/sprite/all.svg') 
    : null;
// This is an arrow function. It accepts a `social` object, returns a constructed string.
  const listItem = (social) => `
  <li class="o-share__action o-share__${social.name}">
    <a href="${social.url}" target="_blank" title="分享到${social.text}">
      <i>${social.text}</i>
      ${spriteUrl ? `<svg><use xlink:href="${spriteUrl}#${social.name}"></use></svg>` : ''}
    </a>
  </li>
 `;

  return `<ul>${socials.map(listItem).join('')}</ul>`;
}

/*
 * @param {Object} config - optional
 * @param {String} config.url
 * @param {String} config.title
 * @param {String} config.summary
 * @param {Array} config.links - ['wechat', 'weibo', 'linkedin', 'facebook', twitter], determine which social platform will be shown. If not specified, default to all.
 * @param {Boolean | String} config.sprite
 */
function generateHtml (
	{url='{{share.url}}', title='{{share.title}}', summary='{{share.summary}}', links=null, sprite=false} = config)  {

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

	return buildSocialList(socials, sprite);
};

export default generateHtml;