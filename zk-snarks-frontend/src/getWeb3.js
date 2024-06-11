// src/getWeb3.js
import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        resolve(new Web3(window.web3.currentProvider));
      } else {
        const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
        resolve(new Web3(provider));
      }
    });
  });

export default getWeb3;
