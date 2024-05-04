import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const MassorModel = db.define('MassorModel',{ 
    FullName :{
        type:DataTypes.TEXT
    },  
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default MassorModel;