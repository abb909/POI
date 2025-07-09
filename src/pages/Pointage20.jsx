import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';

const Pointage20 = () => {
  const [groupData, setGroupData] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [memberHours, setMemberHours] = useState({});
  const [todayDate, setTodayDate] = useState(new Date().toISOString().split('T')[0]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorker, setNewWorker] = useState({
    matricule: '',
    nombre: '',
    equipe: '',
    hours: '',
    finca: 'FINCA 20'
  });

  const h12 = ["4116", "456", "1648", "4029"];
  const h9 = ["7416", "12419", "19939", "26730", "27399", "30609", "37079", "40183", "38774", "41294", "44943", "28679", "58451", "34372"];
  const h10 = ["4236", "7694", "13536", "15062", "23825", "28541", "29730", "45894", "48337", "41371"];
  const fix = ["69", "1829", "4263", "12488", "14829", "21477", "27496", "28055", "57281", "52206", "32781", "33567", "36435", "36688", "40182", "42195", "21995", "4954", "43861", "27495", "57743", "27893", "3655", "3216", "6035", "4935", "57843", "23133", "24375", "22423", "58806", "31445", "55902", "37541", "46467"];

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbx2oZJcaSD3IGt316_opGvsuGjXmACOMlqMjOMOtQRqvNcD2vB2sNHTMQ6Y1SSu1A78NA/exec");
      const data = await response.json();
      setGroupData(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
    setSelectedMembers(new Set());
    setMemberHours({});
  };

  const handleMemberSelect = (code) => {
    const newSelectedMembers = new Set(selectedMembers);
    const newMemberHours = { ...memberHours };

    if (newSelectedMembers.has(code)) {
      newSelectedMembers.delete(code);
      newMemberHours[code] = 0;
    } else {
      newSelectedMembers.add(code);
      let hours = 8;
      if (h12.includes(code)) hours = 12;
      else if (h9.includes(code)) hours = 9;
      else if (h10.includes(code)) hours = 10;
      else if (fix.includes(code)) hours = 8;
      newMemberHours[code] = hours;
    }

    setSelectedMembers(newSelectedMembers);
    setMemberHours(newMemberHours);
  };

  const handleHoursChange = (code, hours) => {
    setMemberHours(prev => ({
      ...prev,
      [code]: hours
    }));
  };

  const toggleSelectAll = () => {
    const members = groupData[selectedGroup] || [];
    if (selectedMembers.size === members.length) {
      setSelectedMembers(new Set());
      setMemberHours({});
    } else {
      const newSelectedMembers = new Set();
      const newMemberHours = {};
      
      members.forEach(member => {
        newSelectedMembers.add(member.code);
        let hours = 8;
        if (h12.includes(member.code)) hours = 12;
        else if (h9.includes(member.code)) hours = 9;
        else if (h10.includes(member.code)) hours = 10;
        else if (fix.includes(member.code)) hours = 8;
        newMemberHours[member.code] = hours;
      });

      setSelectedMembers(newSelectedMembers);
      setMemberHours(newMemberHours);
    }
  };

  const handleAddWorker = async () => {
    try {
      await fetch("https://script.google.com/macros/s/AKfycbxnPBDaZEV3gKJrZejVPhNclKQM7t6pOarMZLc49ZH4i7gjWAmAvNFGMrMvhYvvP4qFBA/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newWorker,
          todaydate1: todayDate
        })
      });
      
      alert("Données envoyées avec succès !");
      setShowAddModal(false);
      setNewWorker({
        matricule: '',
        nombre: '',
        equipe: '',
        hours: '',
        finca: 'FINCA 20'
      });
    } catch (error) {
      alert("Erreur lors de l'envoi des données !");
    }
  };

  const saveData = async () => {
    if (selectedMembers.size === 0) {
      alert("Aucun travailleur sélectionné !");
      return;
    }

    const dataToSend = Array.from(selectedMembers).map(code => {
      const member = groupData[selectedGroup].find(m => m.code === code);
      return {
        code,
        name: member?.member || '',
        group: selectedGroup,
        hours: memberHours[code] || 0,
        todaydate: todayDate,
        fin: 'FINCA 20'
      };
    });

    try {
      await fetch("https://script.google.com/macros/s/AKfycbx2oZJcaSD3IGt316_opGvsuGjXmACOMlqMjOMOtQRqvNcD2vB2sNHTMQ6Y1SSu1A78NA/exec", {
        method: "POST",
        mode: 'no-cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });

      alert("Données enregistrées avec succès !");
      setSelectedMembers(new Set());
      setMemberHours({});
      setShowConfirmModal(false);
    } catch (error) {
      alert("Erreur lors de l'enregistrement des données !");
    }
  };

  const members = groupData[selectedGroup] || [];
  const sortedMembers = members.sort((a, b) => a.member.localeCompare(b.member));

  return (
    <div className="pointage-container">
      <input
        type="date"
        value={todayDate}
        onChange={(e) => setTodayDate(e.target.value)}
        className="date-input"
      />

      <select
        value={selectedGroup}
        onChange={handleGroupChange}
        className="group-select"
      >
        <option value="">Sélectionnez Equipe</option>
        {Object.keys(groupData).sort().map(group => (
          <option key={group} value={group}>{group}</option>
        ))}
      </select>

      <div className="summary">
        <span className="selected-count">{selectedMembers.size}</span> Ouvriers
        <button onClick={() => setShowConfirmModal(true)}>Envoyer</button>
        <button onClick={toggleSelectAll}>
          {selectedMembers.size === members.length ? 'Désélectionner' : 'Sélectionner'} tout
        </button>
        <button className="plus-button" onClick={() => setShowAddModal(true)}>+</button>
      </div>

      <table className="members-table">
        <tbody>
          {sortedMembers.map(member => (
            <tr
              key={member.code}
              className={selectedMembers.has(member.code) ? 'selected' : ''}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedMembers.has(member.code)}
                  onChange={() => handleMemberSelect(member.code)}
                />
              </td>
              <td onClick={() => handleMemberSelect(member.code)}>{member.code}</td>
              <td onClick={() => handleMemberSelect(member.code)}>{member.member}</td>
              <td>
                <input
                  type="number"
                  className="hours-input"
                  min="0"
                  step="0.5"
                  value={memberHours[member.code] || 0}
                  onChange={(e) => handleHoursChange(member.code, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmer l'envoi"
      >
        <p>Êtes-vous sûr de vouloir envoyer le pointage ?</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={saveData}>OUI</button>
          <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>NON</button>
        </div>
      </Modal>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter Ouvrier"
      >
        <div className="add-worker-form">
          <input
            type="number"
            placeholder="MATRICULE"
            value={newWorker.matricule}
            onChange={(e) => setNewWorker(prev => ({ ...prev, matricule: e.target.value }))}
          />
          <input
            type="text"
            placeholder="NOMBRE"
            value={newWorker.nombre}
            onChange={(e) => setNewWorker(prev => ({ ...prev, nombre: e.target.value }))}
          />
          <input
            type="text"
            placeholder="EQUIPE"
            value={newWorker.equipe}
            onChange={(e) => setNewWorker(prev => ({ ...prev, equipe: e.target.value }))}
          />
          <input
            type="number"
            placeholder="HOURS"
            value={newWorker.hours}
            onChange={(e) => setNewWorker(prev => ({ ...prev, hours: e.target.value }))}
          />
          <button className="confirm-btn" onClick={handleAddWorker}>Envoyer</button>
        </div>
      </Modal>
    </div>
  );
};

export default Pointage20;