const fs = require('fs')
const path = require('path')
const assert = require('assert')

const parser = require('solidity-parser-antlr')
const resolveTypes = require('../index')

function readFileSync(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), 'utf8')
}

describe('resolve', function() {

  it('resolves contract variables', function() {

    const content = readFileSync('test.sol')
    const ast = parser.parse(content)

    // TODO: should support async operation
    const importsLoader = readFileSync

    resolveTypes(ast, importsLoader)

    const nodes = []
    parser.visit(ast, {
      UserDefinedTypeName: function(node) {
        nodes.push(node)
      }
    })
    
    for (let node of nodes) {
      assert.deepEqual(node.resolvedType, {
        type: 'ElementaryTypeName',
        name: 'address',
        stateMutability: 'payable'
      })
    }

  })

})
