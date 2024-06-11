import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Container, Card } from 'react-bootstrap';
import PrivateTransaction from './contracts/PrivateTransaction.json';
import './App.css';
import AccountInfo from './components/AccountInfo';
import TransactionButton from './components/TransactionButton';
import Notification from './components/Notification';
import TransactionHistory from './components/TransactionHistory';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'info' });
  const [transactions, setTransactions] = useState([]);
  const [proofLoading, setProofLoading] = useState(false);

  useEffect(() => {
    async function loadBlockchainData() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = PrivateTransaction.networks[networkId];
          if (deployedNetwork) {
            const instance = new web3.eth.Contract(
              PrivateTransaction.abi,
              deployedNetwork.address
            );
            setContract(instance);
          } else {
            console.error('Смарт контрактът не е внедрен в откритата мрежа.');
          }
        } catch (error) {
          console.error('Потребителят отказа достъп до акаунта или възникна грешка:', error);
        }
      } else {
        console.log('Открит е браузър, който не поддържа Ethereum. Моля, помислете за използване на MetaMask!');
      }
    }
    loadBlockchainData();
  }, []);

  const handleTransaction = async () => {
    if (contract) {
      setProofLoading(true);
      const proof = {
        a: ["0x0e64930022e04ced60a5bc19af7e2d28ee3e3d751d0758c0f9b5a38aeb923421", "0x273966a83726621d75197a90a575ea8e178ab81c6f38f4863ed8e2419b73e45c"],
        b: [["0x0b4a57dba2dbe02d5322d2d9ed56375d760c8084acef52cdcb59c81ff957dee5", "0x0a64161d619965b6e4a06ffd40f6b6705d42cde19047fa53b4bb0a7bded8cf6d"], ["0x0884b1939f096c8b49e8f8f591837ff2cda6f3ba88a2ec0a23d2d27eeea40270", "0x2a0e717f52320a1dfe9f661856b40006d936d33b591c6eeda6110271ac555a97"]],
        c: ["0x008e6e62e8cea2c8afcc98df04e7b9985e4687034430d66a5734d42f4e372731", "0x2ba952e6ab2396144dc72c72c9bff778e18e7fff7e2add745666c58efef0f4d0"]
      };
      const input = ["0x0000000000000000000000000000000000000000000000000000000000000009"];
      try {
        const receipt = await contract.methods.performPrivateTransaction(proof.a, proof.b, proof.c, input).send({ from: account });
        console.log('Transaction receipt:', receipt);
        setNotification({ show: true, message: 'Транзакцията е успешна!', variant: 'success' });
        const newTransaction = {
          hash: receipt.transactionHash,
          blockNumber: receipt.blockNumber.toString(),
          gasUsed: receipt.gasUsed.toString(),
          from: receipt.from,
          to: receipt.to,
          value: receipt.value ? Web3.utils.fromWei(receipt.value.toString(), 'ether') : '0',
          gasPrice: Web3.utils.fromWei(receipt.effectiveGasPrice.toString(), 'gwei'),
          timestamp: new Date()
        };
        setTransactions([...transactions, newTransaction]);
      } catch (error) {
        setNotification({ show: true, message: 'Транзакцията не е успешна!', variant: 'danger' });
        console.error('Транзакцията не е успешна', error);
      } finally {
        setProofLoading(false);
      }
    }
  };

  return (
    <Container className="container">
      <h1>zk-SNARK частни транзакции</h1>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Какво са zk-SNARK?</Card.Title>
          <Card.Text>
            Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zk-SNARK) позволяват на една страна да докаже на друга, че дадено твърдение е вярно, без да разкрива никаква информация извън валидността на самото твърдение. Това приложение демонстрира използването на zk-SNARK за извършване на частни транзакции на блокчейна Ethereum.
          </Card.Text>
        </Card.Body>
      </Card>
      <AccountInfo account={account} />
      <TransactionButton handleTransaction={handleTransaction} proofLoading={proofLoading} />
      <Notification notification={notification} />
      <TransactionHistory transactions={transactions} />
    </Container>
  );
}

export default App;
