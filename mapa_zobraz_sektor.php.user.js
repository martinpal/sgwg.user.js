// ==UserScript==
// @name         mapa_zobraz_sektor.php
// @namespace    http://stargate-dm.cz/
// @version      0.2
// @description  Utils for mapa_zobraz_sektor.php
// @author       on/off
// @match        http://stargate-dm.cz/mapa_zobraz_sektor.php*
// @match        http://sgwg.net/mapa_zobraz_sektor.php*
// @grant        none
// @license      AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl-3.0.txt
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

        this.change_sector = function(id) { // sets the sector in the form and submits the form
            var combo = tools.xpath('//*[@id="content-in"]/center/form/table/tbody/tr/td[1]/table/tbody/tr[2]/td/select', null, true);
            combo.value = id;
            var form = tools.xpath('//*[@id="content-in"]/center/form', null, true);
            form.submit();
        };
    }

    var scriptNode          = document.createElement ('script');
    scriptNode.type         = "text/javascript";
    scriptNode.textContent  = my_tools.toString() + 'let tools = new my_tools();';

    addEventListener ("load", function() {

        var targ = document.getElementsByTagName ('head')[0] || document.body || document.documentElement;
        targ.appendChild (scriptNode);

        var sectors = tools.xpath('//*[@id="content-in"]/center/form/table/tbody/tr/td[1]/table/tbody/tr[2]/td/select/option');
        var i = 0;
        for(i = 0; i < sectors.snapshotLength; ++i) {
            var selected = sectors.snapshotItem(i).getAttribute('selected');
            if (selected != null) {
                break;
            }
        }
        var prev_sector = null;
        var this_sector = null;
        var next_sector = null;
        if ( i-1 >= 0 && i < sectors.snapshotLength) {
            prev_sector = sectors.snapshotItem(i-1).innerHTML;
        }
        if ( i >= 0  && i < sectors.snapshotLength) {
            this_sector = sectors.snapshotItem(i).innerHTML;
        }
        if ( i >= 0  && i+1 < sectors.snapshotLength) {
            next_sector = sectors.snapshotItem(i+1).innerHTML;
        }
        var heading = tools.xpath('//*[@id="content-in"]/h1', null, true);
        var planet_iterator_div = document.createElement('div');
        if (i>0 && i<sectors.snapshotLength-1) {
            planet_iterator_div.innerHTML = '<div style="float: right; font-size: 185%;"><a href="#" onclick="tools.change_sector(' +i+ '); return false;">&lt;&lt;</a>&nbsp;<a href="#" onclick="tools.change_sector(' +(i+1)+ ')">' +this_sector+ '</a>&nbsp;<a href="#" onclick="tools.change_sector(' +(i+2)+ '); return false;">&gt;&gt;</a></div>';
        } else if (i==0) {
            planet_iterator_div.innerHTML = '<div style="float: right; font-size: 185%;"><a href="#" onclick="return false;">&lt;&lt;</a>&nbsp;<a href="#" onclick="tools.change_sector(' +(i+1)+ ')">' +this_sector+ '</a>&nbsp;<a href="#" onclick="tools.change_sector(' +(i+2)+ '); return false;">&gt;&gt;</a></div>';
        } else {
            planet_iterator_div.innerHTML = '<div style="float: right; font-size: 185%;"><a href="#" onclick="tools.change_sector(' +i+ '); return false;">&lt;&lt;</a>&nbsp;<a href="#" onclick="tools.change_sector(' +(i+1)+ ')">' +this_sector+ '</a>&nbsp;<a href="#" onclick="return false;">&gt;&gt;</a></div>';
        }
        heading.parentNode.insertBefore(planet_iterator_div, heading);

        var occupy_links = tools.xpath('//*[@id="planety"]/tbody/tr/td/a[2]');
        for (var o = 0; o < occupy_links.snapshotLength; ++o) {
            var this_link = occupy_links.snapshotItem(o);
            if (this_link.innerHTML == "Obsadit") {
                var sabotage_link = this_link.cloneNode(true);
                sabotage_link.href = sabotage_link.href.replace(/jakej=1/, "jakej=7");
                sabotage_link.innerHTML = "Sabotovat";
                this_link.parentNode.appendChild(sabotage_link);
                var nbsp = document.createElement('span');
                nbsp.innerHTML = '&nbsp;';
                this_link.parentNode.appendChild(nbsp);
                var partisan_link = this_link.cloneNode(true);
                partisan_link.href = sabotage_link.href.replace(/jakej=1/, "jakej=8");
                partisan_link.innerHTML = "Partizánit";
                this_link.parentNode.appendChild(partisan_link);
            }
        }
    }, false);
})();
