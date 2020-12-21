const request = require('supertest');
const expect = require('chai').expect;
const { userTwo, userOne, setUpDatabase, taskOne } = require('./fixtures/db');
const app = require('../src/app');
const Task = require('../src/schemas/task');

beforeEach(setUpDatabase);

// ******************************* MOCHA IMPLEMENTATION **************************************

describe('Tasks', () => {
    it('should create a task for user', async () => {
        const res = await request(app)
                        .post('/api/v1/task')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send({
                            description: 'From my test cases'
                        })
                        .expect(201)

        const task = await Task.findById(res.body.data._id);
        expect(task).not.to.be.a('null')
        expect(task.completed).to.be.equal(false)
    });

    it('should get tasks for a given user', async () => {
        const res = await request(app)
                        .get('/api/v1/task')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(200)

        expect(res.body.data.length).to.be.equal(2)
        expect(res.body.data).to.have.lengthOf(2)
    });

    it('should fail when trying to delete the task from another user', async () => {
        await request(app)
            .delete(`/task/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(404)
        
        const task = await Task.findById(taskOne._id);
        expect(task).not.to.be.a('null');
    });
    
    it('Should not create task with invalid description/completed', async () => {
        await request(app)
            .post('/api/v1/task')
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send({
                description: false
            })
            .expect(400)
    });

    it('Should not create task with invalid completed', async () => {
        await request(app)
            .post('/api/v1/task')
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send({
                completed: 3
            })
            .expect(400)
    });

    it('Should not update task with invalid description', async () => {
        await request(app)
            .put(`/api/v1/task/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send({
                description: 2
            })
            .expect(400)
    });

    it('Should not update task with invalid completed', async () => {
        await request(app)
            .put(`/api/v1/task/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send({
                completed: 'Hello'
            })
            .expect(400)
    });

    it('Should delete user task', async () => {
        await request(app)
            .delete(`/api/v1/task/${taskOne._id}`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(200)
        
        const task = await Task.findById(taskOne._id);
        expect(task).to.be.a('null');
    });

    it('Should not delete task if unauthenticated', async () => {
        await request(app)
            .delete(`/api/v1/task/${taskOne._id}`)
            .send()
            .expect(401)      
    });

    it('Should not update other users task', async () => {
        await request(app)
            .put(`/api/v1/task/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send({
                completed: true
            })
            .expect(404)
    });

    it('Should fetch user task by id', async () => {
        const res = await request(app)
            .get(`/api/v1/task/${taskOne._id}`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
        
        expect(res.body).to.be.an('object').that.has.property('data');
        expect(res.body.data).to.have.property('description').equal('First task from test');
        expect(res.body.data).to.have.property('completed').equal(false);
    });

    it('Should not fetch user task by id if unauthenticated', async () => {
        await request(app)
            .get(`/api/v1/task/${taskOne._id}`)
            .send()
            .expect(401)
    });
    
    it('Should not fetch other users task by id', async () => {
        await request(app)
            .get(`/api/v1/task/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(404)
    });

    it('Should fetch only completed tasks', async () => {
        const res = await request(app)
            .get(`/api/v1/task?completed=true`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

        expect(res.body).to.be.an('object').that.has.property('data')
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.has.property('description').equal('Second task from test')
    });

    it('Should fetch only incomplete tasks', async () => {
        const res = await request(app)
            .get(`/api/v1/task?completed=false`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

        expect(res.body).to.be.an('object').that.has.property('data')
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.has.property('description').equal('First task from test')
    });

    it('Should sort tasks by description', async () => {
        const res = await request(app)
            .get(`/api/v1/task?sortBy=description`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

        expect(res.body).to.be.an('object').that.has.property('data')
        expect(res.body.data).to.have.lengthOf(2);
        expect(res.body.data[0]).to.has.property('description').equal('First task from test')
        expect(res.body.data[1]).to.has.property('description').equal('Second task from test')
    });

    it('Should sort tasks by completed', async () => {
        const res = await request(app)
            .get(`/api/v1/task?sortBy=completed`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

        expect(res.body).to.be.an('object').that.has.property('data')
        expect(res.body.data).to.have.lengthOf(2);
        expect(res.body.data[0]).to.has.property('description').equal('First task from test')
        expect(res.body.data[1]).to.has.property('description').equal('Second task from test')
    });
    
    it('Should sort tasks by createdAt', async () => {
        const res = await request(app)
            .get(`/api/v1/task?sortBy=createdAt`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

        expect(res.body).to.be.an('object').that.has.property('data')
        expect(res.body.data).to.have.lengthOf(2);
        expect(res.body.data[0]).to.has.property('description').equal('First task from test')
        expect(res.body.data[1]).to.has.property('description').equal('Second task from test')
    });
});



// ******************************* FIXME: JEST IMPLEMENTATION ---> it needs a "tests" folder **************************************


// test('should create a task for user', async () => {
//     const res = await request(app)
//                     .post('/api/v1/task')
//                     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//                     .send({
//                         description: 'From my test cases'
//                     })
//                     .expect(201)

//     const task = await Task.findById(res.body.data._id)
//     expect(task).not.toBeNull()
//     expect(task.completed).toEqual(false)
// });

// test('should get tasks for a given user', async () => {
//     const res = await request(app)
//                     .get('/api/v1/task')
//                     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//                     .send()
//                     .expect(200)

//     expect(res.body.data.length).toEqual(2)
//     expect(res.body.data).toHaveLength(2)
// });

// test('should fail when trying to delete the task from another user', async () => {
//     await request(app)
//         .delete(`/task/${taskOne._id}`)
//         .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
//         .send()
//         .expect(404)
    
//     const task = await Task.findById(taskOne._id)
//     expect(task).not.toBeNull()
// });

// TODO: Task Test Ideas
//
// Should not create task with invalid description/completed - DONE
// Should not update task with invalid description/completed - DONE
// Should delete user task - DONE
// Should not delete task if unauthenticated - DONE
// Should not update other users task - DONE
// Should fetch user task by id - DONE
// Should not fetch user task by id if unauthenticated - DONE
// Should not fetch other users task by id - DONE
// Should fetch only completed tasks - DONE
// Should fetch only incomplete tasks - DONE
// Should sort tasks by description/completed/createdAt/updatedAt -DONE
// Should fetch page of tasks



