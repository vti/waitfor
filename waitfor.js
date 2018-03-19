(function (module) {
    if (typeof define === "function" && define.amd) {
        define(function () { return module.waitFor(); });
    } else {
        window.WaitFor = module.waitFor;
    }
}({
    waitFor: function () {
        var debug = false;

        function debugLog(msg) {
            debug && window.console && console.log(msg);
        }

        function ajax(url, callback, data) {
            var x;
            try {
                x = new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
                x.open(data ? 'POST' : 'GET', url, 1);
                x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                x.onreadystatechange = function () {
                    x.readyState > 3 && callback && callback(x.responseText, x);
                };
                x.send(data);
            } catch (e) {
                debugLog(e);

                if (callback) {
                    callback(null, x);
                }
            }
        }

        function checkType(check) {
            var fake = {};
            if (fake.toString.call(check) === '[object Function]') {
                return 'function';
            }
            else if (check instanceof RegExp) {
                return 'regexp';
            }
            else {
                return 'string';
            }
        }

        function check(options) {
            ajax(options.url, function(responseText, xhr) {
                if (responseText && options.check) {
                    var ok = false;

                    if (options.checkType === 'function') {
                        ok = options.check(responseText);
                    }
                    else if (options.checkType === 'regexp') {
                        ok = options.check.test(responseText);
                    }
                    else {
                        ok = options.check === responseText;
                    }

                    if (ok) {
                        debugLog('onfinish with ' + responseText);
                        if (options.onfinish) {
                            options.onfinish(options, responseText);
                        }
                        return;
                    }
                    else {
                        debugLog('check failed');
                    }
                }

                setTimeout(function() { timeoutHandler(options) }, options.timeout);
            });
        }

        function timeoutHandler(options) {
            debugLog('handling timeout...' + options.timeout);

            if (options.timeout < options.finalTimeout) {
                options.timeout = options.timeout * options.timeoutStep;
            }
            else {
                options.timeout = options.initialTimeout;
            }

            options.timeElapsed += options.timeout;

            if (options.maxTimeout && options.timeElapsed >= options.maxTimeout) {
                debugLog('max timeout reached, giving up');

                if (options.ongiveup) {
                    options.ongiveup();
                }
            }
            else {
                check(options);
            }
        }

        return {
            poll: function(options) {
                options = options || {};

                var defaultOptions = {
                    initialTimeout: 1000,
                    finalTimeout: 4000,
                    maxTimeout: 0,
                    timeoutStep: 2,
                    timeElapsed: 0
                };

                for (var opt in defaultOptions) {
                    if (!options.hasOwnProperty(opt))
                        options[opt] = defaultOptions[opt];
                }

                if (!options.url) {
                    if (options.path) {
                        options.url = window.location.protocol + '//' + window.location.hostname;
                        if (window.location.port) {
                            options.url += ':' + window.location.port;
                        }
                        options.url += options.path;
                    }
                    else {
                        options.url = window.location.href;
                    }
                }

                options.timeout = options.initialTimeout;
                options.checkType = checkType(options.check);

                debugLog('registering ' + options.url);

                setTimeout(function() { timeoutHandler(options) }, options.timeout);
            }
        };
    }
}));
