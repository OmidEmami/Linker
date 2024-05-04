import HamamReserveDetail from "../Models/HamamReserveDetail.js";
import {Op} from "sequelize"
import Sequelize from 'sequelize';
export const getFixedReserves = async(req,res)=>{
    const { date } = req.body;
    console.log(date)
    try {
        const result = await HamamReserveDetail.findAll({
          where: Sequelize.where(Sequelize.fn('LEFT', Sequelize.col('Date'), 7), date)
        });
        res.json(result)
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while querying the database.');
      }
}