'use strict';

var _ = require('../');

var _tape = require('../tape');

var _tape2 = _interopRequireDefault(_tape);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var count = _.poem.wrap(regeneratorRuntime.mark(function count(min, max) {
  var i;
  return regeneratorRuntime.wrap(function count$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          i = min;

        case 1:
          if (!(i <= max)) {
            _context.next = 7;
            break;
          }

          _context.next = 4;
          return (0, _.put)(i);

        case 4:
          i++;
          _context.next = 1;
          break;

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, count, this);
}));

var double = function double(x) {
  return 2 * x;
};
var triple = function triple(x) {
  return 3 * x;
};

(0, _tape2.default)('story.wrap syntax', regeneratorRuntime.mark(function _callee(t) {
  var join, msg;
  return regeneratorRuntime.wrap(function _callee$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          join = _.story.wrap(regeneratorRuntime.mark(function join() {
            for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
              values[_key] = arguments[_key];
            }

            return regeneratorRuntime.wrap(function join$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    return _context2.abrupt('return', values.join(' '));

                  case 1:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, join, this);
          }));
          _context3.next = 3;
          return join('Hello,', 'World!');

        case 3:
          msg = _context3.sent;

          t.equal(msg, 'Hello, World!');

        case 5:
        case 'end':
          return _context3.stop();
      }
    }
  }, _callee, this);
}));

(0, _tape2.default)('epic(fn).promised(...args) syntax', regeneratorRuntime.mark(function _callee2(t) {
  var values, msg;
  return regeneratorRuntime.wrap(function _callee2$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          values = ['Hello,', 'World!'];
          _context5.next = 3;
          return (0, _.story)(regeneratorRuntime.mark(function join() {
            return regeneratorRuntime.wrap(function join$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    return _context4.abrupt('return', values.join(' '));

                  case 1:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, join, this);
          }));

        case 3:
          msg = _context5.sent;


          t.equal(msg, 'Hello, World!');

        case 5:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee2, this);
}));

(0, _tape2.default)('basic generator usage', regeneratorRuntime.mark(function _callee3(t) {
  var it, next;
  return regeneratorRuntime.wrap(function _callee3$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          it = count(0, 3);
          next = it.next();

          t.ok(next.value instanceof Promise);
          t.equal(next.done, false);
          _context6.next = 6;
          return next.value;

        case 6:
          next = _context6.sent;

          t.equal(next.value, 0);
          t.equal(next.done, false);

          next = it.next();
          t.ok(next.value instanceof Promise);
          t.equal(next.done, false);
          _context6.next = 14;
          return next.value;

        case 14:
          next = _context6.sent;

          t.equal(next.value, 1);
          t.equal(next.done, false);

          next = it.next();
          t.ok(next.value instanceof Promise);
          t.equal(next.done, false);
          _context6.next = 22;
          return next.value;

        case 22:
          next = _context6.sent;

          t.equal(next.value, 2);
          t.equal(next.done, false);

          next = it.next();
          t.ok(next.value instanceof Promise);
          t.equal(next.done, false);
          _context6.next = 30;
          return next.value;

        case 30:
          next = _context6.sent;

          t.equal(next.value, 3);
          t.equal(next.done, false);

          next = it.next();
          t.ok(next.value instanceof Promise);
          t.equal(next.done, false);
          _context6.next = 38;
          return next.value;

        case 38:
          next = _context6.sent;

          t.equal(next.value, undefined);
          t.equal(next.done, true);

        case 41:
        case 'end':
          return _context6.stop();
      }
    }
  }, _callee3, this);
}));

