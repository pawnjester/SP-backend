import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);
chai.should()
const expect = chai.expect;

describe('Test For Getting Department', () => {
  it('GET /departments', (done) => {
    chai.request(app)
    .get('/departments')
    .end((error, res) => {
      res.body.should.be.an('object')
      res.should.have.status(200)
      res.body.getDepartment.should.be.an('array')
      done()
    })
  });
  it('GET /departments/:department_id', (done) => {
    chai.request(app)
    .get('/departments/1')
    .end(( error, res ) => {
      res.body.should.be.an('object')
      res.should.have.status(200)
      res.body.getDeptById.should.be.an('array')
      expect(res.body.getDeptById).to.not.be.empty;
      expect(res.body.getDeptById).to.have.lengthOf(1)
      done()
    })
  });
  it('GET /departments/:department_id with an invalid id', (done) => {
    chai.request(app)
    .get('/departments/f')
    .end(( error, res) => {
      expect(res.body.error).to.not.be.empty
      expect(res.body.error).to.have.property('status')
      expect(res.body.error).to.have.property('code')
      expect(res.body.error).to.have.property('message')
      expect(res.body.error).to.have.property('field')
      done()
    })
  })
})
