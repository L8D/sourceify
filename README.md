sourceify
=========

Browserify transform for inlining source maps. Sourceify will read comments
like `// sourceMappingURL=...` that refer to external files, and will attempt
to read and inline those so that browserify can include those source maps when
producing bundle-wide source maps. It also tries to handle source roots, by
treating the source root as relative to the package root.

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

Copyright &copy; 2019 Tenor Biel

Released under the MIT license.
