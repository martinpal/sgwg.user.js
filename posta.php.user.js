// ==UserScript==
// @name         Speed up message loading in posta.php
// @namespace    http://stargate-dm.cz/
// @version      0.1
// @description  Speed up message loading in posta.php
// @author       on/off
// @match        http://stargate-dm.cz/posta.php*
// @domains      stargate-dm.cz
// @grant        none
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

(function() {
    'use strict';

    function typeWriter(text, n) {
        $('#css-typing').html(text);
    }

    var scriptNode          = document.createElement ('script');
    scriptNode.type         = "text/javascript";
    scriptNode.textContent  = typeWriter.toString();

    addEventListener ("load", function() {
        var targ = document.getElementsByTagName ('head')[0] || document.body || document.documentElement;
        targ.appendChild (scriptNode);
    }, false);
})();
