import React, { useState } from "react";
  
import './Sidebar.css';
function TestSlider() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        khkhk
        <div className="burger-button" onClick={toggleSidebar}>
            ;kl;k;
          <div className={`bar ${isOpen ? 'open' : ''}`} />
          <div className={`bar ${isOpen ? 'open' : ''}`} />
          <div className={`bar ${isOpen ? 'open' : ''}`} />
        </div>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    );
  };
  
export default TestSlider;
