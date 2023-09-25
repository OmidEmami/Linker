import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const RoomEntry = db.define('RoomEntry',{ 
    FullName :{
        type:DataTypes.TEXT
    },
    Phone:{
        type:DataTypes.TEXT
    },
    Date:{
        type:DataTypes.TEXT
    }
    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default RoomEntry;