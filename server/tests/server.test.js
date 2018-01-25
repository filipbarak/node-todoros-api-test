const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todoro} = require('./../models/todoro');
const {todoros, populateTodoros, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodoros);

describe('POST /todoros', () => {
    it('should create a new todo', (done) => {
        var title = 'Test todoro title';

        request(app)
            .post('/todoros')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todoros.length).toBe(1);
            }).end(done);
    })
});

describe('GET /todoros/:id', () => {
    it('should return todoros doc', (done) => {
        request(app)
            .get(`/todoros/${todoros[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todoro.title).toBe(todoros[0].title)
            })
            .end(done)
    });

    it('should not return todoros doc created by other user', (done) => {
        request(app)
            .get(`/todoros/${todoros[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should return a 404 if todoro not found', (done) => {
        let id = new ObjectID();
        request(app)
            .get(`/todoros/${id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should return 400 for non-object ids', (done) => {
        request(app)
            .get('/todoros/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(done)
    })

});

describe('DELETE /todoros/:id', () => {
    it('should remove a todo', (done) => {
        let hexId = todoros[1]._id.toHexString();

        request(app)
            .delete(`/todoros/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todoro._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todoro.findById(hexId).then(todoro => {
                    expect(todoro).toNotExist();
                    done();
                }).catch(err => {
                    done(err);
                })
            })
    });

    it('should return 404 if todoro not found', (done) => {
        let id = new ObjectID();
        request(app)
            .delete(`/todoros/${id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)

    });

    it('should return 400 if objectId is invalid', (done) => {
        request(app)
        .delete('/todoros/123')
        .set('x-auth', users[0].tokens[0].token)
        .expect(400)
        .end(done)
    })
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'example@example.com';
        let password = '123mnb!';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then(user => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch(e => {
                    done(e);
                })
            });
    });

    it('should return validation errors if request invalid', (done) => {
        let email = 'aaaa';
        let password = 'ffff';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end(done);

    });

    it('should not create user if email in use', (done) => {
        let email = users[0].email;
        let password = 'validpass123';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then(user => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => {
                    done(e);
                })
            });

    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'something'
            })
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end(done);
    })
});

describe('DELETE /users/me/token', () => {
    it('should delete the token', (done) => {
        let token = users[0].tokens[0].token;
        let id = users[0]._id;
        request(app)
            .delete('/users/me/token')
            .set('x-auth', token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
         })
    })
})