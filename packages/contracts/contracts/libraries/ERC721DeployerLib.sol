// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../tokens/RATLRToken721.sol";

library ERC721DeployerLib {
    function deployERC721(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        string memory metadata,
        uint256 feePercentage,
        address feeCollector
    ) external returns (address) {
        RATLRToken721 token = new RATLRToken721(
            name,
            symbol,
            maxSupply,
            metadata,
            feePercentage,
            feeCollector
        );
        return address(token);
    }
}