// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../libraries/ERC20DeployerLib.sol";
import "../libraries/ERC721DeployerLib.sol";
import "../libraries/ERC1155DeployerLib.sol";
import "../libraries/TokenTrackerLib.sol";

/**
 * @title RATLRFactory
 * @dev Factory contract for deploying RATLR token contracts
 */
contract RATLRFactory is Ownable, ReentrancyGuard {
    using TokenTrackerLib for mapping(address => TokenTrackerLib.TokenInfo);
    using TokenTrackerLib for address[];

    // Struct for token deployment parameters
    struct TokenParams {
        string name;
        string symbol;
        string metadata;
        uint256 feePercentage;
    }
    
    // State variables
    address public feeCollector;
    uint256 public deploymentFee;
    mapping(address => TokenTrackerLib.TokenInfo) public tokens;
    address[] public allTokens;
    
    // Events
    event DeploymentFeeUpdated(uint256 newFee);
    event FeeCollectorUpdated(address newCollector);
    event TokenDeployed(
        address indexed tokenAddress,
        TokenTrackerLib.TokenType indexed tokenType,
        address indexed creator,
        string metadata
    );
    
    /**
     * @dev Constructor sets initial fee parameters
     * @param _feeCollector Address to collect deployment fees
     * @param _deploymentFee Initial deployment fee
     */
    constructor(address _feeCollector, uint256 _deploymentFee) {
        require(_feeCollector != address(0), "Invalid fee collector");
        feeCollector = _feeCollector;
        deploymentFee = _deploymentFee;
    }
    
    /**
     * @dev Deploys a new ERC20 token
     */
    function deployERC20(
        TokenParams calldata params,
        uint8 decimals,
        uint256 initialSupply,
        uint256 maxSupply
    ) external payable nonReentrant returns (address) {
        require(msg.value >= deploymentFee, "Insufficient deployment fee");
        
        address token = ERC20DeployerLib.deployERC20(
            params.name,
            params.symbol,
            decimals,
            initialSupply,
            maxSupply,
            params.metadata,
            params.feePercentage,
            feeCollector
        );
        
        // Record token in storage
        TokenTrackerLib.recordToken(
            tokens,
            allTokens,
            token,
            TokenTrackerLib.TokenType.ERC20,
            msg.sender,
            params.metadata
        );

        // Emit event from the factory
        emit TokenDeployed(
            token,
            TokenTrackerLib.TokenType.ERC20,
            msg.sender,
            params.metadata
        );

        _transferDeploymentFee();
        return token;
    }
    
    /**
     * @dev Deploys a new ERC721 token
     */
    function deployERC721(
        TokenParams calldata params,
        uint256 maxSupply
    ) external payable nonReentrant returns (address) {
        require(msg.value >= deploymentFee, "Insufficient deployment fee");
        
        address token = ERC721DeployerLib.deployERC721(
            params.name,
            params.symbol,
            maxSupply,
            params.metadata,
            params.feePercentage,
            feeCollector
        );
        
        // Record token in storage
        TokenTrackerLib.recordToken(
            tokens,
            allTokens,
            token,
            TokenTrackerLib.TokenType.ERC721,
            msg.sender,
            params.metadata
        );

        // Emit event from the factory
        emit TokenDeployed(
            token,
            TokenTrackerLib.TokenType.ERC721,
            msg.sender,
            params.metadata
        );

        _transferDeploymentFee();
        return token;
    }
    
    /**
     * @dev Deploys a new ERC1155 token
     */
    function deployERC1155(
        TokenParams calldata params,
        string memory uri
    ) external payable nonReentrant returns (address) {
        require(msg.value >= deploymentFee, "Insufficient deployment fee");
        
        address token = ERC1155DeployerLib.deployERC1155(
            uri,
            params.metadata,
            params.feePercentage,
            feeCollector
        );
        
        // Record token in storage
        TokenTrackerLib.recordToken(
            tokens,
            allTokens,
            token,
            TokenTrackerLib.TokenType.ERC1155,
            msg.sender,
            params.metadata
        );

        // Emit event from the factory
        emit TokenDeployed(
            token,
            TokenTrackerLib.TokenType.ERC1155,
            msg.sender,
            params.metadata
        );

        _transferDeploymentFee();
        return token;
    }
    
    /**
     * @dev Transfers deployment fee to fee collector
     */
    function _transferDeploymentFee() internal {
        if (deploymentFee > 0) {
            (bool success, ) = feeCollector.call{value: msg.value}("");
            require(success, "Fee transfer failed");
        }
    }
    
    /**
     * @dev Updates the deployment fee
     */
    function updateDeploymentFee(uint256 newFee) external onlyOwner {
        deploymentFee = newFee;
        emit DeploymentFeeUpdated(newFee);
    }
    
    /**
     * @dev Updates the fee collector address
     */
    function updateFeeCollector(address newCollector) external onlyOwner {
        require(newCollector != address(0), "Invalid fee collector");
        feeCollector = newCollector;
        emit FeeCollectorUpdated(newCollector);
    }
    
    /**
     * @dev Returns all deployed tokens
     */
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
    
    /**
     * @dev Returns number of deployed tokens
     */
    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }
    
    /**
     * @dev Returns tokens created by a specific address
     */
    function getTokensByCreator(
        address creator
    ) external view returns (address[] memory) {
        return TokenTrackerLib.getTokensByCreator(tokens, allTokens, creator);
    }
}