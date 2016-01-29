/**
 * @class Tooltip
 *
 * @param {string} text
 * @param {HTMLElement} refEl
 */
function Tooltip(text, refEl) {
 	this.cssClass = 'o-share-tooltip';

 	/**
	 * Creates a tooltip element
	 *
	 * @private
	 * @returns {HTMLElement}
	 */
	function createTooltip(cssClass) {
		const tipEl = document.createElement('div');
		tipEl.className = cssClass;
		tipEl.innerHTML = '<div class="' + cssClass + '__text">' + text + '</div><div class="' + cssClass + '__arrow"></div>';
		return tipEl;
	}

	function renderTooltip(tipEl) {
		refEl.insertBefore(tipEl, refEl.childNodes[0]);
		tipEl.style.width = tipEl.clientWidth + 'px';
		tipEl.style.left = (refEl.offsetWidth - tipEl.offsetWidth) / 2 + 'px';
		tipEl.style.opacity = 1;
	}

	this.tooltipEl = createTooltip(this.cssClass);
	renderTooltip(this.tooltipEl);
}

Tooltip.prototype.setText = function(text) {
	this.tooltipEl.querySelector('.' + this.cssClass + '__text').innerText = text;
};

Tooltip.prototype.destroy = function() {
	this.tooltipEl.parentElement.removeChild(this.tooltipEl);
	this.tooltipEl = undefined;
};

module.exports = Tooltip;