// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RestaurantDApp is ERC721, Ownable {

    // Mapping to track the number of orders a customer has made
    mapping(address => uint256) public orderCount;

    // Mapping to track if a customer has received their milestone NFT
    mapping(address => bool) public hasReceivedNFT;

    // Counter for the total number of NFTs issued
    uint256 public nftCounter;

    // Base URI for the NFT metadata
    string public baseURI;
    // address public _owner;

    // Event to be emitted when a milestone NFT is issued
    event MilestoneNFTIssued(address indexed customer, uint256 indexed tokenId);

    constructor(string memory name, string memory symbol, string memory _baseURI, address _owner) ERC721(name, symbol) Ownable(_owner) {
        baseURI = _baseURI;
        // _owner = msg.sender;
    }

    // Function to place an order
    function placeOrder() external {
        orderCount[msg.sender] += 1;

        // Check if the customer has reached the 1,000 order milestone and hasn't received an NFT yet
        if (orderCount[msg.sender] == 100 && !hasReceivedNFT[msg.sender]) {
            // Mint an NFT to the customer
            _mintNFT(msg.sender);
        }
    }

    // Internal function to mint an NFT
    function _mintNFT(address to) internal {
        nftCounter += 1;
        _safeMint(to, nftCounter);

        // Mark the customer as having received their milestone NFT
        hasReceivedNFT[to] = true;

        // Emit an event to notify that the NFT has been issued
        emit MilestoneNFTIssued(to, nftCounter);
    }

    // Override _baseURI function to return the base URI for metadata
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // Owner function to change the base URI
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }
}
