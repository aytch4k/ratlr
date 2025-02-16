// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../tokens/RATLRToken1155.sol";

library ERC1155DeployerLib {
    function deployERC1155(
        string memory uri,
        string memory metadata,
        uint256 feePercentage,
        address feeCollector
    ) external returns (address) {
        RATLRToken1155 token = new RATLRToken1155(
            uri,
            metadata,
            feePercentage,
            feeCollector
        );
        return address(token);
    }
}