(0, _tape2.default)('fancy generator usage', regeneratorRuntime.mark(function _callee4(t) {
  var countDouble, it, next;
  return regeneratorRuntime.wrap(function _callee4$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          countDouble = _.poem.wrap(regeneratorRuntime.mark(function count(min, max) {
            var _i, i2;

            return regeneratorRuntime.wrap(function count$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _i = min;

                  case 1:
                    if (!(_i <= max)) {
                      _context7.next = 10;
                      break;
                    }

                    _context7.next = 4;
                    return (0, _.call)(double, _i);

                  case 4:
                    i2 = _context7.sent;
                    _context7.next = 7;
                    return (0, _.put)(i2);

                  case 7:
                    _i++;
                    _context7.next = 1;
                    break;

                  case 10:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, count, this);
          }));
          it = countDouble(4, 5);
          next = it.next();

          t.ok(next.value instanceof Promise);
          t.equal(next.done, false);
          _context8.next = 7;
          return next.value;

        case 7:
          next = _context8.sent;

          t.equal(next.value, 8);
          t.equal(next.done, false);

          next = it.next();
          t.ok(next.value instanceof Promise);
          t.equal(next.done, false);
          _context8.next = 15;
          return next.value;

        case 15:
          next = _context8.sent;

          t.equal(next.value, 10);
          t.equal(next.done, false);

          next = it.next();
          t.ok(next.value instanceof Promise);
          t.equal(next.done, false);
          _context8.next = 23;
          return next.value;

        case 23:
          next = _context8.sent;

          t.equal(next.value, undefined);
          t.equal(next.done, true);

        case 26:
        case 'end':
          return _context8.stop();
      }
    }
  }, _callee4, this);
}));

(0, _tape2.default)('take(iterator)', regeneratorRuntime.mark(function _callee5(t) {
  var collection, it, item;
  return regeneratorRuntime.wrap(function _callee5$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          collection = [];
          it = count(1, 8);
          item = undefined;

        case 3:
          _context9.next = 5;
          return (0, _.take)(it);

        case 5:
          if (!(item = _context9.sent)) {
            _context9.next = 9;
            break;
          }

          collection.push(item);
          _context9.next = 3;
          break;

        case 9:
          t.deepEqual(collection, [1, 2, 3, 4, 5, 6, 7, 8]);

        case 10:
        case 'end':
          return _context9.stop();
      }
    }
  }, _callee5, this);
}));

(0, _tape2.default)('take(iterator, output)', regeneratorRuntime.mark(function _callee6(t) {
  var collection, it, item;
  return regeneratorRuntime.wrap(function _callee6$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          collection = [];
          it = count(0, 5);
          item = {};

        case 3:
          _context10.next = 5;
          return (0, _.take)(it, item);

        case 5:
          if (!_context10.sent) {
            _context10.next = 9;
            break;
          }

          collection.push(item.value);
          _context10.next = 3;
          break;

        case 9:
          t.deepEqual(collection, [0, 1, 2, 3, 4, 5]);

        case 10:
        case 'end':
          return _context10.stop();
      }
    }
  }, _callee6, this);
}));

