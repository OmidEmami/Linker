import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const ReceptionLeads = db.define('ReceptionLeads',{ 

    UniqueId:{
        type:DataTypes.TEXT
    },
    FullName :{
        type:DataTypes.TEXT
    },
    Phone:{
        type:DataTypes.TEXT
    },
    Date:{
        type:DataTypes.TEXT
    },
    Status:{
        type:DataTypes.TEXT
    },
    Description:{
        type:DataTypes.TEXT
    },
    RequestType:{
        type:DataTypes.TEXT
    },
    FinalResult:{
        type:DataTypes.TEXT
    },
    User:{
        type:DataTypes.TEXT
    }
    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default ReceptionLeads;