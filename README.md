solidity-type-resolver
======================

A library for doing simple type resolution of Solidity ASTs generated with [solidity-parser-antlr](https://github.com/federicobond/solidity-parser-antlr/).

It processes the AST and adds a `resolvedType` key in every UserDefinedTypeName node it finds. It will fail if it cannot resolve a declaration.

### License

MIT

### Author

Federico Bond (@federicobond)
