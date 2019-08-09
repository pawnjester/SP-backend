import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);
chai.should()
const expect = chai.expect;

describe('Test For Tax Controller', () => {
  it('GET /tax', (done) => {
    chai.request(app)
    .get('/tax')
    .end(( error, res )=> {
      res.body.getAllTax.should.be.an('array')
      res.body.getAllTax.should.have.lengthOf(2)
      done()
    })
  });
  it('GET /tax/:tax_id', (done) => {
    chai.request(app)
    .get('/tax/1')
    .end(( error, res ) => {
      expect(res.body.getTaxById).to.not.be.empty
      expect(res.body.getTaxById).to.have.lengthOf(1)
      done()
    })
  });
  it('GET /tax/:tax_id with an invalid id', (done) => {
    chai.request(app)
    .get('/tax/f')
    .end(( error, res) => {
      expect(res.body.error).to.not.be.empty
      expect(res.body.error).to.have.property('status')
      expect(res.body.error).to.have.property('code')
      expect(res.body.error).to.have.property('message')
      expect(res.body.error).to.have.property('field')
      done()
    })
  });
})
