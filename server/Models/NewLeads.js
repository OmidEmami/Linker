import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const NewLeads = db.define('NewLeads',{ 
    FullName :{
        type:DataTypes.TEXT
    },
    Phone: {
        type : DataTypes.TEXT
    },
    HamamType:{
        type: DataTypes.TEXT,
    },
    RequestDate:{
        type:DataTypes.TEXT
    },
    PreferedDate:{
        type :DataTypes.TEXT
    },
    UniqueId:{
        type :DataTypes.TEXT
    },
    FirstFollow:{
        type :DataTypes.TEXT
    },
    Source:{
        type: DataTypes.TEXT
    },
    Status:{
        type: DataTypes.TEXT
    },

    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default NewLeads;