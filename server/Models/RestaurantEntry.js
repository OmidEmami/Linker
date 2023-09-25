import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const RestaurantEntry = db.define('RestaurantEntry',{ 
    
    Phone:{
        type:DataTypes.TEXT
    }

    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default RestaurantEntry;