import { FaUserCircle } from 'react-icons/fa';

const CustomerProfileCard = () => {
  const customerInfo = {
    firstname: 'Cassey',
    lastname: 'Gempesaw',
    email: 'catgempesaw@gmail.com',
    contact: '09295290355'
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-md p-6">
      <h2 className="text-pink-500 text-3xl font-bold mb-4">Welcome, <span className="text-pink-600">{customerInfo.firstname}</span>.</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="mt-10 w-24 h-24 rounded-full bg-pink-200 flex items-center justify-center">
          <FaUserCircle className="h-40 w-40 text-alofa-pink" />
        </div>
      </div>
      <div className="text-left">
        <h3 className="mt-15 text-pink-500 text-lg font-semibold mb-2 gradient-heading">Profile</h3>
        <table className="text-gray-700 w-full">
          <tbody>
            <tr className="mb-1">
              <td className="font-semibold pr-4">Name</td>
              <td>{customerInfo.firstname} {customerInfo.lastname}</td>
            </tr>
            <tr className="mb-1">
              <td className="font-semibold pr-4">Email</td>
              <td>{customerInfo.email}</td>
            </tr>
            <tr className="mb-4">
              <td className="font-semibold pr-4">Contact</td>
              <td>{customerInfo.contact}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-between text-pink-500 font-semibold">
        <button className="hover:underline">Edit Profile</button>
        <button className="hover:underline">Log Out</button>
      </div>
    </div>
  );
};

export default CustomerProfileCard;
