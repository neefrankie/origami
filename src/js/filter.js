const kindof = require('kind-of');
// If feature is null, use default themes.
// If feature is a string, filter themes to find the entry
// If feature is an object, return is an an array
function filter(themes, feature) {
	const defaultTheme = themes.filter(theme => {
				return theme.name === 'default';
			})[0];
// If feature is a string or object, nullify theme.name so that output filename do not have affix like -round or -pink.	
	switch (kindof(feature)) {
		case "string":
			return themes.filter(theme => {
				return theme.name === feature;
			}).map(theme => {
				theme.name = null;
				return theme;
			});

		case "object":
			feature.name = null;
			return [Object.assign({}, defaultTheme, feature)]

		case "null":
			return themes
	}	
}

module.exports = filter;