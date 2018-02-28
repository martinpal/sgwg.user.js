// ==UserScript==
// @name         stavby.php
// @namespace    http://stargate-dm.cz/
// @version      0.9
// @description  Utils for stavby.php
// @author       on/off
// @match        http://stargate-dm.cz/stavby.php*
// @match        http://sgwg.net/stavby.php*
// @grant        none
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

(function() {
    'use strict';

    // Pole
    //   t1: prumyslova
    //   t2: vojenska
    //   t3: civilni
    function my_tools() {
        this.building_name = [ ];
        this.building_name['1'] = "Město";
        this.building_name['2'] = "Naquadahový důl";
        this.building_name['3'] = "Triniový důl";
        this.building_name['5'] = "Kasárna";
        this.building_name['6'] = "Laboratoř";
        this.building_name['7'] = "Loděnice";
        this.building_name['a'] = "Park";
        this.building_name['b'] = "Hvězdná brána";
        this.building_name['c'] = "Mincovna";

        this.building_tile = [ ];
        this.building_tile['1'] = "t3";
        this.building_tile['2'] = "t1";
        this.building_tile['3'] = "t1";
        this.building_tile['5'] = "t2";
        this.building_tile['6'] = "t1";
        this.building_tile['7'] = "t2";
        this.building_tile['a'] = "t3";
        this.building_tile['b'] = "t1";
        this.building_tile['c'] = "t3";

        this.picture_to_building_id = [ ];
        this.picture_to_building_id['1'] = "1";
        this.picture_to_building_id['2'] = "2";
        this.picture_to_building_id['3'] = "3";
        this.picture_to_building_id['5'] = "5";
        this.picture_to_building_id['6'] = "6";
        this.picture_to_building_id['7'] = "7";
        this.picture_to_building_id['10'] = "a";
        this.picture_to_building_id['11'] = "c"; // this id is swapped with next line on the server, hence the need for this table
        this.picture_to_building_id['12'] = "b";

        this.change_from = [ ];
        this.change_from['2'] = [ '3', 'c' ]; // TRI/min -> NAQ
        this.change_from['3'] = [ '2', 'c' ]; // NAQ/min -> TRI
        this.change_from['5'] = [ '2', '3', '6', '7' ]; // NAQ/TRI/min/lod -> kas
        this.change_from['6'] = [ '2', '3', '5', '7', 'c' ]; // NAQ/TRI/lod/kas/min -> LAB
        this.change_from['7'] = [ '2', '3', '5', '6' ]; // NAQ/TRI/kas/min -> lod

        this.batch_sizes = [1,2,5,10];

        this.xpath = function(query, object, qt) { // Searches object (or document) for string/regex, returning a list of nodes that satisfy the string/regex
            if( !object ) object = document;
            var type = qt ? XPathResult.FIRST_ORDERED_NODE_TYPE: XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;
            var ret = document.evaluate(query, object, null, type, null);
            return (qt ? ret.singleNodeValue : ret);
        };

        this.changed_tiles = 0;

        this.tile_type = function(tile) {
            var tile = this.xpath('//*[@id="pp' +tile+ '"]',null,true);
            var on_click = tile.getAttribute('onclick');
            var type = on_click.slice(7,9);
            return type;
        };

        this.my_build = function(what,fitting,src,count) {
            var can_build_today_elem = this.xpath('//*[@id="content-in"]/table/tbody/tr[2]/td[4]',null,true);
            var can_build_today = parseInt(can_build_today_elem.innerHTML);
            var needed_tile = this.building_tile[what];
            //alert("Build: " +what+ ", " +fitting+ ", " +needed_tile);
            var placed = 0;
            for (var t=1;t<=64 && can_build_today > this.changed_tiles;t++) {
                var type = this.tile_type(t);
                if ((document.getElementById('hh' +t).value == 0) && (!fitting || (type == needed_tile))) {
                    //alert("Can place " +what+ " on tile " +t+ " type " +type);
                    document.getElementById('hh' +t).value=what;
                    document.getElementById('pp' +t).src=src;
                    document.getElementById('pp' +t).style.borderWidth="2px";
                    document.getElementById('pp' +t).style.borderColor="yellow";
                    document.getElementById('pp' +t).style.borderStyle="dotted";
                    this.changed_tiles++;
                    if (++placed >= count) {
                        return;
                    }
                }
            }
        };

        this.my_change = function(what,orig,src,count) {
            //alert("Build: " +what+ ", " +orig+ ", " +src+ ", " +count);
            var can_build_today_elem = this.xpath('//*[@id="content-in"]/table/tbody/tr[2]/td[4]',null,true);
            var can_build_today = parseInt(can_build_today_elem.innerHTML);
            var needed_tile = this.building_tile[what];
            var placed = 0;
            // first try to place on suitable tiles ...
            for (var t=1;t<=64 && can_build_today > this.changed_tiles;t++) {
                var type = this.tile_type(t);
                //alert(type+ " " +document.getElementById('hh' +t).value+ " " +orig+ " " +needed_tile);
                if (document.getElementById('hh' +t).value == orig && (type == needed_tile)) {
                    //alert("Build: " +what+ ", " +orig+ ", " +src+ ", " +count);
                    document.getElementById('hh' +t).value=what;
                    document.getElementById('pp' +t).src=src;
                    document.getElementById('pp' +t).style.borderWidth="2px";
                    document.getElementById('pp' +t).style.borderColor="orange";
                    document.getElementById('pp' +t).style.borderStyle="dotted";
                    this.changed_tiles++;
                    if (++placed >= count) {
                        return;
                    }
                }
            }
            // ... then continue with not suitable tiles
            for (var t=1;t<=64 && can_build_today > this.changed_tiles;t++) {
                var type = this.tile_type(t);
                if (document.getElementById('hh' +t).value == orig && (type != needed_tile)) {
                    //alert("Build: " +what+ ", " +orig+ ", " +src+ ", " +count);
                    document.getElementById('hh' +t).value=what;
                    document.getElementById('pp' +t).src=src;
                    document.getElementById('pp' +t).style.borderWidth="2px";
                    document.getElementById('pp' +t).style.borderColor="orange";
                    document.getElementById('pp' +t).style.borderStyle="dotted";
                    this.changed_tiles++;
                    if (++placed >= count) {
                        return;
                    }
                }
            }
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

        // planet table readability
        var planets_can_build = tools.xpath('//*[@id="content-in"]/center/form[1]/table[1]/tbody/tr/td[5]'); // fifth column on sgwg.net
        if (planets_can_build.snapshotLength == 0) {
            planets_can_build = tools.xpath('//*[@id="content-in"]/center/form[1]/table[1]/tbody/tr/td[4]'); // fourth column on stargate-dm.cz
        }
        for (var p = 0; p < planets_can_build.snapshotLength; ++p) {
            var item = planets_can_build.snapshotItem(p);
            var can_build = parseInt(item.innerHTML);
            var free_slots = parseInt(item.previousElementSibling.innerHTML);
            var parent = item.parentElement;
            item.previousElementSibling.innerHTML = free_slots; // remove the useless (64)
            if (free_slots == 0) {
                if ( can_build > 0 ) {
                    parent.setAttribute('style','color: #f82');
                } else {
                    parent.setAttribute('style','color: #f55');
                }
            } else if (can_build > 0) {
                parent.setAttribute('style','color: #7f7');
            } else {
                parent.setAttribute('style','color: #ff7');
            }
        }

        // h1 heading removal
        var h1 = tools.xpath('//*[@id="content-in"]/h1',null,true);
        if ( h1 != null) {
            h1.parentElement.removeChild(h1);
        }

        // mass-build form removal
        var mass_build = tools.xpath('//*[@id="content-in"]/center/form[1]/table[2]',null,true);
        if ( mass_build != null) {
            mass_build.parentElement.removeChild(mass_build);
        }


        // build tollbox only in case a planet layout (form) is displayed
        var build_form = tools.xpath('//*[@id="content-in"]/form/input[1]',null,true);
        if (build_form == null) {
            return;
        }

        var submit_button = tools.xpath('//*[@id="content-in"]/form/input[1]', null, true);
        var this_planet_name = tools.xpath('//*[@id="content-in"]/table/tbody/tr[2]/td[1]', null, true).innerHTML;
        var next_planet = '#';
        var previous_planet = '#';
        var this_planet = '#';
        var planets = tools.xpath('//*[@id="content-in"]/center/form[1]/table/tbody/tr/td[1]/a[1]');
        var pr = 0;
        for (pr = 0; pr < planets.snapshotLength && planets.snapshotItem(pr).innerHTML != this_planet_name; ++pr) {
        }
        if (pr > 0) {
            previous_planet = planets.snapshotItem(pr-1).getAttribute("href");
        }
        if (pr < planets.snapshotLength) {
            this_planet = planets.snapshotItem(pr).getAttribute("href");
        }
        if (pr + 1 < planets.snapshotLength) {
            next_planet = planets.snapshotItem(pr+1).getAttribute("href");
        }
        var prev_next = document.createElement("div");
        prev_next.innerHTML = '<div style="float: right; font-size: 185%;"><a href="' +previous_planet+ '">&lt;&lt;</a>&nbsp;<a href="' +this_planet+ '">' +this_planet_name+ '</a>&nbsp;<a href="' +next_planet+ '">&gt;&gt;</a></div>';
        submit_button.parentNode.insertBefore(prev_next, submit_button);


        var all = tools.xpath('//*[@id="all"]',null,true);
        var rect = submit_button.getBoundingClientRect();
        var toolbox = document.createElement("div");
        toolbox.setAttribute("id", "toolbox");
        toolbox.setAttribute("style","position: absolute; width: 450px; top: " +(rect.top+4)+ "px; left: " +(rect.left+710)+ "px; z-index: 99");

        var buildings = tools.xpath('//*[@id="seznam_budov"]/table/tbody/tr/td[1]/img');
        for(var i = 0; i < buildings.snapshotLength; ++i) {
            var src = buildings.snapshotItem(i).getAttribute('src');

            var dot_pos = src.lastIndexOf('.JPG');
            var underscore_pos = src.lastIndexOf('_');
            var building_id = src.slice(underscore_pos+1,dot_pos);
            var building_code = tools.picture_to_building_id[building_id];

            var div = document.createElement("div");

            var div_fitting = document.createElement("div");
            var div_innerHTML = '<div style="width: 75px; height: 75px; float: left; background-image: url(\'' +src+ '\');">';
            for (var d=0;d<tools.batch_sizes.length;d++) {
                div_innerHTML += '<div style="width: 50%; height: 50%; float: left; color: black; line-height: 37px; text-align: center; vertical-align: middle;" onclick="tools.my_build(\'' +building_code+ '\',true,\'' +src+ '\',' +tools.batch_sizes[d]+ ');">' +tools.batch_sizes[d]+ '</div>';
            }
            div_innerHTML += '</div>';
            div_fitting.innerHTML = div_innerHTML;

            var div_any = document.createElement("div");
            var div_any_innerHTML = '<div style="width: 75px; height: 75px; float: left; background-image: url(\'' +src+ '\');">';
            for (d=0;d<tools.batch_sizes.length;d++) {
                div_any_innerHTML += '<div style="width: 50%; height: 50%; float: left; color: black; line-height: 37px; text-align: center; vertical-align: middle;" onclick="tools.my_build(\'' +building_code+ '\',false,\'' +src+ '\',' +tools.batch_sizes[d]+ ');">' +tools.batch_sizes[d]+ '</div>';
            }
            div_any_innerHTML += '</div>';
            div_any.innerHTML = div_any_innerHTML;

            var div_change = [ ];
            var change_from_building_code = tools.change_from[building_code];
            if (change_from_building_code != undefined) {
                for (var c=0; c<change_from_building_code.length; c++) {
                    var next_div_change = document.createElement("div");
                    var div_change_innerHTML = '<div style="width: 75px; height: 75px; float: left; background-image: url(\'' +src+ '\');">';
                    for (var d=0;d<tools.batch_sizes.length;d++) {
                        div_change_innerHTML += '<div style="width: 50%; height: 50%; float: left; color: black; line-height: 37px; text-align: center; vertical-align: middle;" onclick="tools.my_change(\'' +building_code+ '\',\'' +change_from_building_code[c]+ '\',\'' +src+ '\',' +tools.batch_sizes[d]+ ');">' +tools.batch_sizes[d]+ '</div>';
                    }
                    div_change_innerHTML += '</div>';
                    next_div_change.innerHTML = div_change_innerHTML;
                    div_change.push(next_div_change);
                }
            }
            div.appendChild(div_fitting);
            div.appendChild(div_any);
            for (var dc = 0; dc<div_change.length; dc++) {
                div.appendChild(div_change[dc]);
            }
            var cleaner = document.createElement("hr");
            cleaner.setAttribute("style","clear: both; display: block; visibility: hidden;");
            div.appendChild(cleaner);
            toolbox.appendChild(div);
        }
        all.parentNode.insertBefore(toolbox, all);
    }, false);
})();
