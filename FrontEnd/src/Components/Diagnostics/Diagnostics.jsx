import React from 'react';
import styles from './Diagnostics.module.css';

export default function Diagnostics() {
  return <>
    <div className={styles.AiBg}>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <span className={styles.title}>
            Chat with
            <span className={styles.space}></span>
            <span className={styles.title2}>
              AI Diagnostics
            </span>
          </span>
          <br />
          <span className={styles.subtitle}>
            Simply ask your AI chatbot assistance to generate
          </span>
        </div>
        <iframe
          src="https://denser.ai/u/embed/27f5f092-361b-412f-a679-258128104943"
          title="AI Diagnostics Chatbot"
        ></iframe>
      </div>
    </div>
  </>
}
