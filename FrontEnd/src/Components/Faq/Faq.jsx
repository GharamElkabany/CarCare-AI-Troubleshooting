import React, { useState } from 'react';
import styles from './Faq.module.css';

export default function Faq() {

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How does CarCare DIY Troubleshooting Solution (CCDTS) help me diagnose car issues?",
      answer: "CCDTS utilizes a robust diagnostic system that guides users through a series of questions and tests to pinpoint common automotive problems. By analyzing symptoms and providing step-by-step instructions, CCDTS assists users in identifying issues related to various components such as engine, ABS, airbag, or other warning light."
    },
    {
      question: "Can CCDTS be used by individuals with limited automotive knowledge?",
      answer: "Yes, CCDTS is designed to be user-friendly and accessible to individuals with varying levels of automotive expertise. The interface provides clear instructions and explanations, making it easy for even beginners to follow. Additionally, CCDTS offers detailed explanations of automotive terminology and concepts to help users understand the diagnostic process better."
    },
    {
      question: "What specific automotive problems does CCDTS specialize in resolving?",
      answer: "CCDTS specializes in helping users diagnose and resolve dashboard warning light issues in their vehicles. Whether it’s an engine, ABS, airbag, or other warning light, CCDTS provides comprehensive guidance to identify the underlying problem and offers step-by-step solutions to address it effectively. With CCDTS, users can tackle dashboard warning light concerns confidently, ensuring safer and more reliable vehicle operation."
    }
  ];

  return <>

    <div className={styles.aboutContainer}>
      <div className={styles.contentWrapper}>
        {/* Left Section: Text */}
        <div className={styles.textContainer}>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <h5>Here are some questions that may help you out</h5>
          <div className={styles.faqList}>
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
              >
                <div
                  className={styles.faqQuestion}
                  onClick={() => toggleAnswer(index)}
                >
                  {item.question}
                  <span className={styles.arrow}>
                    {activeIndex === index ? '▲' : '▼'}
                  </span>
                </div>
                {activeIndex === index && (
                  <div className={styles.faqAnswer}>{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Section: Image*/}
        <div className={styles.imageContainer}></div>
      </div>
    </div>
    
  </>
}
