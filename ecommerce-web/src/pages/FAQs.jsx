import FAQHeader from "../../public/images/faq-header.png"

const FAQs = () => {
  return (
    <div className="pt-16 bg-[#FFFAF0] min-h-screen shadow-md">
      <div className="relative w-screen left-1/2 right-1/2 transform -translate-x-1/2">
        <img 
          src={FAQHeader}
          alt="FAQ Header" 
          className="w-full h-auto block"
        />
      </div>

      <div className="p-16 flex justify-center">
        <div className="max-w-6xl w-full">
          <h1 className="text-8xl font-bold text-center font-heading gradient-heading line-clamp-5 mb-4">Frequently Asked Questions</h1>
          <p className="text-center text-gray-500 mt-2">Here are some of the most common questions we get from our customers. If you can&apos;t find the answer you&apos;re looking for, feel free to contact us.</p>
        </div>

        <div className="mt-16">
          
        </div>
      </div>
    </div>
    
  )
}

export default FAQs