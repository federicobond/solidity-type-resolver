pragma solidity 0.5.4;
import "./Negotiator.sol";


contract MyContract {

  constructor(Negotiator _negotiator) public {
          owner = msg.sender;
          negotiator = _negotiator;
  }

  function() public payable {
    revert("Cannot send ether");
  }

}
