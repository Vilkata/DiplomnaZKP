// src/components/TransactionHistory.js
import React from 'react';
import { Table } from 'react-bootstrap';
import Web3 from 'web3';

const TransactionHistory = ({ transactions }) => (
  <div className="table-container">
    <h2>История на транзакциите</h2>
    <div className="table-responsive">
      <Table striped bordered hover className="table">
        <thead>
          <tr>
            <th>Хеш на транзакцията</th>
            <th>Номер на блока</th>
            <th>Използвана газ</th>
            <th>От</th>
            <th>До</th>
            <th>Стойност (ETH)</th>
            <th>Цена на газа (Gwei)</th>
            <th>Времеви маркер</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td>{tx.hash}</td>
              <td>{tx.blockNumber}</td>
              <td>{tx.gasUsed}</td>
              <td>{tx.from}</td>
              <td>{tx.to}</td>
              <td>{tx.value}</td>
              <td>{tx.gasPrice}</td>
              <td>{tx.timestamp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </div>
);

export default TransactionHistory;
