
define ['json5'], (JSON5) ->
  Function::property = (prop, desc) ->
    Object.defineProperty @prototype, prop, desc

  class Util
    constructor: () ->
      
    @GenerateGuid = (a, b) ->
      b = a = ""
      while a++ < 36
        b += (if a * 51 & 52 then ((if a ^ 15 then 8 ^ Math.random() * ((if a ^ 20 then 16 else 4)) else 4)).toString(16) else "")
      return b;
    @getLengthOfObject = (obj) ->
      return (k for own k of obj).length
    @jsonToObject: (str) ->
      return JSON5.parse(str);
    @isArray: Array.isArray || ( value ) -> return {}.toString.call( value ) is '[object Array]'
  return Util;