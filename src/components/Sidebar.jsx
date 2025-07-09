import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DollarSign, 
  LayoutDashboard, 
  Users, 
  Calendar,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      active: location.pathname === '/'
    },
    {
      id: 'presence-control',
      label: 'Controle de Présence',
      icon: Users,
      submenu: [
        { label: 'POINTAGE', path: '/pointage20' },
        { label: 'EFFECTIF', path: '/effectif-f20' }
      ]
    },
    {
      id: 'labor-management',
      label: 'Gestion Laboral',
      icon: DollarSign,
      submenu: [
        { label: 'NV EMBOUCHE', path: '/cart' },
        { label: 'CONTRACT', path: '/contract' },
        { label: 'RIB', path: '/rib' }
      ]
    },
    {
      id: 'presence-management',
      label: 'Gestion de Présence',
      icon: Users,
      submenu: [
        { label: 'POINTAGE', path: '/pointage' },
        { label: 'EFFECTIF', path: '/effectif' }
      ]
    },
    {
      id: 'base',
      label: 'La Base',
      icon: Calendar,
      path: '/base',
      active: location.pathname === '/base'
    },
    {
      id: 'contact',
      label: 'Contactez-Nous',
      icon: Calendar,
      path: '/contact',
      active: location.pathname === '/contact'
    },
    {
      id: 'other-options',
      label: 'Autres options',
      icon: Users,
      submenu: [
        { label: 'Ajouter Equipe/Tache', path: '/tache-equipe' }
      ]
    }
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <DollarSign className="logo-icon" />
          <span className="logo-text">CAMPO</span>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <>
                  <button
                    className={`nav-item ${expandedMenus[item.id] ? 'active' : ''}`}
                    onClick={() => toggleMenu(item.id)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                    {expandedMenus[item.id] ? 
                      <ChevronDown size={16} /> : 
                      <ChevronRight size={16} />
                    }
                  </button>
                  {expandedMenus[item.id] && (
                    <div className="sub-nav">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`nav-item sub-item ${
                            location.pathname === subItem.path ? 'active' : ''
                          }`}
                          onClick={onToggle}
                        >
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`nav-item ${item.active ? 'active' : ''}`}
                  onClick={onToggle}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;