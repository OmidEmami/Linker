import { Sequelize } from "sequelize";
 
const db = new Sequelize('ghasrlinker', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;

