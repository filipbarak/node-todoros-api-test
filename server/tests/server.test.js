const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todoro} = require('./../models/todoro');

const todoros = [{
    title: 'First test',
    _id: new ObjectID(),
}, {
    _id: new ObjectID(),
    title: 'Second test'
}]

beforeEach((done) => {
    Todoro.remove({}).then(() =>{
        return Todoro.insertMany(todoros);
    }).then (() => {
        done();
    })
})

describe('POST /todoros', () => {
    it('should create a new todo', (done) => {
        var title = 'Test todoro title';

        request(app)
            .post('/todoros')
            .send({title})
            .expect(200)
            .expect((res) => {
                expect(res.body.title).toBe(title);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todoro.find({title}).then((todoros) => {
                    expect(todoros.length).toBe(1);
                    expect(todoros[0].title).toBe(title);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todoros')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todoro.find().then((todoros) => {
                    expect(todoros.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            
            })
    });
});

describe('GET /todoros', () => {
    it('should get all todoros', (done) => {
        request(app)
            .get('/todoros')
            .expect(200)
            .expect((res) => {
                expect(res.body.todoros.length).toBe(2)
            }).end(done);
    })
});

describe('GET /todoros/:id', () => {
    it('should return todoros doc', (done) => {
        request(app)
            .get(`/todoros/${todoros[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todoro.title).toBe(todoros[0].title)
            })
            .end(done)
    });

    it('should return a 404 if todoro not found', (done) => {
        let id = new ObjectID();
        request(app)
            .get(`/todoros/${id.toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return 400 for non-object ids', (done) => {
        request(app)
            .get('/todoros/123')
            .expect(400)
            .end(done)
    })

})