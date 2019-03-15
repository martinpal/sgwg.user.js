// ==UserScript==
// @name         planety.php
// @namespace    http://stargate-dm.cz/
// @version      0.7
// @description  Utils for planety.php
// @author       on/off
// @match        http://stargate-dm.cz/planety.php*
// @match        http://sgwg.net/planety.php*
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

        this.planet_table_update = function() {
            var move_people = tools.xpath('//*[@id="p_lidi"]', null, true);
            if (move_people != undefined) {
                if (move_people.value != '') {
                    // bug workaround: change decimal ',' to decimal '.' - this is how server expects this input
                    var v = move_people.value.toString();
                    move_people.value = v.replace(/,/, '.');
                } else {
                    // if tne input is empty, then recommend a meaningful action towards balancing the number of inhabitants of all planets
                    // find the planets with highest and lowest number of inhabitants and move as many inhabitants as necessary from one to the other so that one
                    // of them has the right number of inhabitants, which is TOTAL_INHABITANTS/NUMBER_OF_PLANETS
                    var city_rows = tools.xpath('//*[@id="statistika_ajax"]/table/tbody/tr');
                    var planets = [ ];
                    for (var r=0; r < city_rows.snapshotLength; ++r) {
                        var this_row = city_rows.snapshotItem(r);
                        if (this_row.firstElementChild.tagName == 'TH') { // first row - heading, not a planet
                            continue;
                        }
                        if (this_row.firstElementChild.innerHTML == 'Celkem') { // last row of the table is not a planet
                            break;
                        }
                        if (this_row.firstElementChild.innerHTML.indexOf('KANLY') >= 0) { // cannot move pop of KANLY planets - exclude from counting
                            continue;
                        }
                        var pop = this_row.firstElementChild.nextElementSibling;
                        if(window.location.href.indexOf("http://stargate-dm.cz/") == 0) {
                            pop = this_row.firstElementChild.nextElementSibling.nextElementSibling;
                        }
                        var planet = { };
                        planet.name       = this_row.firstElementChild.firstElementChild.innerHTML;
                        planet.url        = this_row.firstElementChild.firstElementChild.href;
                        planet.id         = parseInt(planet.url.slice(planet.url.indexOf('id=')+3));
                        planet.pop        = parseFloat(pop.innerHTML.replace(/ /g,'').replace(/,/,'.'));
                        planet.free       = parseFloat(pop.nextElementSibling.innerHTML.replace(/ /g,'').replace(/,/,'.'));
                        planet.unemployed = parseFloat(pop.nextElementSibling.nextElementSibling.innerHTML.replace(/ /g,'').replace(/,/,'.'));
                        planet.happiness  = parseInt(pop.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
                        planets.push(planet);
                        console.log(JSON.stringify(planet, null, 4));
                    }

                    var sum_pop = 0;
                    $.each(planets, function(k, v) {
                        sum_pop += v.pop;
                    });
                    console.log(sum_pop);
                    var target_pop = sum_pop / planets.length;
                    console.log(target_pop);

                    var min_planet = -1;
                    var min_pop = 9999999999999;
                    $.each(planets, function(k, v) {
                        if (min_pop > v.pop) {
                            min_planet = k;
                            min_pop = v.pop;
                        }
                    });
                    console.log(JSON.stringify(planets[min_planet], null, 4));
                    var max_planet = -1;
                    var max_pop = -1;
                    $.each(planets, function(k, v) {
                        if (max_pop < v.pop) {
                            max_planet = k;
                            max_pop = v.pop;
                        }
                    });
                    console.log(JSON.stringify(planets[max_planet], null, 4));

                    var to_send = 0;
                    if (Math.min(target_pop - min_pop, planets[min_planet].free) > max_pop - target_pop) {
                        // min_planet can receive more pop thatn the max_planet can send
                        to_send = max_pop - target_pop;
                    } else {
                        to_send = Math.min(target_pop - min_pop, planets[min_planet].free);
                    }
                    console.log(to_send);
                    move_people.value = to_send.toFixed(3);

                    var from_planet_combo = tools.xpath('//*[@id="z_pl"]', null, true);
                    from_planet_combo.value = planets[max_planet].id;
                    var to_planet_combo = tools.xpath('//*[@id="na_pl"]', null, true);
                    to_planet_combo.value = planets[min_planet].id;
                }
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
