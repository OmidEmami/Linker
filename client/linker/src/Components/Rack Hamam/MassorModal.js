import React, { useEffect, useState } from 'react';
import Modal from "react-modal";
import axios from 'axios';
import { Button } from '@mui/material';
import { IoMdAddCircleOutline } from "react-icons/io";
import { notify } from '../toast';
import "./PackageModal.css";
import LoadingComp from '../LoadingComp';
function MassorModal({ isOpen, onClose }) {
    const [allPackages, setAllPackages] = useState([]);
    const [showAddFields, setShowAddFields] = useState(false);
    const [newPackageName, setNewPackageName] = useState('');
    const [newPackageItems, setNewPackageItems] = useState('');
    const [editPackageNames, setEditPackageNames] = useState({});
    const [editPackageItems, setEditPackageItems] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const onCloseHandler = () => {
        onClose();
    };
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: "80%",
            height: "70%"
        },
        overlay: {
            zIndex: 900
        }
    };

    const tableStyles = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    const thTdStyles = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'left',
    };

    const actionTdStyles = {
        ...thTdStyles,
    };

    const hoverStyle = {
        cursor: 'pointer',
        backgroundColor: '#f5f5f5'
    };

    

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get("http://localhost:3001/api/getallmassornames");
            console.log(response.data);
            setAllPackages(response.data);
            const initialPackageNames = {};
            const initialPackageItems = {};
            response.data.forEach(pkg => {
                initialPackageNames[pkg.id] = pkg.FullName;
                
            });
            setEditPackageNames(initialPackageNames);
            
            setIsLoading(false)
        } catch (error) {
            notify("خطا", 'error');
            setIsLoading(false)
        }
    };
    const handleNameChange = (id, newName) => {
        setEditPackageNames(prev => ({ ...prev, [id]: newName }));
    };

    const handleItemsChange = (id, newItems) => {
        setEditPackageItems(prev => ({ ...prev, [id]: newItems }));
    };
    const addNewPackage = async () => {
        try {
            setIsLoading(true)
            const response = await axios.post('http://localhost:3001/api/regnewmassor', {
                FullName: newPackageName,
                
            });
            fetchData();
            setNewPackageName('');
            setNewPackageItems('');
            setShowAddFields(false);
            notify("پکیج با موفقیت اضافه شد", 'success');
            setIsLoading(false)
        } catch (error) {
            notify("خطا", 'error');
            setIsLoading(false)
        }
    };
 
    const removePackage = async(pack)=>{
        try{
            setIsLoading(true)
            const response = await axios.post('http://localhost:3001/api/removemassor',{
                fullName : editPackageNames[pack.id],
            })
            fetchData();
            setIsLoading(false);
            notify('موفق','success')
        }catch(error){
            notify("خطا", 'error');
            setIsLoading(false)
        }
    }
    return (
        <>
        {isLoading && <LoadingComp />}
        <Modal
        isOpen={isOpen}
        onRequestClose={onCloseHandler}
        style={customStyles}
        contentLabel="Package Details Modal"
    >
            <table style={tableStyles}>
                <thead>
                    <tr>
                        <th style={thTdStyles}>ID</th>
                        <th style={thTdStyles}>نام پکیج</th>
                        
                        <th style={thTdStyles}></th>
                    </tr>
                </thead>
                <tbody>
                {allPackages.map((pkg) => (
                            <tr key={pkg.id} style={hoverStyle} onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#e2e2e2';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '';
                            }}>
                                <td style={thTdStyles}>{pkg.id}</td>
                                <td style={thTdStyles}>
                                    <input
                                        type="text"
                                        value={editPackageNames[pkg.id] || ''}
                                        onChange={(e) => handleNameChange(pkg.id, e.target.value)}
                                    />
                                </td>
                                <td style={actionTdStyles}>
                                    
                                    <Button style={{fontFamily:"yekan", marginLeft:"1rem"}} variant="contained" onClick={() => removePackage(pkg)}>
                                        حذف
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div>
                <div className='hover-effect'>
                <Button onClick={() => setShowAddFields(true)} style={{ margin: '10px' }}>
                    <IoMdAddCircleOutline size={30} /> اضافه کردن خدمات دهنده
                </Button></div>
                {showAddFields && (
                    <table style={{ ...tableStyles, marginTop: '10px' }}>
                        <tbody>
                            <tr>
                                <td style={thTdStyles}>
                                    <input
                                        type="text"
                                        placeholder="نام خدمات دهنده"
                                        value={newPackageName}
                                        onChange={(e) => setNewPackageName(e.target.value)}
                                    />
                                </td>
                                <td style={actionTdStyles}>
                                    <Button style={{fontFamily:"yekan"}} variant="contained" onClick={addNewPackage}>
                                        ذخیره
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </Modal>
        </>
    );
}

export default MassorModal;
