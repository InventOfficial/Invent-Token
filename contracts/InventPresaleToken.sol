// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract InventPresaleToken is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1 * 10**12 * 10**18;     // 1T total supply (10^12 with 18 decimals)

    constructor() ERC20("INVENT Presale Token", "INVT_PRE") {
        _mint(_msgSender(), TOTAL_SUPPLY);
    }

}