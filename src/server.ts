import express from 'express'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUi, { serve } from 'swagger-ui-express'
import { swaggerSpec, swaggerUiOptions } from './config/swagger'
import router from './router'
import db from './config/db'
import colors from 'colors'

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()//esta funcion es importante par la sincronizacion con sequelize y nuestros modelos

        //cuando se hace pruebas de integracion se requiere quitar los console.log
        //console.log(colors.yellow('Conexion exitosa a la DB')) tube que comentar aqui por que en las pruebas de integracion marcaban error
    } catch (error) {
        console.log(error)
        console.log(colors.red.bold('Error al conectar a la db'))
    }
}
//Conexion a la db
connectDB()

//Instancia de express
const server = express()

//Permitir conexiones con CORS, controlar quien puede consumir recursos del API
const whitelist = [process.env.CORS_URL_DESARROLLO, process.env.CORS_URL_PROUDCCION]
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

server.use(cors(corsOptions))

//leer datos de formulario
server.use(express.json())

//detalles de las peticiones
server.use(morgan('dev'))

//Esta es la entrada al router
server.use('/api/products', router)

//Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))


export default server