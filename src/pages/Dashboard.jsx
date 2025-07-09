import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import Modal from '../components/Modal';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalHours: 0,
    missingContract: 0,
    nonEmptyColumn7: 0,
    totalEquipe: 0,
    totaltache: 0
  });
  const [pointageData, setPointageData] = useState([]);
  const [effectifData, setEffectifData] = useState([]);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [missingNames, setMissingNames] = useState([]);

  useEffect(() => {
    fetchPointageData();
    fetchEffectifData();
  }, []);

  const fetchPointageData = async () => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbw_pOBzwUWz2xBpZna2xHj8u869tADNLflrMlEpfmANumAq0XCo8IS35n40AnsGTakw/exec');
      const data = await response.json();
      setPointageData(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching pointage data:', error);
    }
  };

  const fetchEffectifData = async () => {
    try {
      const response = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=UD8heN6nFEyDz2PmHw3KaNYzvICjLrXBioaszkrmooiJx76NviHQ1IN3Vo3EY6LIuziYtlsukBfKz8e-xgTlEGtvXiXqAboZm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnM3Kri0XU2oA2Erb822H2YC_cn4PAgp4fTVvyhe9Kb_t1HNO98jGF18scWCFF4--xTcVoiZTVhwsrCA5O_Vi88x6QINgmi3zTA&lib=MY2tE_tyfTs-TzsLCAe0qlZwla2VcZTf1');
      const data = await response.json();
      setEffectifData(data);
      calculateEffectifStats(data);
    } catch (error) {
      console.error('Error fetching effectif data:', error);
    }
  };

  const calculateStats = (data) => {
    const filteredData = data.filter(row => row[5] === 'FINCA 20');
    let employeeCount = 0;
    let totalHours = 0;
    let missingContractCount = 0;
    let nonEmptyColumn7Count = 0;
    let uniqueGroups = new Set();
    let missing = [];

    filteredData.forEach(row => {
      if (row.some(cell => cell && typeof cell === 'string' && cell.trim() !== "")) {
        employeeCount++;
        
        const value = parseFloat(row[3]);
        if (!isNaN(value)) {
          totalHours += value;
        }

        if (row[6] && row[6].trim() !== '') {
          missingContractCount++;
        }

        if (row[7] && row[7].trim() !== '') {
          nonEmptyColumn7Count++;
        }

        if (row[2] && row[2].trim() !== "") {
          uniqueGroups.add(row[2]);
        }

        if (!row[6] || row[6].trim() === '' || row[6].trim() !== 'FACE_40') {
          missing.push(row[1]);
        }
      }
    });

    setStats(prev => ({
      ...prev,
      totalEmployees: employeeCount,
      totalHours,
      missingContract: missingContractCount,
      nonEmptyColumn7: nonEmptyColumn7Count,
      totalEquipe: uniqueGroups.size
    }));

    setMissingNames(missing);
  };

  const calculateEffectifStats = (data) => {
    const filteredData = data.slice(1).filter(row => row[1] === 'FINCA 20');
    let uniquetache = new Set();
    
    filteredData.forEach(row => {
      if (row[3] && row[3].trim() !== "") {
        uniquetache.add(row[3]);
      }
    });

    setStats(prev => ({
      ...prev,
      totaltache: uniquetache.size
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const downloadExcel = (data, filename) => {
    // Excel download functionality would go here
    console.log('Download Excel:', filename);
  };

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatsCard
          title="Total des travailleurs"
          value={stats.totalEmployees}
        />
        <StatsCard
          title="Total Heures"
          value={stats.totalHours}
        />
        <StatsCard
          title="Marquer la présence"
          value={stats.missingContract}
          percentage={`${stats.totalEmployees > 0 ? ((stats.missingContract / stats.totalEmployees) * 100).toFixed(2) : 0}%`}
          onClick={() => setShowMissingModal(true)}
        />
        <StatsCard
          title="Manque de Contrat"
          value={stats.nonEmptyColumn7}
          percentage={`${stats.totalEmployees > 0 ? ((stats.nonEmptyColumn7 / stats.totalEmployees) * 100).toFixed(2) : 0}%`}
        />
        <StatsCard
          title="Total Equipes"
          value={stats.totalEquipe}
        />
        <StatsCard
          title="Total taches"
          value={stats.totaltache}
        />
      </div>

      <div className="tables-section">
        <div className="data-table">
          <div className="table-header">
            <h2>SUIVI DE EFFECTIF</h2>
            <button onClick={() => downloadExcel(effectifData, 'EFFECTIF.xlsx')}>
              📥 Télécharger
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>EQUIPE</th>
                  <th>FINCA</th>
                  <th>DATE</th>
                  <th>TAREA</th>
                  <th>EFFECTIF</th>
                </tr>
              </thead>
              <tbody>
                {effectifData.slice(1).filter(row => row[1] === 'FINCA 20').map((row, index) => (
                  <tr key={index}>
                    <td>{row[0] || '-'}</td>
                    <td>{row[1] || '-'}</td>
                    <td>{row[2] ? formatDate(row[2]) : '-'}</td>
                    <td>{row[3] || '-'}</td>
                    <td>{row[4] || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h2>SUIVI DE PONTAGE</h2>
            <button onClick={() => downloadExcel(pointageData, 'POINTAGE.xlsx')}>
              📥 Télécharger
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOME</th>
                  <th>EQUIPE</th>
                  <th>RHH</th>
                  <th>DATE</th>
                  <th>FINCA</th>
                  <th>SITUATION</th>
                  <th>CONTRACT</th>
                </tr>
              </thead>
              <tbody>
                {pointageData.filter(row => row[5] === 'FINCA 20').map((row, index) => (
                  <tr key={index}>
                    <td>{row[0] || '-'}</td>
                    <td>{row[1] || '-'}</td>
                    <td>{row[2] || '-'}</td>
                    <td>{row[3] || '-'}</td>
                    <td>{row[4] ? formatDate(row[4]) : '-'}</td>
                    <td>{row[5] || '-'}</td>
                    <td>{row[6] || '-'}</td>
                    <td>{row[7] || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showMissingModal}
        onClose={() => setShowMissingModal(false)}
        title="Liste non pointés"
      >
        <ul className="missing-names-list">
          {missingNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default Dashboard;