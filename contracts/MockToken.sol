pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MockToken is ERC20 {
  constructor(
    string memory symbol_,
    string memory name_,
    uint256 _amount
  ) ERC20(name_, symbol_) {
    _mint(msg.sender, _amount);
  }
}
