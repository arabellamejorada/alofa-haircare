import { useState, useEffect } from 'react';
import FAQHeader from "../../public/images/faq-header.png";
import Accordion from '../components/FAQAccordion';
import { getAllFaqs } from '../api/faqs';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      const response = await getAllFaqs(); // Use the getAllFaqs function from faqs.js
      if (response.error) {
        console.error('Error fetching FAQs:', response.error);
      } else {
        setFaqs(response);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <div className="pt-16 bg-[#FFFAF0] min-h-screen shadow-md">
      <div className="relative w-screen left-1/2 right-1/2 transform -translate-x-1/2">
        <img 
          src={FAQHeader}
          alt="FAQ Header" 
          className="w-full h-auto block"
        />
      </div>

      <div className="p-14 flex flex-col items-center">
        <div className="max-w-6xl w-full h-auto text-center mb-16">
          <h1 className="text-8xl font-bold font-heading gradient-heading line-clamp-5 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-500 mt-2">Here are some of the most common questions we get from our customers. If you can&apos;t find the answer you&apos;re looking for, feel free to contact us.</p>
        </div>

        <div className="w-full max-w-3xl">
          {faqs.map((faq) => (
            <Accordion key={faq.id} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;