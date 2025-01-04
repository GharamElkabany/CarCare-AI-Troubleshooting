import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminFaq.module.css';

export default function AdminFaq() {
  const [faqData, setFaqData] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editId, setEditId] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = () => {
    axios.get('http://localhost:5000/faqs')
      .then((response) => {
        setFaqData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
      });
  };

  const addFaq = () => {
    axios.post('http://localhost:5000/faqs', { question: newQuestion, answer: newAnswer })
      .then(() => {
        fetchFaqs();
        setNewQuestion('');
        setNewAnswer('');
      })
      .catch((error) => {
        console.error("Error adding FAQ:", error);
      });
  };

  const deleteFaq = (id) => {
    axios.delete(`http://localhost:5000/faqs/${id}`)
      .then(() => fetchFaqs())
      .catch((error) => {
        console.error("Error deleting FAQ:", error);
      });
  };

  const startEdit = (faq) => {
    setEditId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const updateFaq = () => {
    axios.put(`http://localhost:5000/faqs/${editId}`, { question: editQuestion, answer: editAnswer })
      .then(() => {
        fetchFaqs();
        setEditId(null);
        setEditQuestion('');
        setEditAnswer('');
      })
      .catch((error) => {
        console.error('Error updating FAQ:', error);
      });
  };

  return <>
    <div className={styles.adminFaqContainer}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>Admin - Manage FAQs</h2>
        <div className={styles.inputContainer}>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <input
            className={styles.inputField}
            type="text"
            placeholder="Answer"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
          <button className={styles.addFaqButton} onClick={addFaq}>Add FAQ</button>
        </div>
        <div className={styles.faqList}>
          {faqData.map((faq) => (
            <div className={styles.faqItem} key={faq.id}>
              {editId === faq.id ? (
                <div className={styles.editContainer}>
                  <input
                    className={styles.inputField}
                    type="text"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                  />
                  <input
                    className={styles.inputField}
                    type="text"
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                  />
                  <div className={styles.buttonGroup}>
                    <div>
                      <button className={styles.addButton} onClick={updateFaq}>Update</button>
                    </div>
                    <button className={styles.deleteButton} onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p><strong>{faq.question}</strong></p>
                    <p>{faq.answer}</p>
                  </div>
                  <div>
                    <button
                      className={styles.editButton}
                      onClick={() => startEdit(faq)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => deleteFaq(faq.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
}
