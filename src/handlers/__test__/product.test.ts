import request from "supertest"
import server from "../../server"

describe('POST /api/products', () => {


    test('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})

        //lo que debe se ser
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        //lo que no debe de ser
        expect(response.status).not.toBe(201)
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(500)
        expect(response.body).not.toHaveProperty('data')

    })

    test('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "camara fotografica - Testing",
            price: 0
        })

        //lo que debe se ser
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        //lo que no debe de ser
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)

    })

    test('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "camara fotografica - Testing",
            price: 'hola'
        })

        //lo que debe se ser
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        //lo que no debe de ser
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)

    })

    test('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "camara fotografica - Testing",
            price: 7980
        })

        //lo que debe se ser
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        //lo que no debe de ser
        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(500)
        expect(response.body).not.toHaveProperty('error')

    })
})

describe('GET /api/products', () => {
    test('should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })

    test('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    test('Should return a 404 response for a non-exist product', async () => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado intenta con otro.')
    })

    test('Should check a valid ID in the URL', async () => {

        const response = await request(server).get('/api/products/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no valido')
    })

    test('get a JSON response for a single product', async () => {

        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {

    test('Should check a valid ID in the URL', async () => {

        const response = await request(server).put('/api/products/not-valid-url').send({
            name: "Monitor Curvo",
            availability: true,
            price: 10
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no valido')
    })

    test('Should display validation error messages when updating a product', async () => {

        const response = await request(server).put('/api/products/1').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    test('Should validation that the price is greater than 0', async () => {

        const response = await request(server).put('/api/products/1').send({
            name: "Monitor Curvo",
            availability: true,
            price: 0
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Precio no valido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    test('Should return a 404 response for a non-existent product', async () => {

        const productId = 2000
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "Monitor Curvo",
            availability: true,
            price: 300
        })
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado intenta con otro.')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    test('Should update an existing product with valid data', async () => {

        const productId = 1
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "Monitor Curvo",
            availability: true,
            price: 300
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })


})

describe('PATCH /api/products/:id', () => {

    test('Should check if exist url return a 400 response for a non-existing', async () => {
        const response = await request(server).patch('/api/products/non-existing')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no valido')

        expect(response.status).not.toBe(200)
    })

    test('Should return a 404 response for a non-existing', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado intenta con otro.')

        expect(response.status).not.toBe(200)
    })

    test('Should check a valid ID', async () => {

        const response = await request(server).patch('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.body).not.toHaveProperty('error')
        expect(response.status).not.toBe(400)
    })

})

describe('DELETE /api/products/:id', () => {
    
        test('Should check a valid ID', async () => {
            
            const response = await request(server).delete('/api/products/not-valid-url')
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('errors')
            expect(response.body.errors).toHaveLength(1)
            expect(response.body.errors[0].msg).toBe('Id no valido')
        })
    
        
        test('Should return a 404 response for a none-existent product', async () => {
            const productId = 2000
            const response = await request(server).delete(`/api/products/${productId}`)
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('error')
            expect(response.body.error).toBe('Producto no encontrado intenta con otro.')
            expect(response.status).not.toBe(200)
        })
    
        test('Should delete a product', async () => {
            const response = await request(server).delete('/api/products/1')
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('data')
            expect(response.body.data).toBe('Producto Eliminado correctemente')
            expect(response.status).not.toBe(400)
            expect(response.status).not.toBe(404)
            expect(response.status).not.toBe(500)
        })

})