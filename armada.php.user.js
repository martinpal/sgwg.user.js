// ==UserScript==
// @name         armada.php
// @namespace    http://stargate-dm.cz/
// @version      0.1
// @description  Utils for armada.php
// @author       on/off
// @match        http://sgwg.net/armada.php*
// @grant        none
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

(function() {
    'use strict';

    function my_tools() {

        this.xpath = function(query, object, qt) {
            if( !object ) object = document;
            var type = qt ? XPathResult.FIRST_ORDERED_NODE_TYPE: XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;
            var ret = document.evaluate(query, object, null, type, null);
            return (qt ? ret.singleNodeValue : ret);
        };

    }
    let tools = new my_tools();

    var scriptNode          = document.createElement ('script');
    scriptNode.type         = "text/javascript";
    scriptNode.textContent  = my_tools.toString() + 'let tools = new my_tools();';

    addEventListener ("load", function() {

        var targ = document.getElementsByTagName ('head')[0] || document.body || document.documentElement;
        targ.appendChild (scriptNode);

        var send_to_ra_inputs = tools.xpath('//*[@id="content-in"]/form[2]/table/tbody/tr/td[2]/input');
        for (var i=0; i < send_to_ra_inputs.snapshotLength; ++i) {
            var this_input = send_to_ra_inputs.snapshotItem(i);
            var select = this_input.parentNode.parentNode.firstElementChild.firstElementChild;
            var selected = select.options[select.selectedIndex].text;
            console.log(selected);
            var count = parseInt(selected.slice(selected.lastIndexOf('(')+1));
            console.log(selected);
            var button = document.createElement('input');
            button.setAttribute('type', 'submit');
            button.setAttribute('class', 'submit');
            button.setAttribute('value', 'MAX');
            button.style.width   = '32px';
            button.style.height  = '17px';
            button.style.padding = '0';
            button.style.margin  = '0';
            button.onclick = function(this_input, count) {
                this_input.value = count;
                return false;
            }.bind(this, this_input, count);
            this_input.parentNode.insertBefore(button, null);

        }

    }, false);
})();
