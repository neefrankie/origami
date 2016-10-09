import Toggle, {ToggleMenu} from '../../main.js';

new Toggle('.toggle [data-o-component="o-toggle"]');

const menu = new ToggleMenu('.menu', {
	autoCollapse: true,
	autoCollapseAnchor: 'menu-link'
});
console.log(menu);