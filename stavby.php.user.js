// ==UserScript==
// @name         stavby.php
// @namespace    http://stargate-dm.cz/
// @version      0.2
// @description  Utils for stavby.php
// @author       on/off
// @match        http://stargate-dm.cz/stavby.php*
// @match        http://sgwg.net/stavby.php*
// @domains      stargate-dm.cz
// @grant        none
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

(function() {
    'use strict';

    // Pole
    //   t1: prumyslova
    //   t2: vojenska
    //   t3: civilni
    // Budovy
    //   0: nic
    //   1: mesto
    //   2: NAQ dul
    //   3: TRI dul
    //   4:
    //   5: kasarna
    //   6: laborator
    //   7: lodenice
    //   8:
    //   9:
    //   a: park
    //   b: mincovna
    //   c: Stargate
    function my_tools() {
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

        this.batch_sizes = [1,2,5,10];

        this.xpath = function(query, object, qt) { // Searches object (or document) for string/regex, returning a list of nodes that satisfy the string/regex
            if( !object ) object = document;
            var type = qt ? XPathResult.FIRST_ORDERED_NODE_TYPE: XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;
            var ret = document.evaluate(query, object, null, type, null);
            return (qt ? ret.singleNodeValue : ret);
        };

        this.changed_tiles = 0;
        this.my_build = function(what,fitting,src,count) {
            var can_build_today_elem = this.xpath('//*[@id="content-in"]/table/tbody/tr[2]/td[4]',null,true);
            var can_build_today = parseInt(can_build_today_elem.innerHTML);
            var needed_tile = this.building_tile[what];
            //alert("Build: " +what+ ", " +fitting+ ", " +needed_tile);
            var placed = 0;
            for (var t=1;t<=64 && can_build_today > this.changed_tiles;t++) {
                var tile = this.xpath('//*[@id="pp' +t+ '"]',null,true);
                var on_click = tile.getAttribute('onclick');
                var type = on_click.slice(7,9);
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
        var planets_can_build = tools.xpath('//*[@id="content-in"]/center/form[1]/table[1]/tbody/tr/td[4]');
        for (var p = 0; p < planets_can_build.snapshotLength; ++p) {
            var item = planets_can_build.snapshotItem(p);
            var can_build = parseInt(item.innerHTML);
            var free_slots = parseInt(item.previousElementSibling.innerHTML);
            var parent = item.parentElement;
            item.previousElementSibling.innerHTML = free_slots; // remove the useless (64)
            if (free_slots == 0) {
                parent.setAttribute('style','color: #f55');
            } else if (can_build > 0) {
                parent.setAttribute('style','color: #7f7');
            } else {
                parent.setAttribute('style','color: #ff7');
            }
        }

        // mass-build form removal
        var mass_build = tools.xpath('//*[@id="content-in"]/center/form[1]/table[2]',null,true);
        mass_build.parentElement.removeChild(mass_build);


        // build tollbox only in case a planet layout (form) is displayed
        var build_form = tools.xpath('//*[@id="content-in"]/form/input[1]',null,true);
        if (build_form == null) {
            return;
        }

        var all = tools.xpath('//*[@id="all-in"]',null,true);
        var toolbox = document.createElement("div");
        toolbox.setAttribute("id", "toolbox");
        toolbox.setAttribute("style","position: fixed; left: 1330px; top: 273px; width: 150px;");

        var buildings = tools.xpath('//*[@id="seznam_budov"]/table/tbody/tr/td[1]/img');
        for(var i = 0; i < buildings.snapshotLength; ++i) {
            var src = buildings.snapshotItem(i).getAttribute('src');

            var dot_pos = src.lastIndexOf('.JPG');
            var underscore_pos = src.lastIndexOf('_');
            var building_id = src.slice(underscore_pos+1,dot_pos);
            var building_code = parseInt(building_id).toString(16);

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

            div.appendChild(div_fitting);
            div.appendChild(div_any);
            toolbox.appendChild(div);
        }
        all.appendChild(toolbox);
    }, false);
})();
