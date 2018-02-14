// ==UserScript==
// @name         sportka.php
// @namespace    http://stargate-dm.cz/
// @version      0.1
// @description  Automatic bet in sportka.php
// @author       on/off
// @match        http://stargate-dm.cz/sportka.php*
// @domains      stargate-dm.cz
// @grant        none
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

(function() {
    'use strict';

    function xpath(query, object, qt) {
        if( !object ) object = document;
        var type = qt ? XPathResult.FIRST_ORDERED_NODE_TYPE: XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;
        var ret = document.evaluate(query, object, null, type, null);
        return (qt ? ret.singleNodeValue : ret);
    }

    addEventListener("load", function() {
        for (var i=1;i<=20;i++) {
            var input = xpath('//*[@id="content-in"]/center[2]/form/table/tbody/tr[2]/td[' +i+ ']/input',null,true);
            input.value=(i-1)*5+4;
        }
    });
})();
