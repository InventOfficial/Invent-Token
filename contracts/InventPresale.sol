// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.5.0;

import "./openzeppelin-contracts-2.5.0/contracts/token/ERC20/IERC20.sol";
import "./openzeppelin-contracts-2.5.0/contracts/crowdsale/Crowdsale.sol";

contract InventPresale is Crowdsale {
    /**
     * @param _rate Number of token units a buyer gets per wei
     * @dev The rate is the conversion between wei and the smallest and indivisible
     * token unit. So, if you are using a rate of 1 with a ERC20Detailed token
     * with 3 decimals called TOK, 1 wei will give you 1 unit, or 0.001 TOK.
     * @param _wallet Address where collected funds will be forwarded to
     * @param _token Address of the token being sold
     */
    constructor(uint56 _rate, address payable _wallet, address _token) public Crowdsale(_rate, _wallet, IERC20(_token)) {}
}