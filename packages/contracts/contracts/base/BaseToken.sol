// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BaseToken
 * @dev Base contract for all RATLR tokens. Implements common functionality and security features.
 */
abstract contract BaseToken is Ownable, Pausable, ReentrancyGuard {
    // Events
    event FeeCollected(address indexed token, address indexed collector, uint256 amount);
    event MetadataUpdated(string newMetadata);
    
    // State variables
    string public metadata;  // IPFS hash or URI containing token metadata
    uint256 public feePercentage;  // Fee percentage in basis points (1% = 100)
    address public feeCollector;
    
    // Constants
    uint256 public constant MAX_FEE = 1000;  // Maximum fee of 10% (1000 basis points)
    
    /**
     * @dev Constructor sets initial fee parameters and metadata
     * @param _metadata Initial metadata URI/hash
     * @param _feePercentage Initial fee percentage in basis points
     * @param _feeCollector Address that will receive fees
     */
    constructor(
        string memory _metadata,
        uint256 _feePercentage,
        address _feeCollector
    ) {
        require(_feePercentage <= MAX_FEE, "Fee too high");
        require(_feeCollector != address(0), "Invalid fee collector");
        
        metadata = _metadata;
        feePercentage = _feePercentage;
        feeCollector = _feeCollector;
    }
    
    /**
     * @dev Updates the token metadata
     * @param _newMetadata New metadata URI/hash
     */
    function updateMetadata(string memory _newMetadata) external onlyOwner {
        metadata = _newMetadata;
        emit MetadataUpdated(_newMetadata);
    }
    
    /**
     * @dev Updates the fee percentage
     * @param _newFeePercentage New fee percentage in basis points
     */
    function updateFeePercentage(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= MAX_FEE, "Fee too high");
        feePercentage = _newFeePercentage;
    }
    
    /**
     * @dev Updates the fee collector address
     * @param _newFeeCollector New address to collect fees
     */
    function updateFeeCollector(address _newFeeCollector) external onlyOwner {
        require(_newFeeCollector != address(0), "Invalid fee collector");
        feeCollector = _newFeeCollector;
    }
    
    /**
     * @dev Calculates fee amount based on the total amount
     * @param _amount Amount to calculate fee for
     * @return Fee amount
     */
    function calculateFee(uint256 _amount) public view returns (uint256) {
        return (_amount * feePercentage) / 10000;
    }
    
    /**
     * @dev Pauses token transfers and operations
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpauses token transfers and operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Hook that is called before any token transfer
     * Ensures the contract is not paused
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual whenNotPaused {
        // This can be overridden by child contracts
    }
}