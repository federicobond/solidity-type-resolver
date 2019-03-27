const parser = require('solidity-parser-antlr')

function hasPayableFallbackFunction(contract) {
  for (let node of contract.subNodes) {
    if (node.type == 'FunctionDefinition'
        && node.name === ''
        && node.stateMutability === 'payable') {
      return true
    }
  }
  return false
}

function resolve(ast, importsLoader) {
  const resolvedTypes = {}

  parser.visit(ast, {
    ImportDirective: function(importNode) {
      const content = importsLoader(importNode.path)
      const ast = parser.parse(content)

      parser.visit(ast, {
        ContractDefinition: function(node) {

          let name

          if (importNode.unitAlias) {
            name = [importNode.unitAlias, node.name].join('.')
          }

          if (importNode.symbolAliases) {
            for (let alias of importNode.symbolAliases) {
              if (node.name == alias[0]) {
                name = alias[1] || name // this or handles the case where the name is imported as is
              }
            }
            if (!name) {
              return // if no name was assigned at this stage, it was not alias imported
            }
          }

          name = node.name

          let stateMutability = null
          if (hasPayableFallbackFunction(node)) {
            stateMutability = 'payable'
          }

          resolvedTypes[name] = {
            type: 'ElementaryTypeName',
            name: 'address',
            stateMutability: stateMutability,
          }
        }
      })
    }
  })

  parser.visit(ast, {
    UserDefinedTypeName: function(node) {
      const typeName = node.namePath
      if (typeName in resolvedTypes) {
        node.resolvedType = resolvedTypes[typeName]
      } else {
        throw new Error('could not resolve type for ' + typeName)
      }
    }
  })
  
}

module.exports = resolve
