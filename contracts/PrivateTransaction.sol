// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./verifier.sol";

contract PrivateTransaction {
    Verifier verifier;

    constructor(address _verifierAddress) {
        verifier = Verifier(_verifierAddress);
    }

    function performPrivateTransaction(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint256[1] memory input
    ) public view returns (bool) { // Added 'view' keyword here
        Verifier.Proof memory proofStruct = Verifier.Proof({
            a: Pairing.G1Point(a[0], a[1]),
            b: Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]),
            c: Pairing.G1Point(c[0], c[1])
        });

        require(verifier.verifyTx(proofStruct, input), "Invalid proof");
        // Implement your private transaction logic here
        return true;
    }
}
