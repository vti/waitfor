# waitFor -- wait for needed ajax response

`waitFor` is a Vanilla js script that waits for a specific response from the remote server (forever or with a max
timeout).

```
requirejs(['waitfor'], function(waitFor) {
    waitFor.poll({
        path: '/',
        check: function(response) {
            if (response === 'ok') {
                return true;
            }

            return false;
        },
        initialTimeout: 1000,
        finalTimeout: 4000,
        maxTimeout: 10000,
        timeoutStep: 2,
        onfinish: function() {
            console.log('done!');
        },
        ongiveup: function() {
            console.log('gave up!');
        }
    });
});
```
