// ==UserScript==
// @name         planety.php
// @namespace    http://stargate-dm.cz/
// @version      0.1
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

        this.xpath = function(query, object, qt) { // Searches object (or document) for string/regex, returning a list of nodes that satisfy the string/regex
            if( !object ) object = document;
            var type = qt ? XPathResult.FIRST_ORDERED_NODE_TYPE: XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;
            var ret = document.evaluate(query, object, null, type, null);
            return (qt ? ret.singleNodeValue : ret);
        };

        this.planet_table_update = function() {
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
                    build_link.innerHTML = '<a href="/stavby.php?nap=' +this_id+ '&amp;ne_zast_plan=&amp;ne_stav_den=&amp;ne_kanly=" style="margin-left: .5em;">build</a>';
                    this_planet.parentNode.insertBefore(build_link, this_planet.nextSibling);
                }
            }
            window.setTimeout(tools.planet_table_update, 40);
        };
    }
    let tools = new my_tools();

    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    scriptNode.type                         = "text/javascript";
    scriptNode.textContent  = my_tools.toString() + 'let tools = new my_tools();';

    addEventListener ("load", function() {
        //alert("It's alive");

        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (scriptNode);

        window.setTimeout(tools.planet_table_update, 100);

    }, false);
})();
