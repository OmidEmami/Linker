import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const DetailedCalls = db.define('DetailedCalls',{ 
    Phone:{
        type:DataTypes.TEXT
    },
    LastCall:{
        type :DataTypes.TEXT
    },
    FullName:{
        type: DataTypes.TEXT
    },
    CallId:{
        type :DataTypes.TEXT
    },
    FirstCall:{
        type: DataTypes.TEXT
    },
    RequestType:{
        type: DataTypes.TEXT
    },
    BackGround:{
        type: DataTypes.TEXT
    },
    Result:{
        type: DataTypes.TEXT
    },
    customerSource:{
        type: DataTypes.TEXT
    },
    RegUser:{
        type: DataTypes.TEXT
    },
    Section:{
        type: DataTypes.TEXT
    },
    RequestDateAcco:{
        type: DataTypes.TEXT
    },
    AccoRequestType:{
        type: DataTypes.TEXT
    },
    ActionEghamat:{
        type: DataTypes.TEXT
    },
    ActionEghamatZarfiat:{
        type: DataTypes.TEXT
    },
    OtherAccoTypes:{
        type: DataTypes.TEXT
    },
    OtherguestRequestType:{
        type: DataTypes.TEXT
    },

},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default DetailedCalls;