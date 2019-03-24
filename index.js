var convertSourceMap = require('convert-source-map');
var fs = require('fs');
var path = require('path');
var through = require('through2');

var cwd = process.cwd();

module.exports = function(filename, options) {
    if (!/\.js$/.test(filename) || !options._flags.debug) {
        return through();
    } else {
        return through.obj(transform);
    }

    function transform(data, enc, next) {
        var source = data.toString();
        var dir = path.dirname(filename);

        try {
            var smap = convertSourceMap.fromMapFileSource(source, dir);
        } catch (err) {
            if (!/while trying to read the map file/.test(err.message)) {
                throw err;
            }
        }

        this.push(getCode());
        next();

        function getCode() {
            if (smap) {
                smap.setProperty('sourceRoot', getRoot(cwd, filename, smap));

                var relativePath = path.relative(cwd, path.resolve(path.dirname(filename)))
                var sources = smap.getProperty('sources');
                if (sources && sources.length) {
                    smap.setProperty('sourcesContent', sources.map(source => {
                        var sourceFilename = path.resolve(relativePath, source);
                        return fs.readFileSync(sourceFilename, 'utf8');
                    }));
                }

                return convertSourceMap.removeMapFileComments(source) + smap.toComment();
            } else {
                return source;
            }
        }
    }
};

// This algorithm is for resolving the sourceRoot property so that it is
// relative to it's npm package folder instead of just '/source/'
function getRoot(cwd, filename, smap) {
    var relativePath = path.relative(cwd, filename);

    var segments = relativePath.split('node_modules');

    var sourceRoot = smap.getProperty('sourceRoot') || '/source/' + relativePath;

    if (segments.length <= 1) {
        return sourceRoot;
    } else {
        return sourceRoot
            .replace(/^\/source\//, '/source/' + pathToPackage());
    }

    // it works, somehow ¯\_(ツ)_/¯
    function pathToPackage() {
        var upToNodeModules = segments
            .slice(0, -1)
            .concat('/')
            .join('node_modules');

        var packageName = segments[segments.length - 1]
            .split('/', 2)[1]
            + '/';

        return upToNodeModules + packageName;
    }
}
