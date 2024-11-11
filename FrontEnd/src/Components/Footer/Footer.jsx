import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return <>

<footer className={`bg-dark text-white py-4 ${styles.footer}`}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 text-center mb-3">
            <h5>Privacy Policy</h5>
            <p>
              At CarCare, we value your privacy. Our Privacy Policy outlines how we collect, use, and protect your personal information.
            </p>
          </div>
          <div className="col-md-4 text-center mb-3">
            <h5>Terms of Service</h5>
            <p>
              By using CarCare, you agree to abide by our Terms of Service. These terms govern your relationship with the platform, outlining rights, responsibilities, and acceptable use.
            </p>
          </div>
          <div className="col-md-4 text-center mb-3">
            <h5>Connect With Us</h5>
            <p>
              Stay updated with CarCare DIY Troubleshooting System on social media. Follow us to stay informed about new features, troubleshooting tips, and more!
            </p>
            <div className="d-flex justify-content-center">
              <i className="fab fa-facebook mx-2"></i>
              <i className="fab fa-twitter mx-2"></i>
              <i className="fab fa-instagram mx-2"></i>
              <i className="fab fa-tiktok mx-2"></i>
              <i className="fab fa-linkedin mx-2"></i>
              <i className="fab fa-youtube mx-2"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
    
  </>
}
