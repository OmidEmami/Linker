import React from 'react'
import Modal from "react-modal"
function MassorModal({ isOpen, onClose}) {
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width:"80%",
          height:"70%"
        },
        overlay: {
          zIndex: 900
        }
      };
      const onCloseHandler = () => {
        onClose();  
      };
  return (
    <div>
       <Modal
       isOpen={isOpen} 
       onRequestClose={onCloseHandler}
        style={customStyles}
        contentLabel="Example Modal"
          >
            <div>omidماسور</div>
          </Modal>
    </div>
  )
}

export default MassorModal
