import { Sequelize } from "sequelize";

const sequelize = new Sequelize("hmsdb", "root", "", {
  host: "localhost",
  dialect: "mysql",
  dialectModule: require("mysql2"),
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
export default sequelize;
