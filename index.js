module.exports = if_else

// "write a module that works like the example tag 
// module but implements simple if and else checking.""

// *** EXAMPLE if and else tag:
// Evaluates a variable, and if that variable is “true” the contents of the block are displayed:
// {% if athlete_list %}
//     Number of athletes: {{ athlete_list|length }}
// {% else %}
//     No athletes.
// {% endif %}



function if_else(parser, contents) { 
  var bits = contents.split(/\s+/)  // ["for", "item", "in", "items"]
    , contextTarget = bits[1]
    , lookupContextVariable = parser.lookup(bits[3]) 
    , ifBody
    , emptyBody

  parser.parse({
    // do I just need 'endif'? Or do I also need 'else' and 'elsif'?
      'endif': endif
    , 'empty': empty
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
}

