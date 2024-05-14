import MassorModel from "../Models/MassorModel.js";
import PackageModel from "../Models/PackageModel.js";

export const addNewMassor = async(req,res)=>{
    try{
        const fullName = req.body.FullName;
        const response = await MassorModel.create({
            FullName : fullName
        })
        res.json(response)
    }catch(error){
        res.json(error)
    }
}
export const removeMassor = async(req,res)=>{
    try{
        const fullName = req.body.fullName;
        const response = await MassorModel.destroy({
            where:{
                FullName : fullName
            }
        })
        res.json(response)
    }catch(error){
        res.josn(error)
    }
}
export const getAllMassors = async(req,res)=>{
    try{
        const response = await MassorModel.findAll({})
        res.json(response)
    }catch(error){
        res.json(error)
    }
}
export const addNewPackage = async(req,res)=>{
    const packageName = req.body.PackageName;
    const PackageItems = req.body.PackageItems;
    try{
        const response = await PackageModel.create({
            PackageName : packageName,
            PackageItems : PackageItems
        })
        res.json(response)
    }catch(error){
        res.json(error)
    }
}
export const removePackage = async(req,res)=>{
    const packageName = req.body.PackageName;
    try{
        const response = await PackageModel.destroy({
            where:{
                PackageName : packageName
            }
        })
        res.json(response)
    }catch(error){
        res.json(error)
    }
}
export const getAllPackages = async(req,res)=>{
    try{
        const response = await PackageModel.findAll({});
        res.json(response)
    }catch(error){
        res.json(error)
    }
}
export const modifyPackages = async(req,res)=>{
    try{
        const response = await PackageModel.update({
            PackageName : req.body.PackageName,
            PackageItems : req.body.PackageItems
        },{
            where:{
                id: req.body.id
            }
        })
        res.json(response)
    }catch(error){
        res.json(error)
    }
}