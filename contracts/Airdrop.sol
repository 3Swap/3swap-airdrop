pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Airdrop is Ownable {
  function drop(
    address _token,
    address[] memory _addresses,
    uint256 _amount
  ) external onlyOwner {
    IERC20 token_ = IERC20(_token);

    require(
      _addresses.length * _amount <= token_.balanceOf(address(this)),
      'insufficient amount of tokens'
    );

    for (uint256 i = 0; i < _addresses.length; i++) {
      require(_addresses[i] != address(0), 'cannot send to zero address');
      require(_addresses[i] != address(this), 'cannot send to this contract');
      require(token_.transfer(_addresses[i], _amount), 'could not send tokens');
    }
  }
}
