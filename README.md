# waitFor -- wait for needed ajax response

`waitFor` is a Vanilla js script that waits for a specific response from the remote server (forever or with a max
timeout).

```js
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

## Timeout sequence

`1... 2... 4... 1` and so on.

Timeouts and steps are configurable.

## Options

### Checks

- `path`: check this path
- `url`: check this url
- `check`: check string, regex or function

### Timeouts

- `initialTimeout`: initial timeout before running the first check (default is `1000`)
- `finishTimeout`: reset to `initialTimeout` after this timeout is reached (default is `4000`)
- `maxTimeout`: give up after this timeout is reached (default is `0`, so it will check forever)
- `timeoutStep`: increase timeout by this step (default multiplier is `2`)

### Callbacks

- `onfinish`: run this function on successful check
- `ongiveup`: run this function on give up (when `maxTimeout` is set, otherwise is never called)
