/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const Pet = require('../models/pet');

const fido = {
  'name': 'Norman',
  'species': 'Greyhound',
  'birthday': '2008-11-11',
  'favoriteFood': 'Liver',
  'avatar': 'https://cw-petespet.s3.us-west-1.amazonaws.com/pets/avatar09eaa59d-6b92-4316-b9e0-f477f6a36432-square.',
  'description': 'Fido is a dog and he\'s a good dog who loves to play and hang out with his owners. He also likes to nap and enjoys eating dog food',
};

chai.use(chaiHttp);

describe('Pets', () => {
  after(() => {
    Pet.deleteMany({$or: [{name: 'Norman'}, {name: 'Spider'}]}).exec((err, pets) => {
      console.log(pets, `Deleted ${pets.n} documents`);
    });
  });

  // TEST INDEX
  it('should index ALL pets on / GET', (done) => {
    chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
  });

  // TEST NEW
  it('should display new form on /pets/new GET', (done) => {
    chai.request(server)
        .get(`/pets/new`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
  });

  // TEST CREATE
  it('should create a SINGLE pet on /pets POST', (done) => {
    chai.request(server)
        .post('/pets')
        .send(fido)
        .end((err, res) => {
          Pet.findOne({name: fido.name}).name.should.not.be(null);
          done();
        });
  });

  // TEST SHOW
  it('should show a SINGLE pet on /pets/<id> GET', (done) => {
    const pet = new Pet(fido);
    pet.save((err, data) => {
      chai.request(server)
          .get(`/pets/${data._id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.html;
            done();
          });
    });
  });

  // TEST EDIT
  it('should edit a SINGLE pet on /pets/<id>/edit GET', (done) => {
    const pet = new Pet(fido);
    pet.save((err, data) => {
      chai.request(server)
          .get(`/pets/${data._id}/edit`)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.html;
            done();
          });
    });
  });


  // TEST UPDATE
  it('should update a SINGLE pet on /pets/<id> PUT', (done) => {
    const pet = new Pet(fido);
    pet.save((err, data) => {
      chai.request(server)
          .put(`/pets/${data._id}?_method=PUT`)
          .send({'name': 'Spider'})
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.html;
            done();
          });
    });
  });

  // TEST DELETE
  it('should delete a SINGLE pet on /pets/<id> DELETE', (done) => {
    const pet = new Pet(fido);
    pet.save((err, data) => {
      chai.request(server)
          .delete(`/pets/${data._id}?_method=DELETE`)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.html;
            done();
          });
    });
  });
  // TEST SEARCH
  it('should search for all pets with either that name or species', (done) => {
    chai.request(server)
        .get('/search?term=norman')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
  });

  // TEST JSON
  it('should list ALL pets on /pets GET', function(done) {
    chai.request(server)
        .get('/')
        .set('content-type', 'application/json')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          done();
        });
  });
});
