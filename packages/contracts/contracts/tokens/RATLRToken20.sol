// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "../base/BaseToken.sol";

/**
 * @title RATLRToken20
 * @dev ERC20 token implementation for RATLR platform with fee mechanism and additional features
 */
contract RATLRToken20 is ERC20, ERC20Burnable, BaseToken {
    // Token configuration
    uint8 private immutable _decimals;
    uint256 public maxSupply;
    
    /**
     * @dev Constructor sets up the token with initial parameters
     * @param name Token name
     * @param symbol Token symbol
     * @param decimals_ Token decimals
     * @param initialSupply Initial token supply
     * @param maxSupply_ Maximum token supply (0 for unlimited)
     * @param metadata IPFS hash or URI containing token metadata
     * @param feePercentage Fee percentage in basis points
     * @param feeCollector Address that will receive fees
     */
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialSupply,
        uint256 maxSupply_,
        string memory metadata,
        uint256 feePercentage,
        address feeCollector
    ) ERC20(name, symbol) BaseToken(metadata, feePercentage, feeCollector) {
        require(initialSupply <= maxSupply_ || maxSupply_ == 0, "Initial supply exceeds max");
        
        _decimals = decimals_;
        maxSupply = maxSupply_;
        
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
    }
    
    /**
     * @dev Returns the number of decimals used for token
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Mints new tokens, respecting max supply if set
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(maxSupply == 0 || totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Override of _transfer to implement fee collection
     * @param from Address sending tokens
     * @param to Address receiving tokens
     * @param amount Amount of tokens to transfer
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20) {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        
        _beforeTokenTransfer(from, to, amount);
        
        uint256 feeAmount = calculateFee(amount);
        uint256 transferAmount = amount - feeAmount;
        
        // Transfer main amount
        super._transfer(from, to, transferAmount);
        
        // Transfer fee if applicable
        if (feeAmount > 0) {
            super._transfer(from, feeCollector, feeAmount);
            emit FeeCollected(address(this), feeCollector, feeAmount);
        }
    }
    
    /**
     * @dev Hook that is called before any transfer of tokens
     * @param from Address sending tokens
     * @param to Address receiving tokens
     * @param amount Amount of tokens to transfer
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20, BaseToken) whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}