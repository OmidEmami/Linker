import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const PackageModel = db.define('PackageModel',{ 
    PackageName :{
        type:DataTypes.TEXT
    },
    PackageItems :{
        type:DataTypes.TEXT
    },
    

    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default PackageModel;