// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../base/BaseToken.sol";

/**
 * @title RATLRToken721
 * @dev ERC721 NFT implementation for RATLR platform with fee mechanism and metadata support
 */
contract RATLRToken721 is ERC721, ERC721Enumerable, ERC721URIStorage, BaseToken {
    // Token configuration
    uint256 public maxSupply;
    uint256 private _nextTokenId;
    
    // Mapping for token royalties
    mapping(uint256 => uint256) public tokenRoyalties;
    
    // Events
    event RoyaltySet(uint256 indexed tokenId, uint256 royaltyPercentage);
    
    /**
     * @dev Constructor sets up the NFT collection with initial parameters
     * @param name Collection name
     * @param symbol Collection symbol
     * @param maxSupply_ Maximum number of tokens (0 for unlimited)
     * @param metadata IPFS hash or URI containing collection metadata
     * @param feePercentage Platform fee percentage in basis points
     * @param feeCollector Address that will receive platform fees
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 maxSupply_,
        string memory metadata,
        uint256 feePercentage,
        address feeCollector
    ) ERC721(name, symbol) BaseToken(metadata, feePercentage, feeCollector) {
        maxSupply = maxSupply_;
        _nextTokenId = 1;
    }
    
    /**
     * @dev Mints a new NFT
     * @param to Address to mint the token to
     * @param uri URI for token metadata
     * @param royaltyPercentage Royalty percentage for secondary sales (in basis points)
     */
    function mint(
        address to,
        string memory uri,
        uint256 royaltyPercentage
    ) external onlyOwner returns (uint256) {
        require(maxSupply == 0 || _nextTokenId <= maxSupply, "Max supply reached");
        require(royaltyPercentage <= MAX_FEE, "Royalty too high");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        tokenRoyalties[tokenId] = royaltyPercentage;
        
        emit RoyaltySet(tokenId, royaltyPercentage);
        
        return tokenId;
    }
    
    /**
     * @dev Burns a token
     * @param tokenId ID of token to burn
     */
    function burn(uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not approved");
        _burn(tokenId);
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
        require(_exists(tokenId), "Token doesn't exist");
        uint256 royaltyPercentage = tokenRoyalties[tokenId];
        return (owner(), (salePrice * royaltyPercentage) / 10000);
    }
    
    /**
     * @dev Hook that is called before any token transfer
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }
    
    /**
     * @dev Override for BaseToken's _beforeTokenTransfer to match ERC721's signature
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(BaseToken) whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Required override for token URI storage
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    /**
     * @dev Required override for token URI storage
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Required override for ERC721Enumerable support
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}