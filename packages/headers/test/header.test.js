const expect = require('expect.js');
const headers = require('src/js/header');
const Header = headers.Header;
//import expect from 'expect.js';
//import {Header} from './../src/js/header';
const SimpleHeader = headers.SimpleHeader;
const StaticNavHeader = headers.StaticNavHeader;

const Lang = require('src/js/modules/lang.js');
const Nav = require('src/js/modules/nav.js');
const Hamburg = require('src/js/modules/hamburg.js');
const Search = require('src/js/modules/search.js');

describe('3 kinds of Header API', () => {
  it('is definded', () => {
    expect(Header).to.be.a('function');
  });
  it('is definded', () => {
    expect(SimpleHeader).to.be.a('function');
  });
  it('is definded', () => {
    expect(StaticNavHeader).to.be.a('function');
  })
});


describe('Instance for Header', () => {
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

describe('Instance for Lang', () => {
  let containerEl;
  let langEl;

  beforeEach(() => {
    containerEl = document.createElement('div');
    containerEl.innerHTML = `<div class="ftc-header__lang" data-ftc-component="ftc-header-lang">
    `;
    document.body.appendChild(containerEl);
    langEl = containerEl.querySelector('[data-ftc-component="ftc-header-lang"]');
  });

  afterEach(() => {
    containerEl.removeChild(langEl);
    langEl = null;
    containerEl = null;
  });

  it('HTMLElement', () => {
    expect(langEl).to.be.a(HTMLElement);
  });
  it('Instance', () => {
    const lang = new Lang(langEl);
    expect(lang).to.be.a(Lang);
  })
});

