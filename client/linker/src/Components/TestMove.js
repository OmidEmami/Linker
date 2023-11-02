import React, { useState } from 'react';

const TestMove = () => {
  const [isMoved, setIsMoved] = useState(false);

  const handleMove = () => {
    setIsMoved(!isMoved);
  };

  const divStyle = {
    width: '15vw',
    height: '100%',
    backgroundColor: 'blue',
    position: 'absolute',
    top: isMoved ? '-100px' : '0px',
    left: isMoved ? '-100px' : '10vw',
    transition: 'top 0.5s, left 0.5s',
    direction :"ltr !important"
  };

  return (
    <div>
      <div style={divStyle}></div>
      <button onClick={handleMove}>Move</button>
    </div>
  );
};

export default TestMove