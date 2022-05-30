// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DeclTest0 is ERC721, ReentrancyGuard, Ownable {
    mapping(uint => Declaration) public declarations;

    struct Declaration {
        uint id;
        uint addedAt;
        uint[][] indices;
        string tokenURI;
    }

    uint256 PUBLIC_SUPPLY = 9500;
    uint256 OWNER_SUPPLY = 500;
    uint256 public publicMintCount = 0;
    uint256 ownerMintCount = 0;

    event DeclMinted(
        uint id,
        address payable minter,
        uint addedAt
    );

    event Example(
        address payable minter,
        uint addedAt
    );

    function justEmit() public {
        emit Example(payable(msg.sender), block.timestamp);
    }

    function mint(string calldata _tokenUri, uint[][] calldata indices) public nonReentrant {
        // Figure out how to limit minting depending on the senders individual limit
        require(publicMintCount < PUBLIC_SUPPLY, 'All declarations have been minted');

        bool validUri = true;
        // Check that the URI is pointing to one of our redeclaration endpoints
        require(validUri, 'Uri is too long has too many lines');

        bool validIndices = true;
        // Iterate through the indices and ensure they make sense.
        require(validIndices, 'Submitted indices are invalid.');
        // Check for uniqueness compared to existing declarations. 
        require(validIndices, 'This declaration has already been minted.');

        _safeMint(_msgSender(), publicMintCount);
        declarations[publicMintCount] = Declaration(publicMintCount, block.timestamp, indices, _tokenUri);

        // Trigger an event
        emit DeclMinted(publicMintCount, payable(msg.sender), block.timestamp);

        publicMintCount += 1;
    }

    function ownerMint() public nonReentrant {
        require(ownerMintCount < OWNER_SUPPLY, "All declarations have been minted");
        _safeMint(_msgSender(), PUBLIC_SUPPLY + ownerMintCount);
        ownerMintCount += 1;
    }

    constructor() ERC721("DummyToken", "DCLR") Ownable() {}
}