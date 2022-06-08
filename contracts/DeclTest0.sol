// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DeclTest0 is ERC721URIStorage, ReentrancyGuard, Ownable {
    mapping(uint => Declaration) public declarations;

    uint256 PUBLIC_SUPPLY = 9500;
    uint256 OWNER_SUPPLY = 500;
    uint256 public publicMintCount = 0;
    uint256 ownerMintCount = 0;

    struct Declaration {
        uint id;
        uint addedAt;
        uint[][] indices;
        string tokenURI;
    }

    event DeclMinted(
        uint id,
        string tokenURI,
        uint[][] indices,
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

    // function tokenURI(uint256 tokenId) override public view returns(string memory) {
    //     string memory uriToReturn = declarations[tokenId].tokenURI;
    //     return uriToReturn;
    // }

    function mint(string calldata _tokenURI, uint[][] calldata indices) public nonReentrant {
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

        string memory tokenURIJson = Base64.encode(bytes(string(abi.encodePacked('{"name": "Redeclaration #', toString(publicMintCount), '", "description": "A reclaiming of the Declaration of Independence by those who never signed it.", "image": "', _tokenURI, '"}'))));
        string memory tokenURIString = string(abi.encodePacked('data:application/json;base64,', tokenURIJson));

        _safeMint(_msgSender(), publicMintCount);
        _setTokenURI(publicMintCount, tokenURIString);
        declarations[publicMintCount] = Declaration(publicMintCount, block.timestamp, indices, _tokenURI);

        // Trigger an event
        emit DeclMinted(
            publicMintCount,
            _tokenURI,
            indices,
            payable(msg.sender),
            block.timestamp
        );

        publicMintCount += 1;
    }

    function ownerMint() public nonReentrant {
        require(ownerMintCount < OWNER_SUPPLY, "All declarations have been minted");
        _safeMint(_msgSender(), PUBLIC_SUPPLY + ownerMintCount);
        ownerMintCount += 1;
    }

    function toString(uint256 value) internal pure returns (string memory) {
    // Inspired by OraclizeAPI's implementation - MIT license
    // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    constructor() ERC721("Redeclarations", "REDCL") Ownable() {}
}

/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((len + 2) / 3);

        // Add some extra buffer at the end
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
                out := shl(224, out)

                mstore(resultPtr, out)

                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}

