const Verifier = artifacts.require("Verifier");
const PrivateTransaction = artifacts.require("PrivateTransaction");

module.exports = async function (deployer) {
  await deployer.deploy(Verifier);
  const verifierInstance = await Verifier.deployed();
  await deployer.deploy(PrivateTransaction, verifierInstance.address);
};
