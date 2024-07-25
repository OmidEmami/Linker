import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const PaymentConf = db.define('PaymentConf',{ 
    ReserveId :{
        type:DataTypes.TEXT
    },
    Conf1 :{
        type:DataTypes.TEXT
    },
    Conf2: {
        type : DataTypes.TEXT
    },
    Conf1User:{
        type: DataTypes.TEXT,
    },
    Conf2User:{
        type:DataTypes.TEXT
    },
    
    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default PaymentConf;