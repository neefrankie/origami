const nunjucks = require('nunjucks');
const co = require('co');
const helper = require('./helper');

nunjucks.configure('demos/src', {
  autoescape: false,
  noCache: true
});

const demos = [
  {
    tmpl: 'demo-index.html',
    title: 'index',
    name: 'index.html',
  }, 
  {
    tmpl: 'demo-full.html',
    title: 'footer',
    name: 'dark-theme.html'
  }, 
  {
    tmpl: 'demo-full.html',
    title: 'footer-light',
    name: 'light-theme.html',
    theme: 'theme-light'
  }, 
  {
    tmpl: 'demo-simple.html',
    title: 'simple-footer',
    name: 'simple-footer.html',
    theme: 'theme-light'
  }
];

co(function *() {
	const result = yield helper.render('demo-index.html', {demos: demos});
	console.log(result);
});
nunjucks.render('demo-index.html', {demos: demos}, function(err, result) {
	console.log(result);
});