import ReservesMiddleWare from "../Models/ReservesMiddleWare.js"
export const getMiddleReserves = async(req,res) =>{
    try{
      const response =await ReservesMiddleWare.findAll({})
      res.json(response)
    }catch(error){
      res.status(404)
    }
  }