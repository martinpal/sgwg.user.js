// ==UserScript==
// @name         Shortcuts
// @namespace    http://stargate-dm.cz/
// @version      0.8
// @description  Various shortcuts for the top of the page
// @author       on/off
// @match        http://stargate-dm.cz/*
// @match        http://sgwg.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    function my_shortcut_tools() {
        this.xpath = function(query, object, qt) {
            if( !object ) object = document;
            var type = qt ? XPathResult.FIRST_ORDERED_NODE_TYPE: XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;
            var ret = document.evaluate(query, object, null, type, null);
            return (qt ? ret.singleNodeValue : ret);
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

    addEventListener ("load", function() {
        var targ = document.getElementsByTagName ('head')[0] || document.body || document.documentElement;
        targ.appendChild (scriptNode);

        // do nothing if not logged in
        var user_img = shortcut_tools.xpath('//*[@id="info"]/img', null, true);
        if (user_img == null) {
            return;
        }

        var logo = shortcut_tools.xpath('//*[@id="logo"]/a/span', null, true);
        logo.parentNode.href = '/hlavni.php';

        // top shortcuts for forums and various stuff
        var head = shortcut_tools.xpath('//*[@id="head"]', null, true);
        var shortcuts = document.createElement('div');
        shortcuts.innerHTML =
            '<div style="float: right; padding: 5px; background-color: rgba(0,0,0,0.5);">' +
                '<a href="/forum.php?kde=1" ><span style="color:#0ff"     >NP</span></a>&nbsp;' +
                '<a href="/forum.php?kde=3" ><span style="color:orange"   >OP</span></a>&nbsp;' +
                '<a href="/forum.php?kde=2" ><span style="color:#a0aeff"  >DP</span></a>&nbsp;' +
                '<a href="/forum.php?kde=9" ><span style="color:#7ff"     >SF</span></a>&nbsp;' +
                '<a href="/forum.php?kde=11"><span style="color:#ff0"     >OV</span></a>&nbsp;' +
                '<a href="/forum.php?kde=18"><span style="color:#0e0"     >VF</span></a>&nbsp;' +
                '<a href="/forum.php?kde=16"><span style="color:red"      >AF</span></a>&nbsp;' +
                '<a href="/forum.php?kde=8" ><span style="color:#0ff"     >VIP</span></a>&nbsp;' +
                '<a href="/forum.php?kde=17" ><span style="color:#01baff" >DSA</span></a>' +
            '</div>' +
            '<hr style="clear: both; display: block; visibility: hidden; height: 0; border: none;" />';
        head.appendChild(shortcuts);

        // top overview of policies
        var policies = shortcut_tools.xpath('//*[@id="info"]/ul[2]', null, true);
        $.ajax({
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
                }
            }.bind(this, policies)
        });

        // top shortcuts for listings of races sorted by planets
        var races = document.createElement('div');
        races.style = "float: right;";
        head.appendChild(races);
        $.ajax({
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
                    span.innerHTML =  '<a href="/vesmir.php?jak=' +v.value+ '"><img src="/obr/logaras/' +v.value+ '.jpg" alt="' +v.innerHTML+ '" style="width: 56px; height: 56px;" /></a>';
                    parent.appendChild(span);
                }.bind(this, parent));
            }.bind(this, races)
        });

    }, false);
})();
