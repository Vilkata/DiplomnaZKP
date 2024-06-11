const Verifier = artifacts.require("Verifier");
const PrivateTransaction = artifacts.require("PrivateTransaction");

contract("PrivateTransaction", accounts => {
    let verifierInstance;
    let privateTransactionInstance;

    before(async () => {
        verifierInstance = await Verifier.deployed();
        privateTransactionInstance = await PrivateTransaction.deployed(verifierInstance.address);
    });

    it("should deploy the Verifier contract", async () => {
        assert(verifierInstance.address !== "");
    });

    it("should deploy the PrivateTransaction contract", async () => {
        assert(privateTransactionInstance.address !== "");
    });

    it("should perform a private transaction with valid proof", async () => {
        const proof = {
            a: [
                "0x0e64930022e04ced60a5bc19af7e2d28ee3e3d751d0758c0f9b5a38aeb923421",
                "0x273966a83726621d75197a90a575ea8e178ab81c6f38f4863ed8e2419b73e45c"
            ],
            b: [
                [
                    "0x0b4a57dba2dbe02d5322d2d9ed56375d760c8084acef52cdcb59c81ff957dee5",
                    "0x0a64161d619965b6e4a06ffd40f6b6705d42cde19047fa53b4bb0a7bded8cf6d"
                ],
                [
                    "0x0884b1939f096c8b49e8f8f591837ff2cda6f3ba88a2ec0a23d2d27eeea40270",
                    "0x2a0e717f52320a1dfe9f661856b40006d936d33b591c6eeda6110271ac555a97"
                ]
            ],
            c: [
                "0x008e6e62e8cea2c8afcc98df04e7b9985e4687034430d66a5734d42f4e372731",
                "0x2ba952e6ab2396144dc72c72c9bff778e18e7fff7e2add745666c58efef0f4d0"
            ]
        };
        const input = ["0x0000000000000000000000000000000000000000000000000000000000000009"];

        const proofStruct = {
            a: [web3.utils.toBN(proof.a[0]), web3.utils.toBN(proof.a[1])],
            b: [
                [web3.utils.toBN(proof.b[0][0]), web3.utils.toBN(proof.b[0][1])],
                [web3.utils.toBN(proof.b[1][0]), web3.utils.toBN(proof.b[1][1])]
            ],
            c: [web3.utils.toBN(proof.c[0]), web3.utils.toBN(proof.c[1])]
        };
        const inputStruct = [web3.utils.toBN(input[0])];

        const result = await privateTransactionInstance.performPrivateTransaction(
            proofStruct.a,
            proofStruct.b,
            proofStruct.c,
            inputStruct,
            { from: accounts[0] }
        );

        assert(result, "Proof verification failed");
    });

    it("should fail to perform a private transaction with invalid proof", async () => {
        const proof = {
            a: [
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                "0x0000000000000000000000000000000000000000000000000000000000000000"
            ],
            b: [
                [
                    "0x0000000000000000000000000000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000000000000000000000000000"
                ],
                [
                    "0x0000000000000000000000000000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000000000000000000000000000"
                ]
            ],
            c: [
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                "0x0000000000000000000000000000000000000000000000000000000000000000"
            ]
        };
        const input = ["0x0000000000000000000000000000000000000000000000000000000000000000"];

        const proofStruct = {
            a: [web3.utils.toBN(proof.a[0]), web3.utils.toBN(proof.a[1])],
            b: [
                [web3.utils.toBN(proof.b[0][0]), web3.utils.toBN(proof.b[0][1])],
                [web3.utils.toBN(proof.b[1][0]), web3.utils.toBN(proof.b[1][1])]
            ],
            c: [web3.utils.toBN(proof.c[0]), web3.utils.toBN(proof.c[1])]
        };
        const inputStruct = [web3.utils.toBN(input[0])];

        try {
            await privateTransactionInstance.performPrivateTransaction(
                proofStruct.a,
                proofStruct.b,
                proofStruct.c,
                inputStruct,
                { from: accounts[0] }
            );
            assert.fail("Expected 'Invalid proof' error but transaction succeeded");
        } catch (error) {
            assert(
                error.message.includes("Invalid proof"),
                `Expected 'Invalid proof' error but got ${error.message}`
            );
        }
    });
});
