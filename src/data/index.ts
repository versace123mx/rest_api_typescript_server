import { exit } from 'node:process' //detiene la ejecucion de un codigo de nodejs
import db from '../config/db'

const clearDB = async () => {

    try {
        await db.sync({ force: true })
        console.log('Datos eliminados correctamente')
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if(process.argv[2] == '--clear'){
    clearDB()
}