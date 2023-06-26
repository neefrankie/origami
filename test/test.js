const assert = require('assert');
const Footer = require('../lib');
const buildPage = require('../lib/build-page');
const {resolve} = require('path');

describe('Footer', function() {
  describe('#wrong theme', function() {
    it('should throw error using themes other than "dark" or "light"', function() {
      assert.throws(() => new Footer('crystal'), Error);
    });
  });
  describe('dark', function() {
    it('should create an instance with "dark" theme', function() {
      assert.doesNotThrow(() => new Footer('dark'), Error);
    });
  });
});

describe('Footer data', function() {
  const footer = new Footer('dark');
  it('data should have value', function() {
    assert.ok(footer.data);
  });

  it('data should have theme-dark', function() {
    assert.equal(footer.data.footer.theme, 'theme-dark');
  });

  it('data should have copyrightYear', function() {
    assert.equal(footer.data.footer.copyrightYear, (new Date()).getFullYear());
  });

  it('data should have matrix array', function() {
    assert.ok(Array.isArray(footer.data.footer.matrix));
  });
});

describe('buildPage', function() {
  const footer = new Footer('light');
  it('should produce html file', function() {
    buildPage({
      out: resolve(__dirname, `../.tmp/test.html`),
      template: 'index.html',
      footer: footer.data.footer
    })
    .catch(err => {
      assert.ifError(err);
    });
  });
});


