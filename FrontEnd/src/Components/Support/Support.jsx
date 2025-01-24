import React from "react";
import styles from "./Support.module.css";
import AllianzLogo from "../../assets/images/Allianz.png";
import EtiqaLogo from "../../assets/images/etiqa.png";
import RHBLogo from "../../assets/images/RHB.png";

export default function Support() {
  const companies = [
    {
      logo: EtiqaLogo,
      details: [
        { label: "General Enquiry:", value: "1-300-13-8888" },
        { label: "Auto assist:", value: "1-800-88-6491" },
        { label: "Healthcare:", value: "1-800-88-9998" },
      ],
    },
    {
      logo: AllianzLogo,
      details: [
        { label: "Local call:", value: "1-300-22-5542" },
        {
          label: "Land line:",
          value: "603 2264 0700",
        },
      ],
    },
    {
      logo: RHBLogo,
      details: [
        { label: "Hotline:", value: "1300 880 881" },
        { label: "WhatsApp:", value: "+6012 932 4854" },
      ],
    },
  ];

  return (
    <>
      <div className={styles.supportContainer}>
        <h2 className={styles.title}>Support - Car Insurance Contacts</h2>
        <div className={styles.cardWrapper}>
          {companies.map((company, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <img
                    src={company.logo}
                    alt="Company Logo"
                    className={styles.logo}
                  />
                </div>
                <div className={styles.cardBack}>
                  {company.details.map((detail, i) => (
                    <p key={i} className={styles.companyDetails}>
                      <span className={styles.label}>{detail.label}</span>
                      <br />
                      <span className={styles.value}>{detail.value}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
