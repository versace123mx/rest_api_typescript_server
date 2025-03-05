import { Router } from "express";
import { body, param } from "express-validator";
import { createProduct, getProducts, getProductById, updateProduct, updateAvailability, deleteProduct } from "./handlers/product";
import { handleInputErrors } from "./middleware";


const router = Router()

/**
 * @swagger
 *  components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The Product name
 *                      example: Monitor Curvo de 49 Pulgadas
 *                  price:
 *                      type: number
 *                      description: The Product price
 *                      example: 500
 *                  availability:
 *                      type: boolean
 *                      description: The Product availability
 *                      example: true
 */


/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses: 
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#components/schemas/Product'
 */

router.get('/', getProducts)


/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: Get a products by ID
 *          tags:
 *              - Products
 *          description: Return a product based on its unique ID
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Successful Response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              items:
 *                                  $ref: '#components/schemas/Product'
 *              400:
 *                  description: Bad Request Invalid ID
 *                  content:
 *                      application/json:
 *                          schema:
 *                              items:
 *                                  $ref: '#components/schemas/Product'
 *              404:
 *                  description: Not found
 */
router.get('/:id',
    param("id").isInt().withMessage("Id no valido"),
    handleInputErrors,
    getProductById)


/**
 * @swagger
 * /api/products:
 *      post:
 *          summary: Create a new products
 *          tags:
 *              - Products
 *          description: Return a new record in the database
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Mazo"
 *                              price:
 *                                  type: number
 *                                  example: 1250
 *          responses:
 *              201:
 *                  description: Successfully response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#components/schemas/Product'
 *              400:
 *                  description: Bad Request - invalid input data
 *                
 */
router.post('/',
    body('name')
        .notEmpty().withMessage('El nombre del Producto no pue ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no valido')
        .notEmpty().withMessage('El precio del producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no valido'),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *      put:
 *          summary: Update a product with user input
 *          tags:
 *              - Products
 *          description: Return s the update product
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: "Monitor Curvo de 49 cm"
 *                              price:
 *                                  type: number
 *                                  example: 7500
 *                              availability:
 *                                  type: boolean
 *                                  example: true
 *          responses:
 *              200:
 *                  description: Successfully response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#components/schemas/Product'
 *              400:
 *                  description: Bad Request - invalid ID or invalid input data
 *              404:
 *                  description: Product Not Found
 *                
 */
router.put('/:id',
    param("id").isInt().withMessage("Id no valido"),
    body('name')
        .notEmpty().withMessage('El nombre del Producto no pue ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no valido')
        .notEmpty().withMessage('El precio del producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no valido'),
    body('availability')
        .isBoolean().withMessage('Valor para Disponibilidad no valida'),
    handleInputErrors,
    updateProduct
)


/**
 * @swagger
 * /api/products/{id}:
 *      patch:
 *          summary: Update product availability
 *          tags:
 *              - Products
 *          description: Returns the update availability
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Successfully response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#components/schemas/Product'
 *              400:
 *                  description: Bad Request - invalid ID
 *              404:
 *                  description: Product Not Found
 *                
 */
router.patch('/:id',
    param("id").isInt().withMessage("Id no valido"),
    handleInputErrors,
    updateAvailability
)


/**
 * @swagger
 * /api/products/{id}:
 *      delete:
 *          summary: Delete a product By ID
 *          tags:
 *              - Products
 *          description: Delite a Product
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to delite
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Successfully response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              value: 'Producto Eliminado correctemente'
 *              400:
 *                  description: Bad Request - invalid ID
 *              404:
 *                  description: Product Not Found
 *                
 */
router.delete('/:id',
    param("id").isInt().withMessage("Id no valido"),
    handleInputErrors,
    deleteProduct
)


export default router