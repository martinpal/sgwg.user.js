// ==UserScript==
// @name         Shortcuts
// @namespace    http://stargate-dm.cz/
// @version      0.22
// @description  Various shortcuts for the top of the page
// @author       on/off
// @match        http://stargate-dm.cz/*
// @match        http://sgwg.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';

    function my_shortcut_tools() {
        this.cache_validity = 300000; // milliseconds
        this.ori_logo =
            'data:image/png;base64,' +
            'iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAQAAAAHUWYVAAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAA' +
            'CxMAAAsTAQCanBgAAAAHdElNRQfiBR8TDCY3Gg9IAAAWMklEQVR42u2deXgV5dXAf+/cfclCSFiD' +
            'rEaQQqWAqKC4wafWre6firut9tPnq9XWr9o+rVu11rbWPvXDre4K/dylagVEEFdQRGSRxYAkZCfJ' +
            'zXpz753z/ZEguTMTklDKnQlz+IM8k7mTmfd3zznvOXPe84IrrrjiiiuuuOLK/hdBOv3c9Vndn+PK' +
            'PoDR8X+OnCvfFa2bs8+WCS6UfzsOKZTHpUpErhHvHs8+SNZIo6ySOUa9cmWf4ZCg3CltNfKWlIr8' +
            'VzdAZkrJ87JWRJf18h9O0hOv/VEoAL/MkoebhixjAT7GdP+xLLwreZuR6tyxRW/J4/xabXcGEM3u' +
            'LlxRiozib80LVg+5h3m04evJRwMohY9t3MeTVF4ui+RU8TtBT7x2xgGKNr/vdO75ZvRC3sNLCL1n' +
            'H/a0K5YHYRmbOb3oe6/4bpe5qrL9qi6QvRAFJHM8N7X95JPoP6ggsDdTMhR+ynmSrz2n3JYzUW5T' +
            'a2SXGXSB9NZ3yAD+HDvvDe29nhqq3ZLqbJ28JFjEDs49+6BR+i3qLTsj0WyMYxAvVF/whLaEtt7f' +
            'pm58TC/rmMvnk9RcfY5C2dabeG2Lo4DFVYfOZfvefWtSVo9axVPUDj/u97pP+5uyqZZ4bYojjw93' +
            'jv4j1XurwjqiLMxBEy+THDjrd9Kk5tsTiWY3GKCQLJbVjb6nCxwePNDajc1pIhWx/EUrr7M0n/vl' +
            'eGxpuGzoQ1JBXoiN/z21FjcnBJnKQPhKpfZ4kS+pOJVsiwFXtPAqnw7ir/IdXA3p3lg1atq9LSfO' +
            'pdISx2Au5pza0C/1VXvO9qpquWPylzcw2iKPpVHPS2weyx9kgP1CRc1eOCByeeqy+dpmixtLcQiX' +
            'M+1TLlN3eZr2bP9FaS/LhUNeuZ7DLZB4KeVF2TmbX4pyNWTPUCbx83ezVlj8po3JXMaI1/Q56jW6' +
            'cccKRNDWcGn4/os41gJJgPXqVVLXc6nd/IhmJ/1I5fLTjUWLaDMNdyuHcxH9n0ld5Vnfk7CuPdJQ' +
            'MW4N/fosZlog8fM+H8Dv9VH2QmIbIIqUps1quPgdqkw31cZELiR7nn6tt6rnuSiFoJq5L3TbD5hs' +
            'yoEpFH+nJl/NtZdrt5HJ0vpx5xo+M91SisHMIWcJV3gaBdWL4VOAauYPkbnnM8KERKOVJ2CGXGwn' +
            '167ZxWCJxqVVRYvRDQMuBJjDgGLOVi29/y4LoBq4vd/Cc8i2ePiv+DTE/0hAuUBM86vs1G/WsBGP' +
            'ST9OoaiNc5O1YjHYIJoEJSpZkiVh8Xf+zS4dEVSZ/HZs8TGma4PiJRjBda7JMst1say3CZpwjOdI' +
            'PDfrq31p2tER0QdlNKdzn7yeWJ5cyvPcLNOkoN17SJov0d7lkTPihRamqZZ3IpwneXYxWzbRVQlL' +
            'ydJ+jxE26ECEi5n8plymVXaeWbX/LIdxln5Z1bAaamjEQz/yyCfnLR5KLfQ2dZ4aC4oKNWBJ8cx7' +
            'LV5wDeWWBu+N6hF7jITXJgZrTrLfP036oTiUSTv5q1aJAUerJ3AlNxYXfc5attPSYZryKGLySROP' +
            'Cz2i363t2J08VAhK9FtHLpoWXGZ6s1LDiqwjZ6We9zS6Jmu3kl6/gTLDzQhRZqK9klyUXvqmiAcC' +
            'd/PAm0V/4zWKEUIECRKiiZU8xbxA5XXqURnaGaICtPd5+XRCJtPUwudwlDbFHkbLFj5En8KYRSZl' +
            '1RhNUQnzfPF041On+e9I3fBYYAFl+PF2GnYNHwk+5HHKTuZxiZimALfkcQxtJg0tpXgo0+xhv7XM' +
            'GyxQFzZ6N5jmQF6OgxVqoVGbcn7IdU94V5K0mDW1B3ybeYr6WdxvnG+prTx9LH6DJmhUsxGOliGu' +
            'ydplsE5e6TE723zG7WR+55mHADKVG/4RWrXH6hONr3iFxFXyA2Ws8707hykkDecn2EbLdIbawWjZ' +
            'wGTJZPJWWZiLo6GMF9Kdv0SZs7noA+LdXNPHO6yFRyW4G4lCYGPw/WkmIIodVOdyiCh1oAMRgBl6' +
            'pNgERGNakrdVKt3oMCFx9fvs6MFt+3mW1jxuM7h24bHBHGR45a5RSSVMJ3rAmywFMO2rsPH1n85I' +
            'om3y93RHKyEu2BL8okdzdY1q3oGr9X5pf0/n7azkOIOOKJqogGlEXB+CeBn5tdJNQL4HNdpHRreS' +
            'uGRdjwsffCwmEVU/NniGhtA/R5mu4GEHjRNdIABF5G41OdMUE+C99KEUxfT63NU9LplTxFjp40yD' +
            'lrWwcAD5hkmBopIWD8My/wYx80BGkF1pACLkUACL0+NzPJxXwTeWk92uHm45DJPpaccSfJbLIAMQ' +
            'jWpaYELmxyPzQAY1h9tMBmsEGnxg8DaexCkbe1ps3SE7iGVzbKfVVwBV2dsKTEBqaYUiFwgU1IXM' +
            'Lr0QUmqD4fCERGBTL5NvCTaFmLxb0xRAg29jnmlWlyQGow5wIAJQEAuYgQyEr02nH5VgWy8MVvuV' +
            'tsJASZtp0UhxjimnpVFHsvAAB6IA+jdgBtIftphOP6yB+l7mm3RKoR/D0w42Uxa1yCw3ohdwoDt1' +
            'CZBVZwIiZEOZ6dxDynupH6BTC1EGpg19gp1BU0ZL0YKed8ADIUKo2cJRh6HWBGRY7V6MV5LWMHmG' +
            'g41+C18URwIuEMuct+CDZtPh/Ma9GC+dZr8pJZLULK6Uwg6SeSDSBSWz2oTie3X5hBe/4c/p5mIi' +
            '1QFEDngg/yq7nnxGGRRSrKq7BIGM53udBCS1NwUACm+KhOXg7yvmfd+HdCF14b0YLw+hNpq61hjj' +
            'rRzoJitBwmdhz5OYV0Gr0ty9AhJupc7A358yuSjpcDQHuslqojlscRNxyDId/Lqg10AUWdBAhXF6' +
            'kLSIfcJoDQe8yVI6zRHTTSiaIN907up8fL0cMY3BUE9anxPRyGojaaohjqJVH+BABKAhbAGkHgpN' +
            '9vwjP4W9zPZ6GA7VqjztYJD8ZtNbeSELrbyXl++TTr0mmvSYgFRj0fJnhY/RvQzfFEUJ1hrQhhnW' +
            '0FHtmJ6u8ZQd4BqiACr7tXhMN1UGAyRkKK+u8394qKliZM/Sn4J6lhsOZjGyzjATFvyEYburIVCW' +
            '3WSuWdwOcJgBnqj5QxncizETJkFMFqZXdpHVOK7GpB85BGGLCwS+IZZvGB4P35CC6aYJwIJcJpij' +
            'vD3IzBRLtBaDTg5riFaZ6ojzCMI6FwhsJVZomv0nKIbjTW69KjR/okW5tLXoHEZuK48aSiWCzKil' +
            'wvDgOgWEYKtyI3VVR9VwizK5L+BIXUs/rmI8PoLxPXTswmnwmfrIsGY3zPHl1Bn+os4gQutpyXx+' +
            'yA6Vi5+PjJvrpFZDQJ1m6sG7Kue1aUR7oCMJZjAsyS9Nf29gw+EbTW9DfAzC+2nnFMuBGhgCfJLf' +
            'nG06voNyP+cY13ioSh6eFJvUbYIjyQDOgPlqWfrKKxRnx0wrGXXy6Q8fu0Da5T2ax1t0JFnmYXpq' +
            'kFFHkou9j5/MsD3qSIoIF9BvEzea8AdSV20x1T7qDKJAWKOSLhBA1bB+spj9wioSg7RL0gdU8LXq' +
            '9w1c+p/kdelJUgQ4k4kxrlEVBv2AWYnhy021j4pCclZS6i5H2DVMrx+SMrdSqueDEKek8tJbXwie' +
            'En48+qtrGWK5KCFJmPOY2apdG3vHnLuV27ay2eBBhBxGwXIpscMaKnss2HlOpaaYvvEplpOaqp1r' +
            'Ohu1ju8PX/dTTiBOshMunQTDuZ5jaj2XpeblGIZdIaepSW+YIVHAmDgfa602MN/2eGOoqlk60yIp' +
            'UsGyMOfqBynDqnNQWzg894kLuYOjCJIgSZIkY/ght3DwKnWSmu/V0w2QArh3E1+aZlheRpP1Gavs' +
            'sejTLj0XHxw8+xC+Nsx+WviISSfknsX9nfsjdnRnaOJyeWjYPVcejexUDfgYIF6dcu5lrkq2Nxbo' +
            'vFQU5EbGPGtR2ZXFFPhQbbTHok/bNPnQSz4Z+r8WzZJP4YwSzlafWHkfBUghJzGefsTZyntq+e7f' +
            'GMzVaJYvHvQ85szyeK7/hivUYnu0xLSFhggKddeEBwsx1iam+ICiwnG3yNWqyjhg7VqjSnjUdC3T' +
            '1dsC/LFi0GsW+uFjFqxUi+3y3bSHDwF4JlA22+TYPVTyBrVncJN4zI3GVA9UXlCsU76fxWc/S6vF' +
            'V+FgxtbymH0aNNmnPVOj57bvMMaUy/WzltdI/Jyb9qata7tWjTufnywIbrI0EOcIy9Ub9rHdNgGi' +
            '0IRX8j4/zlQEDV7e5zX4jfyi90gUILO5793+Sy0CyTizGdLCr9wGZtb5p0ru+i7ftVhFDot4Kcit' +
            '8rveIRFATuTpFUNfpdWkAymGcxI8oFbbqcmfjYD4hMWRp45jgEV/xBQLeSbCf8uzqYjq0Z5SHR21' +
            '5vD6pwOepsmydPQSglvkV7hNMLscwFoeGlt8VOfa6G+R6CznL4H4hdpymdr97gaCQpQ8qD+1PPiw' +
            'hXZAK2czHM7Rkm4TzD0EROoDHjitraiLQf6Cu9h8mLwvd8vg3RlCy10LPXIEa1uvnc9jlrOxJFM5' +
            'Bu/N6nO7dba2VWdnQZHwex+tnXM/ZZa3lsLPLGaQV+35Cy9SSa0xZZ5SWh6j+FH8ym08xzYLbQOd' +
            'oVzN0JflAq0NF0h3SFJDteeKj3mESssFbEKcocxkLPl65A2W8CXVxGikjQA5DGAcpzWdXK59yFLE' +
            '8go6/bmEQ1dwth13brNd73NBkZqoPbvhO09S0UXXhhRtDGYsoxlEHjlbfaVU0UyUoQ1F1VklbOQL' +
            'YvgsH04nmwuZvIFL1ApsuIOIDTeZERT6VPXMxqKn2d7lVmA6KTQKyCOXKFn4iVNPLZVUEcfbhXPU' +
            'iTKH723larUIW27oYksgoJCJzNs67nnZoIJ7OFfvmAL70EiRQKHtofd1ihyuYlwpl6h3sOmWR7bc' +
            'rKwDyWieqJrxd1Z2YXx6K20cxLUMKuVMtRLb7tNm093jOlLrA/hj60Wv8K6pAXnvJc4MLiK0ltlq' +
            'BzbeNs/Gm14KCj2kbuVnH/lfoPFfiKeFIGdxDNpzXKqSYuudPu18bx3fY/18dUds9DxtHc3sTTt+' +
            'H2M4l8IablEPg71x2BzIruFLHaTdwax1g9+mhBjS4/RCiiCDmc7MRrWEX6i1OECU/W+xw598n6uY' +
            'vqbgU9ZITPUESUrGqClM1XOW83T8yWDC/trhECDfIvFzCifx/cWFC6Sp2wX+KQ7Wr9AKlvCCvsDz' +
            'za6Zm6sh+xhKwuu9Zud9Dwe2dGu24lzJ0ZvlWK3UOTDAQZ0c2hPuviSrwzXBHr0PiUJpOw7lnO+d' +
            'k1prdAxqSzAW6JFGhWhvGOAcGA4D0iGN1Ad7BCQCNY57OgcCaaI+2qNysgjsdIHsFw3pCRAvPldD' +
            '9hOQuuxugQhhlAtkv7j2BHVRvN0WObhA9lM0AtRGe6AhERfIfpOd0dbugYTQXCD7KRapiza5PsRO' +
            'Uhdp7n6WFUa50979BYTmQA80BCEhLpD9AqQpu5sbFyKoGqelTRysITndDLUQQjnQYDkKyK6ad1VB' +
            'Y480pELp9qps74l4nYOjXSdkOjMoyusGiE4/PF4Zr9YqnPGm0GFAOt4ZHsdVHFE2ahtrumnR5CEO' +
            'E3lGNvFS83wlznlF5ZhXuHpYPcCpxQMXUkwLiW56Lwp5hClkChNr+Ui/xfO5U/TEIUUOepF6pa3o' +
            'ec9KEj0smhNAI8BQzmd4sfxIW+gWOewzHDKGheUj/kTXG7p0bZKEbC5gyjZ+oFa5Jmvf4AjwZvlx' +
            '99Bs0QjQR4QhDCSK0EAl22klYZhZpejPlRTN5xpV5zr1ffF9uUKf+qip8bFODoczMzWwlmbiJAEv' +
            'QbI25C5hLW2dzvZQwbsMPT/yJ/lYuUD+ZR3xcfzH0UqLOOMKDi3mHyxiPdtUHCTEcKaNPXXs8a/m' +
            'vU2iExI/qzmRUWfyWa96zLpALGUEhV9hXAqY4AQOrZbLtGWdtKmFDWzgSbn5mNs3+DendWuMUcXI' +
            'qcoBYbD9bzFKuMGiudko2KQtEyXmWH5hvx1Zpm0jY6QKcIHsA4nTZt7NzsMmGK8foWT3rjjfFsTN' +
            '3Dk8ZvI4QbRmJ+RR7A/kG8oPNq009LGQLdnqRbldH/7tGndEk1kyjzvfV9vSHkzIYjDaSpvsjOf4' +
            'wPCnqTt/GyoxHfdzGicmtQS1fE0DIQoZgqfK96q20qAKcWZyPuEj+NgNDPcFkBCv7zzhPov3sUKA' +
            '8YwmHz9J6ihnE1vRTObqIC6n8BFuVA2uhuybxMkw9WLr5Ee1jbSabjmFvistj0IzmCrwMZILGfKh' +
            'XKQVu6mTfYYklas9yKxV+UsoJ0ayw313nUhp/xelgCnMinve1G/ybHFGxtdJC3bO4xKmrh+wnlJ2' +
            '0khLF1Gewk+EbAZwCBOT2Sv4v+RDvmZ3wc6/A0mQ2cxgasuE6v71bGaBRS8TIZdjGUMOAzezgqWy' +
            'UPvaSa+oHFcFUEnBSIYxkBvKjrzVoheKzgiuYuBc3qKULarWWeunHPQKd5eTVlBMMciUyBFiufW3' +
            'H2+cl9XbnT7hIHFU1cmupWkCUJ7VxVAHCdbTsguG00yAE8uAOrbbU0QsciFCgHA9zU6syXIsEAAq' +
            'INsyORVA1dHs1MdyLpByayAeQlDvAsnEdIssCyBeoi6QjPiRSiTHEkgEXJOVEak3b3gveAm7GpKZ' +
            'iISSfl1pSL0SF8j+n/iW5FoA8RGGmHPV3skmyxKIl3Ar9c6reu8TQLItgj8fkSZiTg0LHQ7EY5r4' +
            'Cl4iTdS7JisjQBQ5hq0tFH5ocn1IZmS7hjESUURdIJnUkFxTQVy2CyRjU98GpeeYgGSB60MyFRqq' +
            '0lyDD2kHoppcIBkJDVWpWUOi4GAczvYhlkDCONlgOR5ItulxwgkXSOak1Es4TUc0Im3UuUAyJWVe' +
            'Q6yuiCRcIJmTHRpRg4YE21yTlVGTla4hAXBNVgal2qgh2RCn1gWSqdAw4WnpXHmi2oHUuEAyFRrq' +
            'Wnk0LVbPdYFkVHRPeVaahuRAXLmRul2AQDY0OPqJnA6E8lBaAX+OTqVz36f3CSC+TrG6IidFhXPf' +
            'p/cJIP605ElOkkrXZNlIQyIpF0gmJ76SDiQCLpAMS4Pv22U7Qi4kqXCBZFIS3li4c1joakimgfiq' +
            'XA2xFZBA9W4fkgsJFXeBZBQIVbtMlpALNc4OC50PpI2qEP5dUYhQ5uywsC9oSHWQANKuIcIOhz9P' +
            'XzBZQYIdQPpBmQsks6FhgqpgRwNAD2FxgWReagIEEIQccIFkVgSgOSAhaAfimqwMGyyAlkBdu4b0' +
            'czXEFtISrA3u0pA+AMTrfCC+2vZZVi60qqSrIRkHQl0Ird1k7XB6nN43gNRG8LUnTkqdHqf3ISB6' +
            'BxDXZGVamqkNu0BsNPVNURfGQxi/C8QmoWF9GB/ZKChxgdghNIyF2jzkAs7P9fYFHwINkcYODXFN' +
            'li2kPhrzkoOCcheILYAQ85ML9UoXF4gtgDRE6Y/a7vywsM9oSBZ5qO194Fn6BJAYDVnko0pcIPaY' +
            '+iaIFRDpE1FIHwAiABXDxQ+uybJNaFg6qMnnaoiNZIeK4wKxkXzBm/SJsLDPiAyVU8Uj7kDYxq27' +
            '4kJxxRVXXHHFFVdc2YP8P8QVGlpApTYAAAAAAElFTkSuQmCC';

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
                        if (v.value != 8) {
                            span.innerHTML =  '<a href="/vesmir.php?jak=' +v.value+ '"><img src="/obr/logaras/' +v.value+ '.jpg" alt="' +v.innerHTML+ '" style="width: 56px; height: 56px;" /></a>';
                        } else {
                            span.innerHTML =  '<a href="/vesmir.php?jak=' +v.value+ '"><img src="' +shortcut_tools.ori_logo+ '" alt="' +v.innerHTML+ '" style="width: 56px; height: 56px;" /></a>';
                        }
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
            '<div><span style="float: left; min-width: 35px;">Komu</span><input type="text" id="RCPT" name="RCPT" size="9" value="' +previous_send_values.RCPT+ '"></div>' +
            '<div><span style="float: left; min-width: 35px;">NT</span>  <input type="text" id="NT"   name="NT"   size="9" value="' +previous_send_values.NT+   '">&nbsp;<span id="actual_NT" >' +shortcut_tools.resource_actuals.NT+  '</span></div>' +
            '<div><span style="float: left; min-width: 35px;">NAQ</span> <input type="text" id="NAQ"  name="NAQ"  size="9" value="' +previous_send_values.NAQ+  '">&nbsp;<span id="actual_NAQ">' +shortcut_tools.resource_actuals.NAQ+ '</span></div>' +
            '<div><span style="float: left; min-width: 35px;">TRI</span> <input type="text" id="TRI"  name="TRI"  size="9" value="' +previous_send_values.TRI+  '">&nbsp;<span id="actual_TRI">' +shortcut_tools.resource_actuals.TRI+ '</span></div>';
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
