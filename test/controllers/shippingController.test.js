import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);
chai.should()
const expect = chai.expect;

describe('Test For Shipping Regions', () => {
  it('GET /shipping/regions', (done) => {
    chai.request(app)
    .get('/shipping/regions')
    .end(( error, res ) => {
      expect(res.body.getShippingRegion).to.be.an('array')
      done()
    })
  });
  it('GET /shipping/regions/:shipping_region_id', (done) => {
    chai.request(app)
    .get('/shipping/regions/2')
    .end(( error, res ) => {
      expect(res.body.getShippingRegById).to.be.an('array')
      done()
    })
  });
  it('GET /shipping/regions/:shipping_region_id with an invalid id', (done) => {
    chai.request(app)
    .get('/shipping/regions/f')
    .end(( error, res) => {
      expect(res.body.error).to.be.an('object')
      expect(res.body.error).to.not.be.empty
      expect(res.status).to.eql(422)
      done()
    })
  })
})
