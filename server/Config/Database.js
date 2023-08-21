import { Sequelize } from "sequelize";
 
const db = new Sequelize('ghasrlinker', 'root', '1273074556Omid*', {
    host: "localhost",
    dialect: "mysql"
});

export default db;

