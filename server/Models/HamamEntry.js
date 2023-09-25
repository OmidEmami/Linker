import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const HamamEntry = db.define('HamamEntry',{ 
    
    Phone:{
        type:DataTypes.TEXT
    }
    
    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default HamamEntry;