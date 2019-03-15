// ==UserScript==
// @name         stavby.php
// @namespace    http://stargate-dm.cz/
// @version      0.23
// @description  Utils for stavby.php
// @author       on/off
// @match        http://stargate-dm.cz/stavby.php*
// @match        http://sgwg.net/stavby.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @license      AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl-3.0.txt
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    function my_tools() {
        this.tile_name = { };
        this.tile_name['t1'] = "Průmyslová";
        this.tile_name['t2'] = "Vojenská";
        this.tile_name['t3'] = "Civilní";

        this.building_name = { };
        this.building_name['1'] = "Město";
        this.building_name['2'] = "Naquadahový důl";
        this.building_name['3'] = "Triniový důl";
        this.building_name['5'] = "Kasárna";
        this.building_name['6'] = "Laboratoř";
        this.building_name['7'] = "Loděnice";
        this.building_name['a'] = "Park";
        this.building_name['b'] = "Hvězdná brána";
        this.building_name['c'] = "Mincovna";

        this.building_image = { }; // populated on the fly from stavby.php as the image URLs are different for each race

        this.building_tile = { };
        this.building_tile['1'] = "t3";
        this.building_tile['2'] = "t1";
        this.building_tile['3'] = "t1";
        this.building_tile['5'] = "t2";
        this.building_tile['6'] = "t1";
        this.building_tile['7'] = "t2";
        this.building_tile['a'] = "t3";
        this.building_tile['b'] = "t3";
        this.building_tile['c'] = "t1";

        this.picture_to_building_id = { };
        this.picture_to_building_id['1'] = "1";
        this.picture_to_building_id['2'] = "2";
        this.picture_to_building_id['3'] = "3";
        this.picture_to_building_id['5'] = "5";
        this.picture_to_building_id['6'] = "6";
        this.picture_to_building_id['7'] = "7";
        this.picture_to_building_id['10'] = "a";
        this.picture_to_building_id['11'] = "c"; // this id is swapped with next line on the server, hence the need for this table
        this.picture_to_building_id['12'] = "b";
        this.picture_to_building_id['obr/budovy/brana'] = "b";   // hack for sgwg.net Kryona
        this.picture_to_building_id['obr/budovy/razirna'] = "c"; // hack for sgwg.net Kryona

        this.change_from = { };
        this.change_from['2'] = [ '3', 'c' ]; // TRI/min -> NAQ
        this.change_from['3'] = [ '2', 'c' ]; // NAQ/min -> TRI
        this.change_from['5'] = [ '2', '3', '6', '7' ]; // NAQ/TRI/min/lod -> kas
        this.change_from['6'] = [ '2', '3', '5', '7', 'c' ]; // NAQ/TRI/lod/kas/min -> LAB
        this.change_from['7'] = [ '2', '3', '5', '6' ]; // NAQ/TRI/kas/min -> lod

        this.batch_sizes = [1,2,5,10];

        this.toolbox_icon_size = '53px';

        this.xpath = function(query, object, qt) {
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

        this.can_build_today = function() {
            var can_build_today_elem = this.xpath('//*[@id="content-in"]/table/tbody/tr[2]/td[4]',null,true);
            return parseInt(can_build_today_elem.innerHTML);
        };

        this.update_built_number = function() {
            var can_build_today_elem = this.xpath('//*[@id="content-in"]/table/tbody/tr[2]/td[4]',null,true);
            var can_build_today = parseInt(can_build_today_elem.innerHTML);
            can_build_today_elem.innerHTML = can_build_today+ ' budov / postaveno ' +this.changed_tiles;
        };

        this.change_building = function(tile, what, img_src, is_change) {
            var color = "yellow";
            if (is_change) {
                color = "orange";
            }
            document.getElementById('hh' +tile).value=what;
            document.getElementById('pp' +tile).src=img_src;
            document.getElementById('pp' +tile).style.borderWidth="2px";
            document.getElementById('pp' +tile).style.borderColor=color;
            document.getElementById('pp' +tile).style.borderStyle="dotted";
            this.changed_tiles++;
            this.update_built_number();
            console.log('Changed tiles: ' + this.changed_tiles);
        };

        this.my_build = function(what,tile,count) {
            var can_build_today = this.can_build_today();
            var placed = 0;
            for (var t=64;t>=1 && can_build_today > this.changed_tiles;t--) {
                var type = this.tile_type(t);
                if ((document.getElementById('hh' +t).value == 0) && (type == tile)) {
                    this.change_building(t, what, this.building_image[what], false);
                    if (++placed >= count) {
                        return;
                    }
                }
            }
        };

        this.my_change = function(what,orig,count) {
            var can_build_today = this.can_build_today();
            var needed_tile = this.building_tile[what];
            var placed = 0;
            // first try to place on suitable tiles replacing buildings on their non-suitable tiles
            for (var t=1;t<=64 && can_build_today > this.changed_tiles;t++) {
                var type = this.tile_type(t);
                var current_building = document.getElementById('hh' +t).value;
                var ideal_tile_for_current_building = this.building_tile[current_building];
                if (current_building == orig && (type == needed_tile) && (type != ideal_tile_for_current_building)) {
                    this.change_building(t, what, this.building_image[what], true);
                    if (++placed >= count) {
                        return;
                    }
                }
            }
            // ... then try to place on suitable tiles replacing buildings on their suitable tiles
            for (var t=1;t<=64 && can_build_today > this.changed_tiles;t++) {
                var type = this.tile_type(t);
                var current_building = document.getElementById('hh' +t).value;
                var ideal_tile_for_current_building = this.building_tile[current_building];
                if (current_building == orig && (type == needed_tile) && (type == ideal_tile_for_current_building)) {
                    this.change_building(t, what, this.building_image[what], true);
                    if (++placed >= count) {
                        return;
                    }
                }
            }
            // ... then continue with not suitable tiles only replacing buildings on not stuitable (for them) tiles ...
            for (var t=1;t<=64 && can_build_today > this.changed_tiles;t++) {
                var type = this.tile_type(t);
                var current_building = document.getElementById('hh' +t).value;
                var ideal_tile_for_current_building = this.building_tile[current_building];
                if (current_building == orig && (type != needed_tile) && (type != ideal_tile_for_current_building)) {
                    this.change_building(t, what, this.building_image[what], true);
                    if (++placed >= count) {
                        return;
                    }
                }
            }
            // ... and lastly replace buildings on suitable tiles with the desired building
            for (var t=1;t<=64 && can_build_today > this.changed_tiles;t++) {
                var type = this.tile_type(t);
                var current_building = document.getElementById('hh' +t).value;
                var ideal_tile_for_current_building = this.building_tile[current_building];
                if (current_building == orig && (type != needed_tile) && (type == ideal_tile_for_current_building)) {
                    this.change_building(t, what, this.building_image[what], true);
                    if (++placed >= count) {
                        return;
                    }
                }
            }
        };

        // hijack of the default build function 'bud(adresa,budova)' - wrap it and count the changed tiles
        this.my_build_hijack = function(orig_func, event) {
            orig_func.call(event);
            this.changed_tiles++;
            this.update_built_number();
            console.log('Changed tiles: ' + this.changed_tiles);
        };

        // hijack of the default build menu function 'objev(puda,id)' - wrap it and do call only if we are still below the limit of number of buildings we can build
        this.my_build_menu = function(orig_func, event) {
            var can_build_today = this.can_build_today();
            console.log('Changed tiles: ' + this.changed_tiles + ' out of ' + can_build_today);
            if (this.changed_tiles < can_build_today) {
                orig_func.call(event);
            } else {
            console.log('Not showing the build menu');
            }
        };
    }

    var scriptNode          = document.createElement ('script');
    scriptNode.type         = "text/javascript";
    scriptNode.textContent  = my_tools.toString() + 'let tools = new my_tools();';

    addEventListener ("load", function() {

        var targ = document.getElementsByTagName ('head')[0] || document.body || document.documentElement;
        targ.appendChild (scriptNode);

        // Logo of our race
        var my_race_url = tools.xpath('//*[@id="info"]/ul[1]/li[2]/span/a', null, true).href;
        var my_race = my_race_url.slice(my_race_url.lastIndexOf('=')+1);
        var my_race_logo = '/obr/logaras/' +my_race+ '.jpg';

        // planet table readability
        var planets_can_build = tools.xpath('//*[@id="content-in"]/center/form[1]/table[1]/tbody/tr/td[5]'); // fifth column on sgwg.net
        if (planets_can_build.snapshotLength == 0) {
            planets_can_build = tools.xpath('//*[@id="content-in"]/center/form[1]/table[1]/tbody/tr/td[4]'); // fourth column on stargate-dm.cz
        }
        for (var p = 0; p < planets_can_build.snapshotLength; ++p) {
            var item = planets_can_build.snapshotItem(p);
            var can_build = parseInt(item.innerHTML);
            var free_slots = parseInt(item.previousElementSibling.innerHTML);
            if (isNaN(free_slots)) {
                break;
            }
            var parent = item.parentElement;
            item.previousElementSibling.innerHTML = free_slots; // remove the useless (64)
            if (free_slots == 0) {
                if ( can_build > 0 ) {
                    parent.setAttribute('style','color: #f82');
                } else {
                    parent.setAttribute('style','color: #f55');
                }
            } else if (can_build > 0) {
                if (free_slots > can_build) {
                    parent.setAttribute('style','color: #7f7');
                    item.previousElementSibling.setAttribute('style', 'border: 1px solid #7f7;');
                } else {
                    parent.setAttribute('style','color: #7f7');
                }
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

        // the other parts only in case a planet layout (form) is displayed...
        var build_form = tools.xpath('//*[@id="content-in"]/form/input[1]',null,true);
        if (build_form == null) {
            return;
        }

        var all = tools.xpath('//*[@id="all"]',null,true);
        var submit_button = tools.xpath('//*[@id="content-in"]/form/input[1]', null, true);
        var rect = submit_button.getBoundingClientRect();

        // building stats
        var stats = document.createElement("div");
        stats.setAttribute("id", "stats");
        stats.setAttribute("style","position: absolute; top: 0px; left: " +(rect.left+715)+ "px; z-index: 99; font-size: 75%; text-align: left; padding: 1em 0 1em;");
        var stats_array = { };
        var tile_stats_array = { };
        tile_stats_array["t1"] = 0;
        tile_stats_array["t2"] = 0;
        tile_stats_array["t3"] = 0;
        for (var tile = 1; tile <=64; ++tile) {
            var building = document.getElementById('hh' +tile).value;
            if (stats_array[building] == undefined) {
                stats_array[building] = { all: 0, fitting: 0, other: 0 };
            }
            var tile_type = tools.tile_type(tile);
            tile_stats_array[tile_type]++;
            stats_array[building].all++;
            if (tile_type == tools.building_tile[building] ) {
                stats_array[building].fitting++;
            } else {
                stats_array[building].other++;
            }
        }
        var stats_table = '<table class="data2">';
        $.each(tile_stats_array, function(k,v) {
            stats_table +=
                '<tr>' +
                '<td style="text-align: left; padding: 0 1em 0;">' +tools.tile_name[k]+ '</td>' +
                '<td style="text-align: left; padding: 0 1em 0;">' +v+ '</td>' +
                '</tr>';
        });
        stats_table += '</table>';
        stats_table += '<table class="data2">';
        $.each(stats_array, function(k,v) {
            var building = tools.building_name[k.toString()];
            if (building == undefined) {
                building = 'Volné';
            }
            stats_table +=
                '<tr>' +
                '<td style="text-align: left; padding: 0 1em 0;">' +building+ '</td>' +
                '<td style="text-align: left; padding: 0 1em 0;">' +v.all+ '</td>' +
                '<td style="text-align: left; padding: 0 1em 0;">' +v.fitting+ '</td>' +
                '<td style="text-align: left; padding: 0 1em 0;">' +v.other+ '</td>' +
                '</tr>';
        });
        stats_table += '</table>';
        stats.innerHTML = stats_table;
        all.parentNode.insertBefore(stats, all);

        // planet iterator (<< planet_name >>)
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


        // build tollbox
        this.toolbox = document.createElement("div");
        toolbox.setAttribute("id", "toolbox");
        toolbox.setAttribute("style","position: absolute; width: " +(parseInt(tools.toolbox_icon_size)*12+1)+ "px; top: " +(rect.top+32)+ "px; left: " +(rect.left+670)+ "px; z-index: 99");

        // populate the tools.building_image array
        var buildings = tools.xpath('//*[@id="seznam_budov"]/table/tbody/tr/td[1]/img');
        for(var i = 0; i < buildings.snapshotLength; ++i) {
            var src = buildings.snapshotItem(i).getAttribute('src');

            var dot_pos = src.lastIndexOf('.JPG');
            var underscore_pos = src.lastIndexOf('_');
            var building_id = src.slice(underscore_pos+1,dot_pos);
            var building_code = tools.picture_to_building_id[building_id];

            tools.building_image[building_code] = src;
        }

        this.toolbox_heading = document.createElement("div");
        $.each(tools.tile_name, function(tile,name) {
            this.toolbox_heading.innerHTML += '<div style="width: ' +tools.toolbox_icon_size+ '; height: ' +tools.toolbox_icon_size+ '; float: left; background-color: rgba(0,0,0,0.5); line-height: ' +tools.toolbox_icon_size+ '; text-align: center; vertical-align: middle; overflow: hidden; text-overflow: ellipsis;">' +name+ '</div>';
        }.bind(this));
        this.toolbox_heading.innerHTML += '<div style="width: 1px; height: ' +tools.toolbox_icon_size+ '; float: left; background-color: #fff;"></div>'; // separator
        $.each(tools.building_image,  function(building_code,img) {
            this.toolbox_heading.innerHTML += '<div style="width: ' +tools.toolbox_icon_size+ '; height: ' +tools.toolbox_icon_size+ '; float: left; background-image: url(\'' +img+ '\'); background-position: center;"></div>';
        }.bind(this));
        var cleaner = document.createElement("div");
        cleaner.setAttribute("style","clear: both; height: 1px; background-color: #fff;");
        this.toolbox_heading.appendChild(cleaner);
        this.toolbox.appendChild(this.toolbox_heading);

        $.each(tools.building_tile, function(building_code, preferred_tile) {
            var div = document.createElement("div");
            var inner_style = "width: 50%; height: 50%; float: left; color: black; line-height: " +Math.round(parseInt(tools.toolbox_icon_size)/2)+ "px; text-align: center; vertical-align: middle; font-weight: bolder; -webkit-text-stroke: 1.3px #bbb;";

            $.each(tools.tile_name, function(parent, building_code, preferred_tile, tile, name) {
                var src = tools.building_image[building_code];
                var div = document.createElement("div");
                div.style = 'width: ' +tools.toolbox_icon_size+ '; height: ' +tools.toolbox_icon_size+ '; float: left; background-image: url(\'' +src+ '\'); background-position: center;';
                var div_innerHTML = '';
                var style_fit = 'background-color: rgba(255,255,255,0.5);';
                if (preferred_tile != tile) {
                    style_fit = 'background-color: rgba(0,0,0,0.5);';
                }
                for (var d=0;d<tools.batch_sizes.length;d++) {
                    div_innerHTML += '<div style="' +inner_style + style_fit+ '" onclick="tools.my_build(\'' +building_code+ '\',\'' +tile+ '\',' +tools.batch_sizes[d]+ ');">' +tools.batch_sizes[d]+ '</div>';
                }
                div.innerHTML = div_innerHTML;
                parent.appendChild(div);
            }.bind(this, div, building_code, preferred_tile));

            var separator = document.createElement("div");
            separator.style = 'width: 1px; height: ' +tools.toolbox_icon_size+ '; float: left; background-color: #fff;';
            div.appendChild(separator);

            $.each(tools.building_image, function(parent, building_code, preferred_tile, building_from, orig_src) {
                var src = tools.building_image[building_code];
                var div = document.createElement("div");
                if (building_code != building_from) {
                    div.style = 'width: ' +tools.toolbox_icon_size+ '; height: ' +tools.toolbox_icon_size+ '; float: left; background-image: url(\'' +src+ '\'); background-position: center;';
                    var div_innerHTML = '';
                    for (var d=0;d<tools.batch_sizes.length;d++) {
                        div_innerHTML += '<div style="' +inner_style+ '" onclick="tools.my_change(\'' +building_code+ '\',\'' +building_from+ '\',' +tools.batch_sizes[d]+ ');">' +tools.batch_sizes[d]+ '</div>';
                    }
                    div.innerHTML = div_innerHTML;
                } else {
                    div.style = 'width: ' +tools.toolbox_icon_size+ '; height: ' +tools.toolbox_icon_size+ '; float: left; background-image: url(\'' +my_race_logo+ '\'); background-size: ' +tools.toolbox_icon_size+ ';';
                }
                parent.appendChild(div);
            }.bind(this, div, building_code, preferred_tile));

            var cleaner = document.createElement("hr");
            cleaner.setAttribute("style","clear: both; display: block; visibility: hidden; height: 0; border: none;");
            div.appendChild(cleaner);
            this.toolbox.appendChild(div);
        }.bind(this));

        // install our own function for building
        for (var t = 0; t < 4; ++t) {
            var build_spans = tools.xpath('//*[@id="t' +t+ '"]/span');
            for (var s = 0; s < build_spans.snapshotLength; ++s) {
                build_spans.snapshotItem(s).onclick = tools.my_build_hijack.bind(tools, build_spans.snapshotItem(s).onclick);
            }
        }
        // install our own function for build menu
        for (var t = 1; t <= 64; ++t) {
            var tile = tools.xpath('//*[@id="pp' +t+ '"]', null, true);
            tile.onclick = tools.my_build_menu.bind(tools, tile.onclick);
        }

        all.parentNode.insertBefore(toolbox, all);
    }, false);
})();
