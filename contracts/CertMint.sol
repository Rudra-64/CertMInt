// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CertMint is ERC721 {
    using Strings for uint256;

    uint256 private _nextTokenId;

    struct Certificate {
        string recipientName;
        string badgeType;
        string mintDate;
    }

    mapping(uint256 => Certificate) public certificates;

    event CertificateClaimed(
        uint256 indexed tokenId,
        address indexed owner,
        string recipientName,
        string badgeType,
        string mintDate
    );

    constructor() ERC721("CertMint Certificate", "CERTMINT") {
        _nextTokenId = 1; // start token ID at 1
    }

    function claimCertificate(
        string calldata name,
        string calldata badge,
        string calldata date
    ) external returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(msg.sender, tokenId);

        certificates[tokenId] = Certificate({
            recipientName: name,
            badgeType: badge,
            mintDate: date
        });

        emit CertificateClaimed(tokenId, msg.sender, name, badge, date);

        return tokenId;
    }

    function totalCertificates() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function getCertificate(uint256 tokenId) external view returns (Certificate memory) {
        _requireOwned(tokenId);
        return certificates[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        Certificate memory cert = certificates[tokenId];

        string memory svg = generateSVG(tokenId, cert.recipientName, cert.badgeType, cert.mintDate);

        bytes memory json = abi.encodePacked(
            '{"name": "CertMint Achievement #', tokenId.toString(), '", ',
            '"description": "On-chain achievement certificate representing completion of a milestone. Secured by Universal Gateway Framework.", ',
            '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '", ',
            '"attributes": [',
                '{"trait_type": "RecipientName", "value": "', cert.recipientName, '"}, ',
                '{"trait_type": "BadgeType", "value": "', cert.badgeType, '"}, ',
                '{"trait_type": "MintDate", "value": "', cert.mintDate, '"}',
            ']}'
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(json)));
    }

    function generateSVG(
        uint256 tokenId,
        string memory name,
        string memory badge,
        string memory date
    ) public pure returns (string memory) {
        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">',
                '<defs>',
                '<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#0F172A"/>',
                '<stop offset="50%" stop-color="#1E293B"/>',
                '<stop offset="100%" stop-color="#0F172A"/>',
                '</linearGradient>',
                '<linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" stop-color="#3B82F6"/>',
                '<stop offset="50%" stop-color="#8B5CF6"/>',
                '<stop offset="100%" stop-color="#EC4899"/>',
                '</linearGradient>',
                '<linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">',
                '<stop offset="0%" stop-color="#60A5FA"/>',
                '<stop offset="50%" stop-color="#A78BFA"/>',
                '<stop offset="100%" stop-color="#F472B6"/>',
                '</linearGradient>',
                '<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">',
                '<feGaussianBlur stdDeviation="15" result="blur"/>',
                '<feComposite in="SourceGraphic" in2="blur" operator="over"/>',
                '</filter>',
                '</defs>',
                '<rect x="15" y="15" width="770" height="570" rx="20" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="4"/>',
                '<circle cx="400" cy="300" r="250" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="5,5" opacity="0.3"/>',
                '<circle cx="400" cy="300" r="180" fill="none" stroke="#475569" stroke-width="2" opacity="0.2"/>',
                '<path d="M 250,50 L 550,50" fill="none" stroke="url(#borderGrad)" stroke-width="2" opacity="0.8"/>',
                '<rect x="370" y="45" width="60" height="10" rx="5" fill="#3B82F6" opacity="0.8"/>',
                '<text x="400" y="110" font-family="\'Outfit\', \'Inter\', sans-serif" font-weight="900" font-size="28" fill="url(#textGrad)" text-anchor="middle" letter-spacing="4">CERTMINT ACHIEVEMENT</text>',
                '<text x="400" y="140" font-family="\'Inter\', sans-serif" font-weight="400" font-size="14" fill="#94A3B8" text-anchor="middle" letter-spacing="2">ON-CHAIN VERIFIED CERTIFICATE</text>',
                '<text x="400" y="210" font-family="\'Inter\', sans-serif" font-weight="300" font-size="16" fill="#64748B" text-anchor="middle">This is proudly presented to</text>',
                '<text x="400" y="270" font-family="\'Outfit\', \'Inter\', sans-serif" font-weight="800" font-size="40" fill="#FFFFFF" text-anchor="middle" filter="url(#glow)">', name, '</text>',
                '<path d="M 300,295 L 500,295" fill="none" stroke="#475569" stroke-width="1"/>',
                '<text x="400" y="335" font-family="\'Inter\', sans-serif" font-weight="300" font-size="16" fill="#64748B" text-anchor="middle">for successfully completing the milestone of</text>',
                '<g transform="translate(400, 390)">',
                '<rect x="-150" y="-25" width="300" height="50" rx="25" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="1.5"/>',
                '<text x="0" y="7" font-family="\'Outfit\', \'Inter\', sans-serif" font-weight="700" font-size="18" fill="#C084FC" text-anchor="middle" letter-spacing="1">', badge, '</text>',
                '</g>',
                '<text x="100" y="520" font-family="\'Courier New\', monospace" font-size="12" fill="#64748B" text-anchor="start">SERIAL: #000', tokenId.toString(), '</text>',
                '<text x="700" y="520" font-family="\'Courier New\', monospace" font-size="12" fill="#64748B" text-anchor="end">DATE: ', date, '</text>',
                '<text x="400" y="550" font-family="\'Inter\', sans-serif" font-size="10" fill="#475569" text-anchor="middle" letter-spacing="1">SECURED BY UNIVERSAL GATEWAY FRAMEWORK</text>',
                '</svg>'
            )
        );
    }
}
