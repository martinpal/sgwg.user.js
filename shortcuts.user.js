// ==UserScript==
// @name         Shortcuts
// @namespace    http://stargate-dm.cz/
// @version      0.23
// @description  Various shortcuts for the top of the page
// @author       on/off
// @match        http://stargate-dm.cz/*
// @match        http://sgwg.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    function my_shortcut_tools() {
        this.cache_validity = 300000; // milliseconds

        this.xpath = function(query, object, qt) {
            if( !object ) object = document;
            var type = qt ? XPathResult.FIRST_ORDERED_NODE_TYPE: XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;
            var ret = document.evaluate(query, object, null, type, null);
            return (qt ? ret.singleNodeValue : ret);
        };

        this.resource_actuals = undefined;
        this.get_resource_actuals = function() {
            if (shortcut_tools.resource_actuals == undefined) {
                $.ajax({
                    async: false,
                    type: 'GET',
                    url: '/vlada.php?s=2',
                    success: function(data, status) {
                        shortcut_tools.set_resource_actuals(data);
                    }
                });
            }
            return shortcut_tools.resource_actuals;
        };

        this.set_resource_actuals = function(data) {
            var jqr = $(jQuery.parseHTML(data));
            var antihack_input = jqr.find('#content-in > center > div > form > p > input[type="hidden"]');
            shortcut_tools.antihack = antihack_input[0].value;

            var res = jqr.find('#content-in > center > div > form:nth-child(1) > table > tbody > tr:nth-child(5) > td:nth-child(2)');
            var NT = res[0].innerHTML;
            var res = jqr.find('#content-in > center > div > form:nth-child(1) > table > tbody > tr:nth-child(6) > td:nth-child(2)');
            var NAQ = res[0].innerHTML;
            var res = jqr.find('#content-in > center > div > form:nth-child(1) > table > tbody > tr:nth-child(7) > td:nth-child(2)');
            var TRI = res[0].innerHTML;
            shortcut_tools.resource_actuals = { NT: NT, NAQ: NAQ, TRI: TRI };
            shortcut_tools.display_resource_actuals();
        };

        this.display_resource_actuals = function() {
            if (document.getElementById('actual_NT')) {
                document.getElementById('actual_NT' ).innerHTML = shortcut_tools.resource_actuals.NT;
                document.getElementById('actual_NAQ').innerHTML = shortcut_tools.resource_actuals.NAQ;
                document.getElementById('actual_TRI').innerHTML = shortcut_tools.resource_actuals.TRI;
            }
        };

        this.get_policy = function(doc, selector) {
            var policy = doc.find(selector);
            var return_value;
            $.each(policy, function(k, v) {
                if (v.checked) {
                    return_value = v.parentNode.nextElementSibling.innerHTML;
                }
            });
            return return_value;
        };

    }

    var scriptNode          = document.createElement ('script');
    scriptNode.type         = "text/javascript";
    scriptNode.textContent  = my_shortcut_tools.toString() + 'let shortcut_tools = new my_shortcut_tools();';

    var now = (new Date()).getTime();

    function get_cached_value(key) {
        if (GM_getValue(window.location.host+ '_' +key) != undefined) {
            console.log(key, GM_getValue(window.location.host+ '_' +key));
            var cache = GM_getValue(window.location.host+ '_' +key);
            try {
                cache = JSON.parse(cache);
            } catch(e) { }
            if (cache.millis + shortcut_tools.cache_validity > now) {
                return cache.HTML;
            }
        }
        return undefined;
    }

    function set_cached_value(key, value) {
        GM_setValue(window.location.host+ '_' +key, value);
    }

    function delete_cached_value(key, value) {
        GM_deleteValue(window.location.host+ '_' +key);
    }

    function get_resource_actuals() {
        if (shortcut_tools.resource_actuals == undefined) {
            var cached_value = get_cached_value('resource_actuals');
            if (cached_value == undefined) {
                $.ajax({
                    async: false,
                    type: 'GET',
                    url: '/vlada.php?s=2',
                    success: function(data, status) {
                        set_resource_actuals(data);
                    }
                });
            } else {
                console.log(cached_value);
                shortcut_tools.resource_actuals = cached_value;
                shortcut_tools.display_resource_actuals();
            }
        }
        return shortcut_tools.resource_actuals;
    }

    function set_resource_actuals (data) {
        var jqr = $(jQuery.parseHTML(data));
        var antihack_input = jqr.find('#content-in > center > div > form > p > input[type="hidden"]');
        shortcut_tools.antihack = antihack_input[0].value;

        var res = jqr.find('#content-in > center > div > form:nth-child(1) > table > tbody > tr:nth-child(5) > td:nth-child(2)');
        var NT = res[0].innerHTML;
        var res = jqr.find('#content-in > center > div > form:nth-child(1) > table > tbody > tr:nth-child(6) > td:nth-child(2)');
        var NAQ = res[0].innerHTML;
        var res = jqr.find('#content-in > center > div > form:nth-child(1) > table > tbody > tr:nth-child(7) > td:nth-child(2)');
        var TRI = res[0].innerHTML;
        shortcut_tools.resource_actuals = { NT: NT, NAQ: NAQ, TRI: TRI };
        shortcut_tools.display_resource_actuals();
        var resource_actuals_cache = { millis: now, HTML: shortcut_tools.resource_actuals };
        set_cached_value('resource_actuals', JSON.stringify(resource_actuals_cache));
    }

    addEventListener ("load", function() {
        var targ = document.getElementsByTagName ('head')[0] || document.body || document.documentElement;
        targ.appendChild (scriptNode);

        // do nothing if not logged in
        var user_img = shortcut_tools.xpath('//*[@id="info"]/img', null, true);
        if (user_img == null) {
            shortcut_tools.cache_validity = 1000*3600*24; // milliseconds; accept values from way longer than when logged in
            var info_div = document.createElement('ul');
            info_div.style = 'float: right; margin-top: 30px; margin-right: -320px; text-align: left; list-style-type: none; margin-left: 0; padding: 0;';
            $.each([
                'races',
                'resource_actuals',
                'policies',
                'flagships',
                'hero_missions',
                'flagship_missions',
            ], function (k,v) {
                var cached_value = get_cached_value(v);
                if (typeof cached_value == 'object') {
                    $.each(cached_value, function(k,v) {
                        if (v != undefined) {
                            info_div.innerHTML += '<li>' +k+ ': ' +v+ '</li>';
                        }
                    });
                } else {
                    if (cached_value != undefined) {
                        info_div.innerHTML += cached_value;
                    }
                }
            });
            var logo = shortcut_tools.xpath('//*[@id="logo_index"]', null, true);
            logo.parentNode.insertBefore(info_div, logo);
            return;
        }

        var user_name = shortcut_tools.xpath('//*[@id="info"]/ul[1]/li[1]/a', null, true).innerHTML;

        var requests = [ ];

        var logo = shortcut_tools.xpath('//*[@id="logo"]/a/span', null, true);
        logo.parentNode.href = '/hlavni.php';

        // top shortcuts for forums and various stuff
        var head = shortcut_tools.xpath('//*[@id="head"]', null, true);
        var shortcuts = document.createElement('div');
        shortcuts.innerHTML =
            '<div style="float: right; padding: 4px 12px; background-color: rgba(0,0,0,0.5);">' +
            '<a href="/forum.php?kde=1"  style="text-decoration: none;"><span style="color:#0ff"     >NP</span></a>&nbsp;' +
            '<a href="/forum.php?kde=3"  style="text-decoration: none;"><span style="color:orange"   >OP</span></a>&nbsp;' +
            '<a href="/forum.php?kde=2"  style="text-decoration: none;"><span style="color:#a0aeff"  >DP</span></a>&nbsp;' +
            '<a href="/forum.php?kde=9"  style="text-decoration: none;"><span style="color:#7ff"     >SF</span></a>&nbsp;' +
            '<a href="/forum.php?kde=11" style="text-decoration: none;"><span style="color:#ff0"     >OV</span></a>&nbsp;' +
            '<a href="/forum.php?kde=18" style="text-decoration: none;"><span style="color:#0e0"     >VF</span></a>&nbsp;' +
            '<a href="/forum.php?kde=16" style="text-decoration: none;"><span style="color:red"      >AF</span></a>&nbsp;' +
            '<a href="/forum.php?kde=8"  style="text-decoration: none;"><span style="color:#0ff"     >VIP</span></a>&nbsp;' +
            '<a href="/forum.php?kde=17" style="text-decoration: none;"><span style="color:#01baff"  >DSA</span></a>' +
            '</div>' +
            '<hr style="clear: both; display: block; visibility: hidden; height: 0; border: none;" />';
        head.appendChild(shortcuts);

        // drop cached policy values when submitting form for change of policies (pracovna.php and politika.php)
        if (window.location.pathname.indexOf('/pracovna.php') == 0) {
            $('#content-in > form').submit(function() {
                delete_cached_value('policies');
            });
            $('#content-in > form:nth-child(5)').submit(function() {
                delete_cached_value('policies');
            });
        }
        // top overview of policies
        var policies = shortcut_tools.xpath('//*[@id="info"]/ul[2]', null, true);
        var cached_value = get_cached_value('policies');
        if (cached_value != undefined) {
            console.log('Cached');
            policies.innerHTML += cached_value;
        } else {
            console.log('Reload');
            var policy_cache = { millis: now, HTML: '' };
            requests.push($.ajax({
                async: true,
                type: 'GET',
                url: '/politika.php',
                success: function(parent, data, status) {
                    var jqr = $(jQuery.parseHTML(data));
                    var selectors = [
                        '#content-in > form:nth-child(6)  > table > tbody > tr > td:nth-child(1) > input[type="radio"]',
                        '#content-in > form:nth-child(7)  > table > tbody > tr > td:nth-child(1) > input[type="radio"]',
                        '#content-in > form:nth-child(8)  > table > tbody > tr > td:nth-child(1) > input[type="radio"]',
                        '#content-in >                      table > tbody > tr > td:nth-child(1) > input[type="radio"]',
                        '#content-in > form:nth-child(11) > table > tbody > tr > td:nth-child(1) > input[type="radio"]'
                    ];
                    if(window.location.href.indexOf("http://stargate-dm.cz/") == 0) {
                        selectors = [
                            '#content-in > form:nth-child(5)  > table > tbody > tr > td:nth-child(1) > input[type="radio"]',
                            '#content-in > form:nth-child(6)  > table > tbody > tr > td:nth-child(1) > input[type="radio"]',
                            '#content-in > form:nth-child(7)  > table > tbody > tr > td:nth-child(1) > input[type="radio"]',
                            '#content-in > form:nth-child(8)  > table > tbody > tr > td:nth-child(1) > input[type="radio"]',
                            '#content-in > form:nth-child(9)  > table > tbody > tr > td:nth-child(1) > input[type="radio"]'
                        ];
                    }
                    var names = [
                        'Zaměření',
                        'Státní zřízení',
                        'Armáda',
                        'Soustava',
                        'Politika vůdce',
                    ];
                    for (var p = 0; p < selectors.length; ++p) {
                        var li = document.createElement('li');
                        li.innerHTML = '<strong>' +names[p]+ ':</strong> ' +shortcut_tools.get_policy(jqr, selectors[p]);
                        parent.appendChild(li);
                        policy_cache.HTML += li.outerHTML;
                    }
                    set_cached_value('policies', JSON.stringify(policy_cache));
                }.bind(this, policies)
            }));
        }

        // top shortcuts for listings of races sorted by planets
        var races = document.createElement('div');
        races.style = "float: right;";
        head.appendChild(races);
        cached_value = get_cached_value('races');
        if (cached_value != undefined) {
            console.log('Cached');
            races.innerHTML += cached_value;
        } else {
            console.log('Reload');
            var race_cache = { millis: now, HTML: '' };
            requests.push($.ajax({
                async: true,
                type: 'GET',
                url: '/vesmir.php?jak=rasy',
                success: function(parent, data, status) {
                    var jqr = $(jQuery.parseHTML(data));
                    var races = jqr.find('#content-in > center > form:nth-child(19) > select:nth-child(2) > option');
                    $.each(races, function(parent, k, v) {
                        if (isNaN(parseInt(v.value))) {
                            return;
                        }
                        var span = document.createElement('span');
                        var suffix = 'jpg';
                        if (v.value == 18 && window.location.href.indexOf("http://stargate-dm.cz/") != 0) {
                            suffix = 'png';
                        }
                        span.innerHTML =  '<a href="/vesmir.php?jak=' +v.value+ '"><img src="/obr/logaras/' +v.value+ '.' + suffix + '" alt="' +v.innerHTML+ '" style="width: 56px; height: 56px;" /></a>';
                        parent.appendChild(span);
                    }.bind(this, parent));
                    race_cache.HTML = parent.innerHTML;
                    set_cached_value('races', JSON.stringify(race_cache));
                }.bind(this, races)
            }));
        }

        get_resource_actuals();
        var events_box = shortcut_tools.xpath('//*[@id="sidebar_events"]', null, true).parentNode;
        var resource_sending_box = document.createElement('div');
        resource_sending_box.className = 'box';
        resource_sending_box.innerHTML = '<h2>Posílání</h2><div class="inbox" id="sidebar_resource_sending"></div>';
        events_box.parentNode.insertBefore(resource_sending_box, events_box.nextElementSibling);
        var previous_send_values = GM_getValue(window.location.host+ '_send');
        if (previous_send_values == undefined) {
            previous_send_values = { RCPT: user_name, NT: 100000, NAQ: 10000, TRI: 10000 };
        }
        var resource_sending = resource_sending_box.firstElementChild.nextElementSibling;
        resource_sending.innerHTML =
            '<div><span style="float: left; min-width: 50px;">Příjemce</span><input type="text" id="RCPT" name="RCPT" size="7" value="' +previous_send_values.RCPT+ '"></div>' +
            '<div><span style="float: left; min-width: 50px;">NT</span>      <input type="text" id="NT"   name="NT"   size="7" value="' +previous_send_values.NT+   '">&nbsp;<span id="actual_NT" >' +shortcut_tools.resource_actuals.NT+  '</span></div>' +
            '<div><span style="float: left; min-width: 50px;">NAQ</span>     <input type="text" id="NAQ"  name="NAQ"  size="7" value="' +previous_send_values.NAQ+  '">&nbsp;<span id="actual_NAQ">' +shortcut_tools.resource_actuals.NAQ+ '</span></div>' +
            '<div><span style="float: left; min-width: 50px;">TRI</span>     <input type="text" id="TRI"  name="TRI"  size="7" value="' +previous_send_values.TRI+  '">&nbsp;<span id="actual_TRI">' +shortcut_tools.resource_actuals.TRI+ '</span></div>';
        var send_button = document.createElement('input');
        send_button.setAttribute('type', 'submit');
        send_button.setAttribute('class', 'submit');
        send_button.setAttribute('value', 'Poslat');
        send_button.setAttribute('id', 'send_button');
        send_button.onclick = function(recipient, nt, naq, tri) {
            if (recipient == undefined) {
                recipient =  document.getElementById('RCPT').value;
            }
            if (nt == undefined) {
                nt =  document.getElementById('NT').value;
            }
            if (naq == undefined) {
                naq = document.getElementById('NAQ').value;
            }
            if (tri == undefined) {
                tri = document.getElementById('TRI').value;
            }
            var new_send_values = { RCPT: recipient, NT: nt, NAQ: naq, TRI: tri };
            GM_setValue(window.location.host+ '_send', new_send_values);
            console.log(recipient, nt, naq, tri);
            var ajax_request = undefined;
            if (this.antihack == undefined) {
                ajax_request = $.ajax({
                    async: true,
                    type: 'GET',
                    url: '/vlada.php?s=2',
                    success: function(data, status) {
                        var jqr = $(jQuery.parseHTML(data));
                        var antihack_input = jqr.find('#content-in > center > div > form > p > input[type="hidden"]');
                        this.antihack = antihack_input[0].value;
                    }
                });
            };
            $.when(ajax_request).then(function(data, textStatus, jqXHR) {
                var post_body = 'antihack=' +this.antihack+ '&sur_hraci=' +recipient+ '&fond_desc=&kolikp=' +nt+ '&kolikn=' +naq+ '&kolikt=' +tri;
                console.log(post_body);
                $.ajax({
                    type: 'POST',
                    url:  '/vlada.php?s=2',
                    data:  post_body,
                    success: function(data, status) {
                        set_resource_actuals(data);
                        alert('Posláno');
                    }
                });
            });
        }.bind(this, undefined, undefined, undefined, undefined);

        resource_sending.appendChild(send_button);


        // following is only for stargate-dm.cz
        if(window.location.href.indexOf("http://stargate-dm.cz/") != 0) {
            return;
        }

        var flagships =  shortcut_tools.xpath('//*[@id="info"]/ul[2]', null, true);
        cached_value = get_cached_value('flagships');
        if (cached_value != undefined) {
            console.log('Cached');
            flagships.innerHTML += cached_value;
        } else {
            console.log('Reload');
            var flagship_cache = { millis: now, HTML: '' };
            requests.push($.ajax({
                async: true,
                type: 'GET',
                url: '/vlajkova.php',
                success: function(parent, data, status) {
                    var jqr = $(jQuery.parseHTML(data));
                    var flagship_statuses = jqr.find('#content-in > table > tbody > tr > td:nth-child(2) > span:nth-child(14)');
                    $.each(flagship_statuses, function(parent, k, v) {
                        if (v.innerHTML == 'připravená') {
                            var flagship_class = v.parentNode.previousElementSibling.firstElementChild.nextSibling.nodeValue.slice(2);
                            var li = document.createElement('li');
                            li.innerHTML = '<strong>Na orbitě:</strong> ' +flagship_class;
                            parent.appendChild(li);
                            flagship_cache.HTML += li.outerHTML;
                        }
                    }.bind(this, parent));
                    set_cached_value('flagships', JSON.stringify(flagship_cache));
                }.bind(this, flagships)
            }));
        }

        var hero_missions =  shortcut_tools.xpath('//*[@id="info"]/ul[2]', null, true);
        cached_value = get_cached_value('hero_missions');
        if (cached_value != undefined) {
            console.log('Cached');
            hero_missions.innerHTML += cached_value;
        } else {
            console.log('Reload');
            var hero_missions_cache = { millis: now, HTML: '' };
            requests.push($.ajax({
                async: true,
                type: 'GET',
                url: '/heroes.php',
                success: function(parent, data, status) {
                    var jqr = $(jQuery.parseHTML(data));
                    var hero_mission_eta = jqr.find('#content-in > center > table > tbody > tr > td:nth-child(6)');
                    $.each(hero_mission_eta, function(parent, k, v) {
                        var hero_mission_type = v.parentNode.firstElementChild.innerHTML.trim();
                        var li = document.createElement('li');
                        li.innerHTML = '<strong>Hrdina na misi:</strong> ' +hero_mission_type+ ' do ' +v.innerHTML.trim();
                        parent.appendChild(li);
                        hero_missions_cache.HTML += li.outerHTML;
                    }.bind(this, parent));
                    set_cached_value('hero_missions', JSON.stringify(hero_missions_cache));
                }.bind(this, hero_missions)
            }));
        }

        var flagship_missions =  shortcut_tools.xpath('//*[@id="info"]/ul[2]', null, true);
        cached_value = get_cached_value('flagship_missions');
        if (cached_value != undefined) {
            console.log('Cached');
            flagship_missions.innerHTML += cached_value;
        } else {
            console.log('Reload');
            var flagship_missions_cache = { millis: now, HTML: '' };
            requests.push($.ajax({
                async: true,
                type: 'GET',
                url: '/vlajkova.php',
                success: function(parent, data, status) {
                    var jqr = $(jQuery.parseHTML(data));
                    var flagship_mission_eta = jqr.find('#content-in > center > table > tbody > tr > td:nth-child(5)');
                    $.each(flagship_mission_eta, function(parent, k, v) {
                        var flagship_mission_type = v.parentNode.firstElementChild.innerHTML.trim();
                        var li = document.createElement('li');
                        li.innerHTML = '<strong>Loď na misi:</strong> ' +flagship_mission_type+ ' do ' +v.innerHTML.trim();
                        parent.appendChild(li);
                        flagship_missions_cache.HTML += li.outerHTML;
                    }.bind(this, parent));
                    set_cached_value('flagship_missions', JSON.stringify(flagship_missions_cache));
                }.bind(this, flagship_missions)
            }));
        }

        $.when.apply($,requests).then(function(data, textStatus, jqXHR) {
            var recount = shortcut_tools.xpath('//*[@id="info"]/ul[2]/li[7]/a', null, true);
            if (recount != undefined) {
                recount = recount.parentNode;
                recount.parentNode.removeChild(recount);
                flagship_missions.appendChild(recount);
                var recount_span = recount.firstElementChild.nextElementSibling;
                recount_span.onclick = function () { if (window.confirm('Opravdu?')) { window.location = '/hlavni.php?prep=1'; } };
            }
        });
    }, false);
})();
