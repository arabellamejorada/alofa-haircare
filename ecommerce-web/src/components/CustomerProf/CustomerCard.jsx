

const CustomerCard = () => {
  const customerInfo = {
    name: 'Cassey Gempesaw',
    email: 'catgempesaw@gmail.com',
    contact: '09295290355'
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6" style={{ borderRadius: '25px' }}>
      <h2 className="text-pink-500 text-3xl font-bold mb-4">Welcome, <span className="text-pink-600">{customerInfo.name}</span>.</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-pink-200 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-pink-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        </div>
      </div>
      <div className="text-left">
        <h3 className="text-pink-500 text-lg font-semibold mb-2">Profile:</h3>
        <p className="text-gray-700 mb-1">
          <strong>Name:</strong> {customerInfo.name}
        </p>
        <p className="text-gray-700 mb-1">
          <strong>Email:</strong> {customerInfo.email}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Contact:</strong> {customerInfo.contact}
        </p>
      </div>
      <div className="flex justify-between text-pink-500 font-semibold">
        <button className="hover:underline">Edit Profile</button>
        <button className="hover:underline">Log Out</button>
      </div>
    </div>
  );
};

export default CustomerCard;
