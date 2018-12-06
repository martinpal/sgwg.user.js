// ==UserScript==
// @name         vesmir.php
// @namespace    http://stargate-dm.cz/
// @version      0.1
// @description  Utils for vesmir.php
// @author       on/off
// @match        http://stargate-dm.cz/vesmir.php*
// @match        http://sgwg.net/vesmir.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
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

        var rows = tools.xpath('//*[@id="content-in"]/table/tbody/tr');
        var sums = [ ];
        var last_row;
        for (var r = 0; r < rows.snapshotLength; ++r) {
            var this_row = rows.snapshotItem(r);
            var this_cell = this_row.firstElementChild;
            var i = 0;
            while (this_cell != undefined) {
                console.log('text', i, this_cell.textContent);
                var val = parseInt(this_cell.textContent.replace(/ /g,'').replace(/,/,'.'));
                console.log('int', i, val);
                if (!isNaN(val)) {
                    if (sums[i]) {
                        sums[i] += val;
                    } else {
                        sums[i] = val;
                    }
                }
                this_cell = this_cell.nextElementSibling;
                ++i;
            }
            last_row = this_row;
        }
        var sum_row = document.createElement('tr');
        var c = 0;
        $.each(sums, function (k, v) {
            console.log(k, v);
            if (c==0) {
                sum_row.innerHTML += '<td>Celkem:</td>';
            } else {
                if (isNaN(v)) {
                    sum_row.innerHTML += '<td></td>';
                } else {
                    sum_row.innerHTML += '<td>' +v.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1 ')+ '</td>';
                }
            }
            last_row.parentNode.insertBefore(sum_row, null);
            ++c;
        });

    }, false);
})();
