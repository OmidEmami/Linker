import HamamReserveDetail from "../Models/HamamReserveDetail.js";
import {Op} from "sequelize"
import Sequelize from 'sequelize';
import PackageModel from "../Models/PackageModel.js";
import MassorModel from "../Models/MassorModel.js";
export const getFixedReserves = async(req,res)=>{
    const { date } = req.body;
    console.log(date)
    try {
        const result = await HamamReserveDetail.findAll({
          where: Sequelize.where(Sequelize.fn('LEFT', Sequelize.col('Date'), 7), date)
        });
        const packagesList = await PackageModel.findAll({})
        const massorNames = await MassorModel.findAll({})
        res.json({result, packagesList, massorNames})
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while querying the database.');
      }
}