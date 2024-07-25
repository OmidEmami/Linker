import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const ReservesMiddleWare = db.define('ReservesMiddleWare',{ 
    FullName :{
        type:DataTypes.TEXT
    },
    RequestDate :{
        type:DataTypes.TEXT
    },
    Phone: {
        type : DataTypes.TEXT
    },
    CheckIn:{
        type: DataTypes.TEXT,
    },
    CheckOut:{
        type:DataTypes.TEXT
    },
    RoomName:{
        type :DataTypes.TEXT
    },
    RoomType:{
        type :DataTypes.TEXT
    },
    Status:{
        type :DataTypes.TEXT
    },
    Price:{
        type: DataTypes.TEXT
    },
    AccoCount:{
        type: DataTypes.TEXT
    },
    ReserveOrigin :{
        type: DataTypes.TEXT
    },
    ReserveId:{
        type: DataTypes.TEXT
    },
    Tariana:{
        type: DataTypes.TEXT
    },
    LoggedUser:{
        type: DataTypes.TEXT
    },
    Percent:{
        type: DataTypes.TEXT
    },
    ExtraService:{
        type: DataTypes.TEXT
    },
    OffRate:{
        type: DataTypes.TEXT
    }
    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default ReservesMiddleWare;