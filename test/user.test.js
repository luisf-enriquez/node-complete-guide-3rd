const request = require('supertest');
const expect = require('chai').expect;
const app = require('../src/app');
const User = require('../src/schemas/user');
const { userOneId, userOne, setUpDatabase } = require('./fixtures/db');

// Jest lifecycle methods
// we create a user that we can use in the endpoints that requires an authenticated one

// const userOneId = new mongoose.Types.ObjectId()
// const userOne = {
//     _id: userOneId,
//     name: 'Fernando',
//     email: 'fernando@gmail.com',
//     password: 'myuserpass',
//     tokens: [
//         {
//             token: jwt.sign({ payload: { _id: userOneId } }, process.env.JWT_SECRET)
//         }
//     ]
// }

// Before each test runs we celan the users collection an create a new user for the tests 
// that need an existent user, we call the function created in "db.js" called setUpDatabase

// ******************************* MOCHA IMPLEMENTATION **************************************
beforeEach(setUpDatabase);

describe('Users', () => {

    it('should sign up a new user (POST)', async () => {
        const res = await request(app)
            .post('/api/v1/user')
            .send({
                name: 'Luis Enriquez',
                email: 'luisen@gmail.com',
                password: 'mypass',
                age: 20
            }).expect(201)
        
        expect(res.body).to.be.an('object').that.includes.all.keys('status', 'data', 'message')
        
        const user = await User.findById(res.body.data.user._id)
        expect(user).to.not.be.a('null')
    });

    it('should Login existing user', async () => {
        const res = await request(app)
                        .post('/api/v1/users/login')
                        .send({
                            email: userOne.email,
                            password: 'myuserpass'
                        }).expect(200)
        
        const user = await User.findById(userOneId);
        expect(user).to.have.property('tokens').that.has.lengthOf(2);
        expect(res.body.data.token).to.equal(user.tokens[1].token);
    });

    it('should not login nonexistent user', async () => {
        await request(app).post('/api/v1/users/login')
                .send({
                email: userOne.email,
                password: 'wrongPass'
            }).expect(400)
    });

    it('should get profile for an user', async () => {
        const res = await request(app).get('/api/v1/users/me')
            .send()
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(200)

        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.have.property('name').equal('Fernando');
    });

    it('should not get profile for unauthenticated user', async () => {
        await request(app).get('/api/v1/users/me')
            .send()
            .expect(401)
    });

    it('should delete account for user', async () => {
        await request(app)
                .delete('/api/v1/user/me')
                .send()
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .expect(200)

        const user = await User.findById(userOneId);
        expect(user).to.be.a('null');
        
    });

    it('should not delete account for unathenticated user', async () => {
        await request(app).delete('/api/v1/user/me')
                .send()
                .expect(401)
    });

// // Attach a file to prove an endpoint that upload files to the DB
// // toEqual does compare content, toBe just uses '==='

    it('should upload avatar image', async () => {
        await request(app)
            .post('/api/v1/user/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('avatar', './test/fixtures/profile.jpg')
            .expect(200)

        const user = await User.findById(userOneId);
        expect(user.avatar).not.to.be.a('null');
    });

    it('should update valid user fields', async () => {
        await request(app)
            .put('/api/v1/user/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: 'Mike'
            })
            .expect(200)

        const user = await User.findById(userOneId);
        expect(user.name).to.equal('Mike')
    });

    it('should not update invalid user fileds', async () => {
        const res = await request(app)
            .put('/api/v1/user/me')
            .send({
                location: 'Medellin'
            })
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            expect(400)
        
        expect(res.body).to.have.property('type').that.is.equal("object.allowUnknown");
        expect(res.body).to.have.property('message').that.is.equal('"location" is not allowed');
    });

});



// ******************************* JEST IMPLEMENTATION **************************************

// test('should sign up a new user (POST)', async () => {
//     const res = await request(app).post('/api/v1/user')
//             .send({
//                 name: 'Luis Enriquez',
//                 email: 'luisen@gmail.com',
//                 password: 'mypass',
//                 age: 12
//             }).expect(201)

//     // assert that DB was changed correctly
//     const user = await User.findById(res.body.data.user._id);
//     expect(user).not.toBeNull();

//     expect(res.body.data).toMatchObject({
//         user: {
//             name: 'Luis Enriquez',
//             email: 'luisen@gmail.com',
//         },
//         token: userOne.tokens[0].token
//     })
//     expect(user.password).not.toBe('mypass')
//     console.log('This test actually finish')
// });

// test('should Login existing user', async () => {
//     const res = await request(app).post('/api/v1/users/login')
//             .send({
//                 email: userOne.email,
//                 password: userOne.password
//             }).expect(200)

//     const user = await User.findById(userOneId);
//     expect(user.tokens).toHaveLength(2);
//     expect(res.body.data.token).toBe(user.tokens[1].token);
// });

// test('should not login nonexistent user', async () => {
//     await request(app).post('/api/v1/users/login')
//             .send({
//                 email: userOne.email,
//                 password: 'wrongPass'
//             }).expect(400)
// });

// test('should get profile for an user', async () => {
//     await request(app).get('/api/v1/users/me')
//             .send()
//             .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//             .expect(400)
// });

// test('should not get profile for unauthenticated user', async () => {
//     await request(app).get('/api/v1/users/me')
//             .send()
//             .expect(401)
// });

// test('should delete account for user', async () => {
//     await request(app).delete('/api/v1/user/me')
//             .send()
//             .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//             .expect(200)

//     const user = await User.findById(userOneId);
//     expect(user).toBeNull();
    
// });

// test('should not delete account for unathenticated user', async () => {
//     await request(app).delete('/api/v1/user/me')
//             .send()
//             .expect(401)
// });

// // Attach a file to prove an endpoint that upload files to the DB
// // toEqual does compare content, toBe just uses '==='

// test('should upload avatar image', async () => {
//     await request(app)
//         .post('/api/v1/user/me/avatar')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .attach('avatar', '/tests/fixtures/profile.jpg')
//         .expect(200)

//     const user = await User.findById(userOneId);
//     expect(user.avatar).toEqual(expect.any(Buffer))
// });

// test('should update valid user fields', async () => {
//     await request(app)
//         .put('/api/v1/user/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send({
//             name: 'Mike'
//         })
//         expect(200)

//     const user = await User.findById(userOneId);
//     expect(user.name).toEqual('Mike')
// });

// test('should not update invalid user fileds', async () => {
//     await request(app)
//         .put('/api/v1/user/me')
//         .send({
//             location: 'Medellin'
//         })
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         expect(500)
// });

// ******************************* JEST IMPLEMENTATION **************************************

// TODO: 
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated
