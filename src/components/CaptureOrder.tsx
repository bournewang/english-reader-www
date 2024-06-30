import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureOrder } from '~api/order';

const CaptureOrder: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get('token');

    if (orderId) {
      captureOrder(orderId);
    }
  }, [location]);

  return (
    <div>
      Processing payment...
    </div>
  );
};

export default CaptureOrder;
