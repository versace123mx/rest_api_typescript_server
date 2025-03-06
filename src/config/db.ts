import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
dotenv.config()

//Esta es la parte de inicializar la conexion a la base de datos
//process.loadEnvFile();
const db = new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + '/../models/**/*'],
    //models: [__dirname + '/../models/**/*.ts'],
    logging:false//para que cuando hacemos la pruebas no nos marque error en la consola
})

export default db