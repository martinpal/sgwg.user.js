// ==UserScript==
// @name         mapa_zobraz_galaxy.php
// @namespace    http://stargate-dm.cz/
// @version      0.4
// @description  Utils for mapa_zobraz_galaxy.php
// @author       on/off
// @match        http://stargate-dm.cz/mapa_zobraz_galaxy.php*
// @match        http://sgwg.net/mapa_zobraz_galaxy.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

// this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    function my_tools() {

        this.xpath = function(query, object, qt) {
            if( !object ) object = document;
            var type = qt ? XPathResult.FIRST_ORDERED_NODE_TYPE: XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;
            var ret = document.evaluate(query, object, null, type, null);
            return (qt ? ret.singleNodeValue : ret);
        };

        this.sector_table_update = function() {
            var all = tools.xpath('//*[@id="all"]',null,true);
            var rect = document.getElementById('report_button').getBoundingClientRect();
            var unoccupied_sectors = document.createElement("div");
            unoccupied_sectors.setAttribute("id", "unoccupied_sectors");
            unoccupied_sectors.setAttribute("style","position: absolute; width: 150px; top: " +(rect.top-4)+ "px; left: " +(rect.left+110)+ "px; z-index: 99; font-size: 75%; text-align: left; background-color: rgba(0,0,0,0.5); padding: 1em; border: 1px solid black;");
            all.parentNode.insertBefore(unoccupied_sectors, all);
            var sectors = this.xpath('//*[@id="map"]/area');
            for (var s = 0; s < sectors.snapshotLength; ++s) {
                var this_sector = sectors.snapshotItem(s);
                var href = this_sector.getAttribute('href');
                var title = this_sector.getAttribute('title');
                $.ajax({
                    async:    false,
                    type:     'GET',
                    url:      href,
                    success:  function(data, status) {
                        var search_from = data.indexOf('<select name="sektor">');
                        var to_find = '<tr><td>Neobsazeno </td><td style="background: #FFFFFF"><span style="background: #333;padding: 1px 3px;">'; // stargate-dm.cz only
                        var pos = data.indexOf(to_find, search_from);
                        if (pos == -1) {
                            to_find = '<tr><td>Neobsazeno</td><td style="background: #FFFFFF"><span style="background: #333;padding: 1px 3px;">'; //sgwg.net only
                            var pos = data.indexOf(to_find, search_from);
                            if (pos == -1) {
                                return;
                            }
                        }
                        pos += to_find.length;
                        var unoccupied = parseInt(data.substring(pos));
                        to_find = "' selected='selected'>";
                        pos = data.indexOf(to_find, search_from);
                        pos += to_find.length;
                        var sector_name = data.substring(pos, data.indexOf('(', pos));
                        to_find = "<option value='";
                        var pos2 = data.lastIndexOf(to_find, pos);
                        pos2 += to_find.length;
                        var sector_id = parseInt(data.substring(pos2));
                        unoccupied_sectors.innerHTML += '<div><a href="' +href+ '">' +sector_name+ " (" +sector_id+ ")</a>: " +unoccupied+ "</div>";
                    }
                });
            }
        };


        this.colony_table_update = function() {
            var all = tools.xpath('//*[@id="all"]',null,true);
            var rect = document.getElementById('report_button').getBoundingClientRect();
            var free_colonies = document.createElement("div");
            free_colonies.setAttribute("id", "free_colonies");
            free_colonies.setAttribute("style","position: absolute; width: 150px; top: " +(rect.top-4)+ "px; left: " +(rect.left+110)+ "px; z-index: 99; font-size: 75%; text-align: left; background-color: rgba(0,0,0,0.5); padding: 1em; border: 1px solid black;");
            all.parentNode.insertBefore(free_colonies, all);
            var sectors = this.xpath('//*[@id="map"]/area');
            var found = false;
            for (var s = 0; s < sectors.snapshotLength && !found; ++s) {
                var this_sector = sectors.snapshotItem(s);
                var href = this_sector.getAttribute('href');
                var title = this_sector.getAttribute('title');
                $.ajax({
                    async:    false,
                    type:     'GET',
                    url:      href,
                    success:  function(data, status) {
                        var jqr = $(jQuery.parseHTML(data));
                        var colonies = jqr.find('#kolonie > tbody > tr > td > a');
                        $.each(colonies, function(free_colonies, k, v) {
                            var this_colony = v.parentNode;
                            if (-1 != this_colony.innerHTML.indexOf('Majitel: neobsazeno') && -1 != this_colony.innerHTML.indexOf('Velikost: velká')) {
                                var this_link = v.getAttribute('href');
                                free_colonies.innerHTML += '<div><a href="' +this_link+ '">Kolonie</a></div>';
                                found = true;
                            }
                        }.bind(this, free_colonies));
                    }
                });
            }
        };
    }

    var scriptNode          = document.createElement ('script');
    scriptNode.type         = "text/javascript";
    scriptNode.textContent  = my_tools.toString() + 'let tools = new my_tools();';

    addEventListener ("load", function() {

        var targ = document.getElementsByTagName ('head')[0] || document.body || document.documentElement;
        targ.appendChild (scriptNode);

        var heading = tools.xpath('//*[@id="content-in"]/h1', null, true);

        var button = document.createElement('input');
        button.setAttribute('type', 'submit');
        button.setAttribute('class', 'submit');
        button.setAttribute('value', 'Volné planety');
        button.setAttribute('style', 'float: right;');
        button.setAttribute('id', 'report_button');
        button.setAttribute('onclick', 'tools.sector_table_update()');
        heading.parentNode.insertBefore(button, heading);

        var button = document.createElement('input');
        button.setAttribute('type', 'submit');
        button.setAttribute('class', 'submit');
        button.setAttribute('value', 'Volné kolonie');
        button.setAttribute('style', 'float: right;');
        button.setAttribute('id', 'report_button');
        button.setAttribute('onclick', 'tools.colony_table_update()');
        heading.parentNode.insertBefore(button, heading);

    }, false);
})();
