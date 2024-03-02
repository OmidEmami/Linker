import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const IncomingCallsCrm = db.define('IncomingCallsCrm',{ 
    Phone:{
        type:DataTypes.TEXT
    },
    Time:{
        type :DataTypes.TEXT
    },
    IsResponse:{
        type :DataTypes.TEXT
    },
    CallId:{
        type :DataTypes.TEXT
    },
    Section:{
        type: DataTypes.TEXT
    },
    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default IncomingCallsCrm;