import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const HamamReserveDetail = db.define('HamamReserveDetail',{ 
    UniqueId :{
        type:DataTypes.TEXT
    },
    FullName:{
        type:DataTypes.TEXT
    },
    Phone:{
        type:DataTypes.TEXT
    },
    Date:{
        type:DataTypes.TEXT
    },
    Hours:{
        type:DataTypes.TEXT
    },
    CustomerType:{
        type:DataTypes.TEXT
    },
    ServiceType:{
        type:DataTypes.TEXT
    },
    SelectedService:{
        type:DataTypes.TEXT
    },
    AccoStatus:{
        type:DataTypes.TEXT
    },
    CateringDetails:{
        type:DataTypes.TEXT
    },
    MassorNames:{
        type:DataTypes.TEXT
    },
    SelectedMassorNames:{
        type:DataTypes.TEXT
    },
    SelectedPackage:{
        type:DataTypes.TEXT
    },
    Desc:{
        type:DataTypes.TEXT
    },
    FinalPrice:{
        type:DataTypes.TEXT
    },
    User:{
        type: DataTypes.TEXT
    },
    CurrentStatus:{
        type:DataTypes.TEXT
    },
    SatisfactionText:{
        type:DataTypes.TEXT
    },
    Satisfaction:{
        type:DataTypes.TEXT
    }
  

},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default HamamReserveDetail;