// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "../base/BaseToken.sol";

/**
 * @title RATLRToken1155
 * @dev ERC1155 Multi-token implementation for RATLR platform
 */
contract RATLRToken1155 is ERC1155, ERC1155Supply, ERC1155URIStorage, BaseToken {
    // Token configuration
    mapping(uint256 => uint256) public maxSupply;
    mapping(uint256 => bool) public isNFT;
    mapping(uint256 => uint256) public tokenRoyalties;
    
    // Events
    event TokenTypeCreated(uint256 indexed id, bool isNFT, uint256 maxSupply);
    event RoyaltySet(uint256 indexed tokenId, uint256 royaltyPercentage);
    
    /**
     * @dev Constructor sets up the token collection
     * @param uri_ Base URI for token metadata
     * @param metadata IPFS hash or URI containing collection metadata
     * @param feePercentage Platform fee percentage in basis points
     * @param feeCollector Address that will receive platform fees
     */
    constructor(
        string memory uri_,
        string memory metadata,
        uint256 feePercentage,
        address feeCollector
    ) ERC1155(uri_) BaseToken(metadata, feePercentage, feeCollector) {}
    
    /**
     * @dev Creates a new token type
     * @param id Token ID to create
     * @param isNFT_ Whether this token type is non-fungible
     * @param maxSupply_ Maximum supply (0 for unlimited)
     * @param initialSupply Initial supply to mint
     * @param uri_ URI for token metadata
     * @param royaltyPercentage Royalty percentage for secondary sales
     */
    function createTokenType(
        uint256 id,
        bool isNFT_,
        uint256 maxSupply_,
        uint256 initialSupply,
        string memory uri_,
        uint256 royaltyPercentage
    ) external onlyOwner {
        require(totalSupply(id) == 0, "Token type exists");
        require(royaltyPercentage <= MAX_FEE, "Royalty too high");
        require(
            !isNFT_ || initialSupply <= 1,
            "NFT initial supply must be 0 or 1"
        );
        require(
            initialSupply <= maxSupply_ || maxSupply_ == 0,
            "Initial supply exceeds max"
        );
        
        isNFT[id] = isNFT_;
        maxSupply[id] = maxSupply_;
        tokenRoyalties[id] = royaltyPercentage;
        
        _setURI(id, uri_);
        
        if (initialSupply > 0) {
            _mint(msg.sender, id, initialSupply, "");
        }
        
        emit TokenTypeCreated(id, isNFT_, maxSupply_);
        emit RoyaltySet(id, royaltyPercentage);
    }
    
    /**
     * @dev Mints tokens
     * @param to Address to mint tokens to
     * @param id Token ID to mint
     * @param amount Amount to mint
     * @param data Additional data to pass to receivers
     */
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyOwner {
        require(
            maxSupply[id] == 0 || totalSupply(id) + amount <= maxSupply[id],
            "Exceeds max supply"
        );
        require(!isNFT[id] || amount == 1, "NFT amount must be 1");
        
        _mint(to, id, amount, data);
    }
    
    /**
     * @dev Mints multiple token types at once
     * @param to Address to mint tokens to
     * @param ids Array of token IDs
     * @param amounts Array of amounts to mint
     * @param data Additional data to pass to receivers
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyOwner {
        require(ids.length == amounts.length, "Length mismatch");
        
        for (uint256 i = 0; i < ids.length; i++) {
            require(
                maxSupply[ids[i]] == 0 ||
                    totalSupply(ids[i]) + amounts[i] <= maxSupply[ids[i]],
                "Exceeds max supply"
            );
            require(!isNFT[ids[i]] || amounts[i] == 1, "NFT amount must be 1");
        }
        
        _mintBatch(to, ids, amounts, data);
    }
    
    /**
     * @dev Burns tokens
     * @param account Address to burn tokens from
     * @param id Token ID to burn
     * @param amount Amount to burn
     */
    function burn(address account, uint256 id, uint256 amount) external {
        require(
            account == msg.sender || isApprovedForAll(account, msg.sender),
            "Not approved"
        );
        _burn(account, id, amount);
    }
    
    /**
     * @dev Burns multiple token types at once
     * @param account Address to burn tokens from
     * @param ids Array of token IDs
     * @param amounts Array of amounts to burn
     */
    function burnBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory amounts
    ) external {
        require(
            account == msg.sender || isApprovedForAll(account, msg.sender),
            "Not approved"
        );
        _burnBatch(account, ids, amounts);
    }
    
    /**
     * @dev Returns royalty information for a token
     * @param tokenId Token ID to query
     * @return receiver Address to receive royalties
     * @return royaltyAmount Royalty amount for the sale price
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view returns (address receiver, uint256 royaltyAmount) {
        uint256 royaltyPercentage = tokenRoyalties[tokenId];
        return (owner(), (salePrice * royaltyPercentage) / 10000);
    }
    
    /**
     * @dev Hook that is called before any token transfer
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    
    /**
     * @dev Override for BaseToken's _beforeTokenTransfer to match ERC1155's signature
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(BaseToken) whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev See {IERC165-supportsInterface}
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Override for URI storage
     */
    function uri(
        uint256 tokenId
    ) public view virtual override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return super.uri(tokenId);
    }
}