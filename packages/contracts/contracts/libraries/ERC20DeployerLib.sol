// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../tokens/RATLRToken20.sol";

library ERC20DeployerLib {
    function deployERC20(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        uint256 maxSupply,
        string memory metadata,
        uint256 feePercentage,
        address feeCollector
    ) external returns (address) {
        // Deploy token with factory as initial owner
        RATLRToken20 token = new RATLRToken20(
            name,
            symbol,
            decimals,
            initialSupply,
            maxSupply,
            metadata,
            feePercentage,
            feeCollector
        );
        
        // Transfer ownership to the actual deployer
        token.transferOwnership(msg.sender);
        
        return address(token);
    }
}