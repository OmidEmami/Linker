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
        console.log(result)
        // if (result.length > 0) {
        //   res.send({ message: 'Date exists in records.', data: result });
        // } else {
        //   res.send({ message: 'Date not found.' });
        // }
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while querying the database.');
      }
}