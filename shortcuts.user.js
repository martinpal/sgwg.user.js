// ==UserScript==
// @name         Shortcuts
// @namespace    http://stargate-dm.cz/
// @version      0.2
// @description  Various shortcuts for the top of the page
// @author       on/off
// @match        http://stargate-dm.cz/*
// @match        http://sgwg.net/*
// @grant        none
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

(function() {
    'use strict';

    function my_shortcut_tools() {
        this.xpath = function(query, object, qt) { // Searches object (or document) for string/regex, returning a list of nodes that satisfy the string/regex
            if( !object ) object = document;
            var type = qt ? XPathResult.FIRST_ORDERED_NODE_TYPE: XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;
            var ret = document.evaluate(query, object, null, type, null);
            return (qt ? ret.singleNodeValue : ret);
        };
    }
    let shortcut_tools = new my_shortcut_tools();

    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    scriptNode.type                         = "text/javascript";
    scriptNode.textContent  = my_shortcut_tools.toString() + 'let shortcut_tools = new my_shortcut_tools();';

    addEventListener ("load", function() {
        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (scriptNode);

        // top shortcuts for phorums and various stuff
        var head = shortcut_tools.xpath('//*[@id="head"]', null, true);
        var shortcuts = document.createElement('div');
        shortcuts.innerHTML = '<div style="float: right; padding: 5px; background-color: rgba(0,0,0,0.5);"><a href="/forum.php?kde=1" ><span style="color:#0ff"  >NP</span></a>&nbsp;<a href="/forum.php?kde=3" ><span style="color:orange">OP</span></a>&nbsp;<a href="/forum.php?kde=2" ><span style="color:red"   >DP</span></a>&nbsp;<a href="/forum.php?kde=9" ><span style="color:#7ff"  >SF</span></a>&nbsp;<a href="/forum.php?kde=11"><span style="color:gold"  >OV</span></a>&nbsp;<a href="/forum.php?kde=18"><span style="color:green" >VF</span></a>&nbsp;<a href="/forum.php?kde=16"><span style="color:red"   >AF</span></a>&nbsp;<a href="/forum.php?kde=8" ><span style="color:#0ff"  >VIP</span></a></div>';
        head.appendChild(shortcuts);
    }, false);
})();
