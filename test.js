const socialList = require('./social-list');
const helper = require('./lib/helper');

const socialNames = socialList.map(item => item.name);

var themeNames = socialList.map(item => {
  const name = item.name;
  const themes = Object.keys(item.themes);
  return themes.map(theme => {
    return (theme === 'default') ? item.name : `${item.name}-${theme}`;
  });
});

themeNames = helper.zip(themeNames);

console.log(socialNames);
console.log(themeNames.map(group => {
  return group.map(name => {
    return `'${name}'`;
  })
}).join());
