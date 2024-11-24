import React from 'react';
import styles from './About.module.css';

export default function About() {
  return <>

    <div className={styles.aboutContainer}>
      <div className={styles.contentWrapper}>
        {/* Left Section: Image */}
        <div className={styles.imageContainer}></div>
        
        {/* Right Section: Text */}
        <div className={styles.textContainer}>
          <h2 className={styles.title}>About Us</h2>
          <p className={styles.paragraph}>
            CarCare System is dedicated to empowering car owners with the 
            CarCare DIY Troubleshooting Solution (CCDTS), a comprehensive tool 
            designed to diagnose and resolve dashboard warning light issues independently.
          </p>
          <p className={styles.paragraph}>
            Our mission is to provide users with an intuitive and reliable system 
            that reduces the reliance on professional services, minimizes inconvenience, 
            and saves costs. Through innovative technology and a user-friendly interface, 
            CCDTS offers step-by-step guidance to help car owners maintain their vehicles 
            safely and efficiently.
          </p>
          <p className={styles.paragraph}>
            At CarCare System, we are committed to enhancing the overall car maintenance 
            experience, ensuring every user can confidently address their vehicle's needs.
          </p>
        </div>
      </div>
    </div>
    
  </>
}
