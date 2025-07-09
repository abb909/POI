import React, { useState } from 'react';

const Contact = () => {
  const [message, setMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState('');

  const contacts = [
    { id: 'IBRAHIM', name: 'IBRAHIM', phone: '+212663715065' },
    { id: 'RACHID', name: 'RACHID', phone: '+212662071925' },
    { id: 'HICHAM', name: 'HICHAM', phone: '+212666043724' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedContact) {
      alert("Veuillez saisir le message et choisir un destinataire.");
      return;
    }

    const contact = contacts.find(c => c.id === selectedContact);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${contact.phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = () => {
    if (!selectedContact) {
      alert("Veuillez choisir un destinataire à appeler.");
      return;
    }

    const contact = contacts.find(c => c.id === selectedContact);
    window.location.href = `tel:${contact.phone}`;
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1>CONTACTEZ-NOUS</h1>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            placeholder="Écrivez votre message ici..."
            required
            className="message-textarea"
          />

          <div className="contact-options">
            {contacts.map(contact => (
              <div key={contact.id} className="radio-item">
                <input
                  type="radio"
                  id={contact.id}
                  name="contact"
                  value={contact.id}
                  checked={selectedContact === contact.id}
                  onChange={(e) => setSelectedContact(e.target.value)}
                />
                <label htmlFor={contact.id}>{contact.name}</label>
              </div>
            ))}
          </div>

          <button type="submit" className="whatsapp-btn">
            Envoyer à WhatsApp
          </button>
        </form>

        <button onClick={handleCall} className="call-btn">
          Appeler
        </button>
      </div>
    </div>
  );
};

export default Contact;