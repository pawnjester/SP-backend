import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);
chai.should()
const expect = chai.expect;

describe('Test For Attributes Controller', () => {
  it ('GET /attributes', (done) => {
    chai.request(app)
    .get('/attributes')
    .end((error, res) => {
      res.body.getAttributeList.should.be.an('array')
      done()
    })
  });
  it('GET /attributes/:attribute_id', (done) => {
    chai.request(app)
    .get('/attributes/1')
    .end(( error, res ) => {
      expect(res.body.getAttributeById).to.be.an('array')
      expect(res.body.getAttributeById).to.have.lengthOf(1)
      done()
    })
  })
  it('GET /attributes/:attribute_id with an invalid id', (done) => {
    chai.request(app)
    .get('/attributes/f')
    .end(( error, res) => {
      expect(res.body.error).to.not.be.empty
      expect(res.body.error).to.have.property('status')
      expect(res.body.error).to.have.property('code')
      expect(res.body.error).to.have.property('message')
      expect(res.body.error).to.have.property('field')
      done()
    })
  });
  it('GET /attributes/values/:attribute_id', (done) => {
    chai.request(app)
    .get('/attributes/values/1')
    .end(( error, res) => {
      res.body.getAttributeValueById.should.be.an('array')
      done()
    })
  });
  it('GET /attributes/values/:attribute_id with invalid id', (done) => {
    chai.request(app)
    .get('/attributes/values/1f')
    .end(( error, res ) => {
      expect(res.body.error).to.not.be.empty
      expect(res.body.error).to.have.property('status')
      expect(res.body.error).to.have.property('code')
      expect(res.body.error).to.have.property('message')
      expect(res.body.error).to.have.property('field')
      done()
    })
  });
  it('GET /attributes/inProduct/:product_id', (done) => {
    chai.request(app)
    .get('/attributes/inProduct/1')
    .end(( error, res ) => {
      expect(res.body.getAllAttributesProduct).to.be.an('array')
      done()
    })
  });
  it('GET /attributes/inProduct/:product_id with invalid id', (done) => {
    chai.request(app)
    .get('/attributes/inProduct/10f')
    .end(( error, res ) => {
      expect(res.body.error).to.not.be.empty
      expect(res.body.error).to.have.property('status')
      expect(res.body.error).to.have.property('code')
      expect(res.body.error).to.have.property('message')
      expect(res.body.error).to.have.property('field')
      done()
    })
  })
})
