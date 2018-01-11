const expect = require('expect.js');
const Header = require('./../src/js/header').Header;

describe('Header API', () => {
  it('is definded', () => {
    expect(Header).to.be.a('function');
  });
});

describe('Header instance', () => {
  let headerEl;
  let containerEl;

  beforeEach(() => {
    containerEl = document.createElement('div');
    containerEl.innerHTML = `<header class="ftc-header" data-ftc-component="ftc-header" data-ftc-header--no-js></header>`;
    document.body.appendChild(containerEl);
    headerEl = containerEl.querySelector('[data-ftc-component="ftc-header"]');
  });

  afterEach(() => {
    containerEl.removeChild(headerEl);
    headerEl = null;
    containerEl = null;
  });

  it('constructor', () => {
    const header = new Header(headerEl);
    expect(header).to.be.a(Header);
    expect(header.headerEl).to.equal(headerEl);
    expect(headerEl.getAttribute('data-ftc-header--js')).to.not.be(null);
  });
});
