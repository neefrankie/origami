import Toggle, {ToggleMenu} from '../../main.js';

new Toggle('.toggle [data-o-component="o-toggle"]', {
	target: '.toggle-target',
	callback: function(state, e, targetEl) {
		console.log(state);
		console.log(targetEl);
		targetEl.style.backgroundColor = 'red';
	}
});

const menu = new ToggleMenu('.menu', {
	autoCollapse: true,
	autoCollapseAnchor: 'menu-link'
});
console.log(menu);