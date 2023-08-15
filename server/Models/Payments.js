import { Sequelize } from "sequelize";
import db from "../Config/Database.js";


const { DataTypes } = Sequelize;
 
const Payments = db.define('Payments',{ 
    ClientName :{
        type:DataTypes.TEXT
    },
    ClientEmail: {
        type : DataTypes.TEXT
    },
    ClientPhone:{
        type: DataTypes.TEXT,
    },
    ClientAmount:{
        type:DataTypes.TEXT
    },
    ClientDescription:{
        type :DataTypes.TEXT
    },
    payDate:{
        type :DataTypes.TEXT
    },
    AuthCode:{
        type :DataTypes.TEXT
    },
    TransactionCode:{
        type: DataTypes.TEXT
    },
    ReserveId:{
        type: DataTypes.TEXT
    },
    CardPan:{
        type: DataTypes.TEXT
    }
    
    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default Payments;