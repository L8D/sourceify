sourceify
=========

Browserify transform for inlining source maps. Sourceify will read comments
like `// sourceMappingURL=...` that refer to external files, and will attempt
to read and inline those so that browserify can include those source maps when
producing bundle-wide source maps. It also tries to handle source roots, by
treating the source root as relative to the package root. See how source maps
are generated in my other libraries
([`yokohama`](https://github.com/goodybag/yokohama),
[`hiroshima`](https://github.com/goodybag/hiroshima),
[`tokyo`](https://github.com/goodybag/tokyo)) for an example of how to compute
source roots.

Usage
-----

```js
var browserify = require('browserify');
var sourceify = require('sourceify');

var bundler = browserify({
    debug: true,
    // options
    transform: [sourceify]
});

bundler.bundle();
// ...
```

License
-------

Copyright &copy; 2016 Tenor Biel

Released under the MIT license.
