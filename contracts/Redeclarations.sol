// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.12;
pragma experimental ABIEncoderV2;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Redeclarations is ERC721URIStorage, ReentrancyGuard, Ownable {
    mapping(uint => Declaration) public declarations;

    uint256 PUBLIC_SUPPLY = 468;
    uint256 public publicMintCount = 0;
    uint256 PER_OWNER_SUPPLY = 25;
    uint256 public ownerMintCount = 0;
    uint256 public owner2MintCount = 0;
    uint256 public owner3MintCount = 0;
    uint256 public owner4MintCount = 0;

    struct Declaration {
        uint id;
        uint addedAt;
        string indices;
        string imageUrl;
    }

    event DeclMintOrUpdate(
        uint id,
        string imageUrl,
        string indices,
        address payable minter,
        uint addedAt
    );

    function totalMintCount() internal view returns (uint) {
        return publicMintCount + ownerMintCount + owner2MintCount + owner3MintCount + owner4MintCount;
    }

    function updateToken(uint _tokenId, string calldata _imageUrl, string calldata _indicesString) public nonReentrant onlyOwner {
        declarations[_tokenId] = Declaration(_tokenId, block.timestamp, _indicesString, _imageUrl);

        emit DeclMintOrUpdate(
            _tokenId,
            _imageUrl,
            _indicesString,
            payable(msg.sender),
            block.timestamp
        );
    }

    function ownerMint(string calldata _imageUrl, string calldata _indices) public nonReentrant onlyOwner {
        require(ownerMintCount < PER_OWNER_SUPPLY, 'All owner declarations have been minted');
        internalMint(_imageUrl, _indices);
        ownerMintCount += 1;
    }

    function owner2Mint(string calldata _imageUrl, string calldata _indices) public nonReentrant {
        address owner2Address = 0x61373CDDB315d0A85C88D8d335AE3da85eE46aE2;
        require(msg.sender == owner2Address);
        require(owner2MintCount < PER_OWNER_SUPPLY, 'All owner declarations have been minted');
        internalMint(_imageUrl, _indices);
        owner2MintCount += 1;
    }

    function owner3Mint(string calldata _imageUrl, string calldata _indices) public nonReentrant {
        address owner3Address = 0x7ace2E1bb87bEa8AD952eAb4De66B7D2a4992Ca4;
        require(msg.sender == owner3Address);
        require(owner3MintCount < PER_OWNER_SUPPLY, 'All owner declarations have been minted');
        internalMint(_imageUrl, _indices);
        owner3MintCount += 1;
    }

    function owner4Mint(string calldata _imageUrl, string calldata _indices) public nonReentrant {
        address owner4Address = 0x224D199FCE0B9c23f36Ffe60406A53812ddf773D;
        require(msg.sender == owner4Address);
        require(owner4MintCount < PER_OWNER_SUPPLY, 'All owner declarations have been minted');
        internalMint(_imageUrl, _indices);
        owner4MintCount += 1;
    }

    function publicMint(string calldata _imageUrl, string calldata _indices) public nonReentrant {
        require(publicMintCount < PUBLIC_SUPPLY, 'All public declarations have been minted');
        internalMint(_imageUrl, _indices);
        publicMintCount += 1;
    }

    function internalMint(string calldata _imageUrl, string calldata _indices ) internal {
        bool validIndices = true;
        uint tokenId = totalMintCount();

        // Check for uniqueness compared to existing declarations. 
        for (uint256 i = 0; i < tokenId; i ++) {
            if(hashCompareWithLengthCheck(_indices, declarations[i].indices)) {
                validIndices = false;
            }
        }
        require(validIndices, 'This declaration has already been minted.');

        string memory tokenURIJson = Base64.encode(bytes(string(abi.encodePacked('{"name": "Redeclaration #', toString(tokenId), '", "description": "A reclaiming of the Declaration of Independence by those who never signed it.", "image": "', _imageUrl, '", "selection": "', _indices, '"}'))));
        string memory tokenURIString = string(abi.encodePacked('data:application/json;base64,', tokenURIJson));

        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, tokenURIString);
        declarations[tokenId] = Declaration(tokenId, block.timestamp, _indices, _imageUrl);

        // Trigger an event
        emit DeclMintOrUpdate(
            tokenId,
            _imageUrl,
            _indices,
            payable(msg.sender),
            block.timestamp
        );
    }

    function hashCompareWithLengthCheck(string memory a, string memory b) internal pure returns (bool) {
        if(bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(bytes(a)) == keccak256(bytes(b));
        }
    }

    function toString(uint256 value) internal pure returns (string memory) {
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

    constructor() ERC721("Redeclarations", "RDCLR") Ownable() {}
}

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

