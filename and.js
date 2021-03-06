// @flow

const interpolate1 = require('./helpers/interpolate1')
const raw = require('./raw')
const template = require('./template')
const auto = require('./auto')

/*:: import Sanitised from './sanitised' */

// TODO: Don't do `auto` here, we know the shape of it better.
const and /*: (...$ReadOnlyArray<mixed>) => Sanitised */ =
  (...xs) => template`(${raw(interpolate1(xs.map(auto), raw(' and ')).join(''))})`

module.exports = and
