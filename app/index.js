'use strict'
require('./styles.scss');
import { Share } from './share.es6';

let shareDiv = document.querySelector('.share-links');

new Share(shareDiv);
