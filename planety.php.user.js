// ==UserScript==
// @name         planety.php
// @namespace    http://stargate-dm.cz/
// @version      0.4
// @description  Utils for planety.php
// @author       on/off
// @match        http://stargate-dm.cz/planety.php*
// @match        http://sgwg.net/planety.php*
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

        this.planet_table_update = function() {
            var move_people = tools.xpath('//*[@id="p_lidi"]', null, true);
            if (move_people != undefined) {
                var v = move_people.value.toString();
                move_people.value = v.replace(/,/, '.');
            }

            var planets = tools.xpath('//*[@id="statistika_ajax"]/table/tbody/tr/td/a');
            for(var i = 0; i < planets.snapshotLength; ++i) {
                var this_planet = planets.snapshotItem(i);
                if ('done' == this_planet.getAttribute('done')) {
                    break;
                }
                this_planet.setAttribute('done','done');
                var this_link = this_planet.getAttribute('href');
                if (this_link != null && this_link.substr(0,23) == 'planety_detaily.php?id=') {
                    var id_pos = this_link.indexOf('=') + 1;
                    var this_id = this_link.substr(id_pos);
                    var build_link = document.createElement('a');
                    build_link.innerHTML = '<a href="/stavby.php?nap=' +this_id+ '&amp;ne_zast_plan=&amp;ne_stav_den=&amp;ne_kanly=" style="margin-left: .5em;">stavět</a>';
                    this_planet.parentNode.insertBefore(build_link, this_planet.nextSibling);
                }
            }
            var cells = tools.xpath('//*[@id="statistika_ajax"]/table/tbody/tr/td');
            for (var c = 0; c < cells.snapshotLength; ++c) {
                var this_cell = cells.snapshotItem(c);
                if (this_cell.innerHTML == "0" || this_cell.innerHTML == "0,0" || this_cell.innerHTML == "0,00") {
                    this_cell.style = 'color: #777;';
                }
            }
            var h6 = tools.xpath('//*[@id="statistika_ajax"]/table/tbody/tr[1]/th[6]/a', null, true);
            var h5 = tools.xpath('//*[@id="statistika_ajax"]/table/tbody/tr[1]/th[5]/a', null, true);
            var col = 0;
            if (h6 != null && h6.innerHTML == 'Spok.') {
                col = 6;
            } else if (h5 != null && h5.innerHTML == 'Spok.') {
                col = 5;
            }
            if (col != 0) {
                var  satisfaction = tools.xpath('//*[@id="statistika_ajax"]/table/tbody/tr/td[' +col+ ']');
                for (var s = 0; s < satisfaction.snapshotLength; ++s) {
                    var this_sat = satisfaction.snapshotItem(s);
                    if (parseInt(this_sat.innerHTML) == "100") {
                        this_sat.style = 'color: #0f0;';
                    } else if (parseInt(this_sat.innerHTML) >=90) {
                        this_sat.style = 'color: yellow;';
                    } else {
                        this_sat.style = 'color: #f77;';
                    }
                }
            }

            window.setTimeout(tools.planet_table_update, 40);
        };
    }
    let tools = new my_tools();

    var scriptNode          = document.createElement ('script');
    scriptNode.type         = "text/javascript";
    scriptNode.textContent  = my_tools.toString() + 'let tools = new my_tools();';

    addEventListener ("load", function() {

        var targ = document.getElementsByTagName ('head')[0] || document.body || document.documentElement;
        targ.appendChild (scriptNode);

        window.setTimeout(tools.planet_table_update, 100);

    }, false);
})();
