import { useState } from 'react';
import { FaChevronCircleRight } from "react-icons/fa";
import PropTypes from 'prop-types';

const Accordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-4 shadow-md transition-all ease-in-out duration-300">
      <div
        onClick={toggleAccordion}
        className="flex justify-between items-center cursor-pointer"
      >
        <h3 className="font-semibold text-alofa-pink text-lg">{question}</h3>
        <FaChevronCircleRight
          className={`text-alofa-pink text-md transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        />
      </div>
      {isOpen && (
        <div className="mt-4 mb-3 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
};

Accordion.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

export default Accordion;