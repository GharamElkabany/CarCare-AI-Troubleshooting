import React, { useState, useEffect } from 'react';
import styles from './Faq.module.css';
import axios from 'axios';

export default function Faq() {
  const [faqData, setFaqData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    // Fetch FAQs from the server
    axios.get('http://localhost:5000/faqs')
      .then((response) => {
        setFaqData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
      });
  }, []);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return <>

<div className={styles.aboutContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.textContainer}>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <h5>Here are some questions that may help you out</h5>
          <div className={styles.faqList}>
            {faqData.map((item, index) => (
              <div
                key={item.id}
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
        <div className={styles.imageContainer}></div>
      </div>
    </div>
    
  </>
}
