import { query, Request, Response } from 'express'
import Product from '../models/Producto.model'


const getProducts = async (req: Request, res: Response) => {

    try {
        
        const product = await Product.findAll({
            order:[
                ['price','DESC']
            ],
            attributes:{exclude:['createdAt','updatedAt']}
        })

        res.status(200).json({ data: product })

    } catch (error) {
        
        console.log(error)

    }
    

}

const getProductById = async (req: Request, res: Response) => {

    const { id } = req.params
    
    try {
        
        const product = await Product.findOne({where: {id}})

        if (product === null) {
            return res.status(404).json({ error : 'Producto no encontrado intenta con otro.'})
        }

        res.status(200).json({ data: product })

    } catch (error) {
        
        console.log(error)

    }
    

}

const createProduct = async (req: Request, res: Response) => {

    try {

        const product = await Product.create(req.body)
        res.status(201).json({ data: product })

    } catch (error) {
        console.log(error)
    }
}

const updateProduct = async (req: Request, res: Response) => {
    
    const { id } = req.params
    
    try {
        
        const product = await Product.findOne({where: {id}})

        if (product === null) {
            return res.status(404).json({ error: 'Producto no encontrado intenta con otro.'})
        }

        await (await product.update(req.body)).save()
        
        res.status(200).json({ data: product })

    } catch (error) {
        
        console.log(error)

    }

}

const updateAvailability = async (req: Request, res: Response) => {
    
    const { id } = req.params
    
    try {
        
        const product = await Product.findOne({where: {id}})

        if (product === null) {
            return res.status(400).json({ error: 'Producto no encontrado intenta con otro.'})
        }

        product.availability = !product.dataValues.availability
        await product.save()

        res.status(200).json({ data: product })

    } catch (error) {
        
        console.log(error)

    }

}

const deleteProduct = async (req: Request, res: Response) => {
    
    const { id } = req.params
    
    try {
        
        const product = await Product.findOne({where: {id}})

        if (product === null) {
            return res.status(404).json({ error: 'Producto no encontrado intenta con otro.'})
        }

        await product.destroy()

        res.status(200).json({ data: 'Producto Eliminado correctemente' })

    } catch (error) {
        
        console.log(error)

    }

}




export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    updateAvailability,
    deleteProduct
}