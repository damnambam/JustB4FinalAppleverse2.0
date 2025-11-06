import React from "react";
import "../styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-wrapper">
      {/* Hero Section */}
      <section className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We’d love to hear from you. Reach out to our team anytime.</p>
      </section>

      {/* Contact Cards */}
      <section className="contact-info">
        <div className="info-card">
          <div className="icon-circle phone">
            <i className="fas fa-phone-alt"></i>
          </div>
          <h3>Call Us</h3>
          <p>+1 (420) 690-1738</p>
        </div>

        <div className="info-card">
          <div className="icon-circle email">
            <i className="fas fa-envelope"></i>
          </div>
          <h3>Email Us</h3>
          <p>help.appleverse@gmail.com</p>
        </div>

        <div className="info-card">
          <div className="icon-circle time">
            <i className="fas fa-clock"></i>
          </div>
          <h3>Working Hours</h3>
          <p>Mon – Fri<br />9:00 AM – 6:00 PM</p>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <p>Passionate individuals driving the AppleVerse mission.</p>

        <div className="team-container">
          <div className="team-member">
            <div className="avatar orange">NM</div>
            <div className="member-info">
              <h4>Namratha Muraleedharan</h4>
              <p>Professional Apple Skin Peeler</p>
            </div>
          </div>

          <div className="team-member">
            <div className="avatar yellow">SS</div>
            <div className="member-info">
              <h4>Sana Sehgal</h4>
              <p>Official Apple Eater</p>
            </div>
          </div>

          <div className="team-member">
            <div className="avatar green">J</div>
            <div className="member-info">
              <h4>Jayanth</h4>
              <p>Head of Fruit Bowls</p>
            </div>
          </div>

          <div className="team-member">
            <div className="avatar red">SK</div>
            <div className="member-info">
              <h4>Saima Khatoon</h4>
              <p>Chief of Crispy Apples</p>
            </div>
          </div>
        </div>
      </section>

      {/* Find Us */}
      <section className="find-us">
        <h2>Find Us</h2>
        <p>Visit our research center at 300 Ouellette Ave, Windsor, ON N9A 1A5</p>

        <div className="map-wrapper">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2926.285999639731!2d-83.03788962337493!3d42.3163473711978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8829598c87e95d8d%3A0x7e861a6d4f1a36b8!2s300%20Ouellette%20Ave%2C%20Windsor%2C%20ON%20N9A%201A5!5e0!3m2!1sen!2sca!4v1698888888888!5m2!1sen!2sca"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;
