'use strict';

var _ = require('../');

var _fs = require('fs');

(0, _.main)(regeneratorRuntime.mark(function _callee() {
  var bundle;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          bundle = (0, _fs.createWriteStream)('bundle.js');
          _context.next = 3;
          return _.pipe.append((0, _fs.createReadStream)('.babelrc'), bundle);

        case 3:
          _context.next = 5;
          return _.pipe.append((0, _fs.createReadStream)('.babelrc'), bundle);

        case 5:
          _context.next = 7;
          return (0, _.callback)(bundle, bundle.end);

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}));
//# sourceMappingURL=callbackpipe.js.map