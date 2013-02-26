module.exports = if_else

var parser = require('parser')


function if_else(parser, contents) { 
  var bits = contents.split(/\s+/)  // ["if", "item"]
    , contextTarget = bits[1] // "item"
    , lookupContextVariable = parser.lookup(bits[1]) // parser.lookup("item")
    , ifBody
    , emptyBody

  parser.parse({
      'else':  else_tpl
      'elsif': elsif
      'endif': endif
      'empty': empty
  })

  return function(context) {
    var target = lookupContextVariable(context)
      , output = []
      , loopContext

    if(!target || !target.length) {
      return emptyBody ? emptyBody(context) : ''
    }

    for(var i = 0, len = target.length; i < len; ++i) {
      loopContext = Object.create(context)
      loopContext[contextTarget] = target[i]
      loopContext.forloop = {
          parent: loopContext.forloop
        , index: i
        , isfirst: i === 0
        , islast: i === len - 1
        , length: len
      } 
      output.push(ifBody(loopContext))   
    }

    return output.join('')
  }

  function empty(tpl) {
    ifBody = tpl
    parser.parse({'endif': endif})
  }

  function endif(tpl) {
    if(ifBody) {
      emptyBody = tpl
    } else {
      ifBody = tpl
    }
  }

  function elsif(tpl) {
    if(ifBody) {
      emptyBody = tpl
    } else {
      ifBody = tpl
    }
  }

  function else_tpl(tpl){
    if(ifBody) {
      emptyBody = tpl
    } else {
      ifBody = tpl
    }
  }
}

