import React from "react";
import ReactDOM from "react-dom";
// import 'foundation-sites';
import BenefitsPreview from './js/react/benefitsApp.jsx';

// const browserIsIE = !!window.MSInputMethodContext && !!document.documentMode;

// Polyfill for closest - IE11
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var el = this;

        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Polyfill for CustomEvent used in localization.js - IE11
(function () {

    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    window.CustomEvent = CustomEvent;
})();




function initReactApps() {
    const benefitsDomContainer = document.querySelector('#benefitsApp');
    if (benefitsDomContainer) {
        ReactDOM.render(React.createElement(BenefitsPreview), benefitsDomContainer);
    }
}



// $(document).foundation();
initReactApps();