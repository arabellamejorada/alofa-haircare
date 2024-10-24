

const OrderHistory = () => {
  const orders = [
    { date: '5/2/24', orderId: 3, amount: '₱1000.00', status: 'Paid' },
    { date: '4/29/24', orderId: 2, amount: '₱250.00', status: 'Paid' },
    { date: '4/10/24', orderId: 1, amount: '₱580.00', status: 'Paid' }
  ];

  return (
    <div className="w-3/4 bg-white rounded-lg shadow-md p-6 m-4" style={{ borderRadius: '25px' }}>
      <h2 className="text-pink-500 text-3xl font-bold mb-4">Order History</h2>
      <div className="grid grid-cols-5 text-pink-500 font-semibold mb-4">
        <span>Date</span>
        <span>Order ID</span>
        <span>Amount</span>
        <span>Status</span>
        <span></span>
      </div>
      {orders.map((order, index) => (
        <div key={index} className="grid grid-cols-5 items-center text-gray-700 mb-2">
          <span>{order.date}</span>
          <span>{order.orderId}</span>
          <span>{order.amount}</span>
          <span>{order.status}</span>
          <button className="bg-pink-500 text-white rounded-full px-3 py-1 text-xs font-bold ml-auto shadow-md">
            VIEW ORDER
          </button>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
