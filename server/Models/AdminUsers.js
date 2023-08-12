import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const AdminUsers = db.define('AdminUsers',{ 
    FullName :{
        type:DataTypes.TEXT
    },
    UserName: {
        type : DataTypes.TEXT
    },
    Password:{
        type: DataTypes.TEXT,
    },
    Phone:{
        type:DataTypes.TEXT
    },
    AccessType:{
        type :DataTypes.TEXT
    },
    Rule:{
        type :DataTypes.TEXT
    },
    RefreshToken:{
        type: DataTypes.TEXT
    }
    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default AdminUsers;