module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Calculate the hyperbolic cotangent of a value
   *
   *     coth(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/HyperbolicCotangent.html
   */
  math.coth = function coth(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('coth', arguments.length, 1);
    }

    if (isNumber(x)) {
      var e = Math.exp(2 * x);
      return (e + 1) / (e - 1);
    }

    if (isComplex(x)) {
      var r = Math.exp(2 * x.re);
      var re = r * Math.cos(2 * x.im);
      var im = r * Math.sin(2 * x.im);
      var den = (re - 1) * (re - 1) + im * im;
      return new Complex(
        ((re + 1) * (re - 1) + im * im) / den,
        -2 * im / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function coth is no angle');
      }
      return coth(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, coth);
    }

    if (isBoolean(x)) {
      return coth(x ? 1 : 0);
    }

    if (x instanceof BigNumber) {
      // TODO: implement BigNumber support
      // downgrade to Number
      return coth(x.toNumber());
    }

    throw new math.error.UnsupportedTypeError('coth', math['typeof'](x));
  };
};