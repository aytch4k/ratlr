// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library TokenTrackerLib {
    // Enum for token types
    enum TokenType { ERC20, ERC721, ERC1155 }
    
    // Struct for token info
    struct TokenInfo {
        address tokenAddress;
        TokenType tokenType;
        address creator;
        uint256 timestamp;
        string metadata;
    }

    function recordToken(
        mapping(address => TokenInfo) storage tokens,
        address[] storage allTokens,
        address tokenAddress,
        TokenType tokenType,
        address creator,
        string memory metadata
    ) external {
        tokens[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            tokenType: tokenType,
            creator: creator,
            timestamp: block.timestamp,
            metadata: metadata
        });
        
        allTokens.push(tokenAddress);
        
        // Event emission moved to factory contract
    }

    function getTokensByCreator(
        mapping(address => TokenInfo) storage tokens,
        address[] storage allTokens,
        address creator
    ) external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allTokens.length; i++) {
            if (tokens[allTokens[i]].creator == creator) {
                count++;
            }
        }
        
        address[] memory creatorTokens = new address[](count);
        count = 0;
        for (uint256 i = 0; i < allTokens.length; i++) {
            if (tokens[allTokens[i]].creator == creator) {
                creatorTokens[count] = allTokens[i];
                count++;
            }
        }
        
        return creatorTokens;
    }
}