(0, _tape2.default)('callback(context, fn, ...args)', regeneratorRuntime.mark(function _callee7(t) {
  var obj, noop, OPTIONAL, permutations, expectations, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, options, newExpectations, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, expectation, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, option, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, spec, expected;

  return regeneratorRuntime.wrap(function _callee7$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          // This test throws 32 different sets of arguments at the callback export
          // Woah

          obj = {};

          noop = function noop() {};

          OPTIONAL = Symbol();
          permutations = [[noop, [obj, noop]], [1, 'hi', Symbol(), OPTIONAL], [1, 'hi', Symbol(), OPTIONAL]];
          expectations = undefined;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context11.prev = 8;
          _iterator = permutations[Symbol.iterator]();

        case 10:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context11.next = 73;
            break;
          }

          options = _step.value;

          if (!expectations) {
            _context11.next = 69;
            break;
          }

          newExpectations = [];
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context11.prev = 17;
          _iterator3 = expectations[Symbol.iterator]();

        case 19:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context11.next = 52;
            break;
          }

          expectation = _step3.value;
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context11.prev = 24;
          _iterator4 = options[Symbol.iterator]();

        case 26:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context11.next = 35;
            break;
          }

          option = _step4.value;

          if (!(option === OPTIONAL)) {
            _context11.next = 30;
            break;
          }

          return _context11.abrupt('break', 35);

        case 30:
          if (!Array.isArray(option)) {
            option = [option];
          }
          newExpectations.push(expectation.concat(option));

        case 32:
          _iteratorNormalCompletion4 = true;
          _context11.next = 26;
          break;

        case 35:
          _context11.next = 41;
          break;

        case 37:
          _context11.prev = 37;
          _context11.t0 = _context11['catch'](24);
          _didIteratorError4 = true;
          _iteratorError4 = _context11.t0;

        case 41:
          _context11.prev = 41;
          _context11.prev = 42;

          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }

        case 44:
          _context11.prev = 44;

          if (!_didIteratorError4) {
            _context11.next = 47;
            break;
          }

          throw _iteratorError4;

        case 47:
          return _context11.finish(44);

        case 48:
          return _context11.finish(41);

        case 49:
          _iteratorNormalCompletion3 = true;
          _context11.next = 19;
          break;

        case 52:
          _context11.next = 58;
          break;

        case 54:
          _context11.prev = 54;
          _context11.t1 = _context11['catch'](17);
          _didIteratorError3 = true;
          _iteratorError3 = _context11.t1;

        case 58:
          _context11.prev = 58;
          _context11.prev = 59;

          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }

        case 61:
          _context11.prev = 61;

          if (!_didIteratorError3) {
            _context11.next = 64;
            break;
          }

          throw _iteratorError3;

        case 64:
          return _context11.finish(61);

        case 65:
          return _context11.finish(58);

        case 66:
          expectations = expectations.concat(newExpectations);
          _context11.next = 70;
          break;

        case 69:
          expectations = options.map(function (opt) {
            return Array.isArray(opt) ? opt : [opt];
          });

        case 70:
          _iteratorNormalCompletion = true;
          _context11.next = 10;
          break;

        case 73:
          _context11.next = 79;
          break;

        case 75:
          _context11.prev = 75;
          _context11.t2 = _context11['catch'](8);
          _didIteratorError = true;
          _iteratorError = _context11.t2;

        case 79:
          _context11.prev = 79;
          _context11.prev = 80;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 82:
          _context11.prev = 82;

          if (!_didIteratorError) {
            _context11.next = 85;
            break;
          }

          throw _iteratorError;

        case 85:
          return _context11.finish(82);

        case 86:
          return _context11.finish(79);

        case 87:
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context11.prev = 90;


          for (_iterator2 = expectations[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            spec = _step2.value;
            expected = [_.callback].concat(_toConsumableArray(spec[0] === noop ? [null].concat(spec) : spec));

            t.deepEqual(_.callback.apply(undefined, _toConsumableArray(spec)), expected, 'callback(' + spec.map(_util2.default.inspect).join(', ') + ') === [' + expected.map(_util2.default.inspect).join(', ') + ']');
          }
          _context11.next = 98;
          break;

        case 94:
          _context11.prev = 94;
          _context11.t3 = _context11['catch'](90);
          _didIteratorError2 = true;
          _iteratorError2 = _context11.t3;

        case 98:
          _context11.prev = 98;
          _context11.prev = 99;

          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }

        case 101:
          _context11.prev = 101;

          if (!_didIteratorError2) {
            _context11.next = 104;
            break;
          }

          throw _iteratorError2;

        case 104:
          return _context11.finish(101);

        case 105:
          return _context11.finish(98);

        case 106:
        case 'end':
          return _context11.stop();
      }
    }
  }, _callee7, this, [[8, 75, 79, 87], [17, 54, 58, 66], [24, 37, 41, 49], [42,, 44, 48], [59,, 61, 65], [80,, 82, 86], [90, 94, 98, 106], [99,, 101, 105]]);
}));

(0, _tape2.default)('nested yields', regeneratorRuntime.mark(function _callee8(t) {
  var results;
  return regeneratorRuntime.wrap(function _callee8$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return [(0, _.call)(double, 1.5), (0, _.call)(double, 8), (0, _.call)(triple, -0.5), [Promise.resolve(5), (0, _.call)(triple, 8), [(0, _.call)(double, 8), false]]];

        case 2:
          results = _context12.sent;

          t.deepEqual(results, [3, 16, -1.5, [5, 24, [16, false]]]);

          _context12.next = 6;
          return {
            first: 1,
            second: Promise.resolve(2),
            third: (0, _.call)(double, 1.5),
            fourth: [Promise.resolve(4), (0, _.call)(double, 2.5), {
              fifth: 5,
              sixth: {
                seventh: (0, _.call)(double, 3.5)
              }
            }]
          };

        case 6:
          results = _context12.sent;


          t.deepEqual(results, {
            first: 1,
            second: 2,
            third: 3,
            fourth: [4, 5, {
              fifth: 5,
              sixth: {
                seventh: 7
              }
            }]
          });

        case 8:
        case 'end':
          return _context12.stop();
      }
    }
  }, _callee8, this);
}));
//# sourceMappingURL=usage.js.map