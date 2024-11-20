import { useState, useEffect } from "react";
import FAQHeader from "../../public/images/faq-header.png";
import Accordion from "../components/FAQAccordion";
import { getAllFaqs } from "../api/faqs";
import { ClipLoader } from "react-spinners";

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true); // Start loading
        const response = await getAllFaqs();
        if (response.error) {
          console.error("Error fetching FAQs:", response.error);
        } else {
          setFaqs(response);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFaqs();
  }, []);

  return (
    <div className="relative">
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 pointer-events-none">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}

      <div
        className={`pt-16 bg-[#FFFAF0] min-h-screen shadow-md transition-opacity duration-300 ${
          loading ? "opacity-50" : ""
        }`}
      >
        <div className="relative w-screen left-1/2 right-1/2 transform -translate-x-1/2">
          <img
            src={FAQHeader}
            alt="FAQ Header"
            className="w-full h-auto block"
          />
        </div>

        <div className="p-10 flex flex-col items-center">
          <div className="max-w-6xl w-full h-auto text-center mb-16">
            <h1
              className="text-8xl font-bold font-heading gradient-heading mb-1"
              style={{ lineHeight: "1.2" }}
            >
              Frequently Asked Questions
            </h1>
            <p className="text-gray-500 mt-2">
              Here are some of the most common questions we get from our
              customers. If you can&apos;t find the answer you&apos;re looking
              for, feel free to contact us.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <Accordion
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))
            ) : (
              !loading && (
                <div className="text-center text-gray-500">
                  No FAQs available at the moment.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
