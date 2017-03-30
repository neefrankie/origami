const path = require('path');
const fs = require('fs-jetpack');
const getSocials = require('./get-socials.js');

/* Generate a nunjuck partials file.
 * @param {Object} config - optional
 * @param {String} config.url
 * @param {String} config.title
 * @param {String} config.summary
 * @param {Array} config.links - ['wechat', 'weibo', 'linkedin', 'facebook', twitter], determine which social platform will be shown. If not specified, default to all.
 * @param {Boolean | String} config.sprite
 */
function generateHtml ({links=['wechat', 'weibo', 'linkedin', 'facebook', 'twitter'], destDir='views/partials'} = {})  {
  output = path.resolve(process.cwd(), `${destDir}/o-share.html`);

	const socials = getSocials({
    url:'{{share.url | escape}}',
    title: '{{share.title | escape}}',
    summary: '{{share.summary | escape}}',
    links: links
  });

// An arrow function. It accepts a `social` object, returns a constructed string.
  const listItem = (social) => `
  <li class="o-share__action o-share__${social.name}">
    <a href="${social.url}" target="_blank" title="分享到${social.text}">
      <i>${social.text}</i>
    </a>
  </li>
 `;

// Concatenate Share's html
  const html = `<ul>${socials.map(listItem).join('')}</ul>`;

  return fs.writeAsync(output, html)
    .then(() => {
			console.log(`Generated Share partials file: ${output}`);
		})
		.catch(err => {
			throw err;
		});
}

if (require.main === module) {
	generateHtml({
      destDir: 'partials'
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = generateHtml;
