import React from 'react';
import { Alert } from 'react-bootstrap';

const Notification = ({ notification }) => (
  notification.show && (
    <Alert className={`notification notification-${notification.variant}`} variant={notification.variant}>
      {notification.message}
    </Alert>
  )
);

export default Notification;
