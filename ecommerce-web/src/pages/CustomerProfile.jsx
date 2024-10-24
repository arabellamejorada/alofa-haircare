import CustomerCard from '../components/CustomerProf/CustomerCard.jsx';
import OrderHistory from '../components/CustomerProf/OrderHistory.jsx';

const CustomerProfile = () => {
  return (
    <div className="pt-20 bg-[url('../../public/images/body-bg.png')] bg-cover bg-center h-screen p-8 flex justify-center">

        <div className="w-full max-w-5xl flex space-x-4">
            <CustomerCard className="w-1/2" />
            <OrderHistory className="w-1/2" />
        </div>
    </div>
  )
}

export default CustomerProfile;
