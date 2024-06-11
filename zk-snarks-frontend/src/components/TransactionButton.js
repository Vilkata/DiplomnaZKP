import React from 'react';
import { Button } from 'react-bootstrap';

const TransactionButton = ({ handleTransaction, proofLoading }) => (
  <Button onClick={handleTransaction} variant="primary" size="lg" disabled={proofLoading}>
    {proofLoading ? 'Проверка на доказателство...' : 'Извършете частна транзакция'}
  </Button>
);

export default TransactionButton;
