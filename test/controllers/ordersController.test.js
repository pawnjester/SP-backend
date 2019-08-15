import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import seed from '../seed/seed';
import { splitToken } from '../../utils/authenticate';

chai.use(chaiHttp);
chai.should()
const expect = chai.expect;
let token;
let orderID;
// console.log(token)

describe('TEST for orders', () => {
  before((done) => {
    chai.request(app)
    .post('/customers/login')
    .send(seed.updateUser)
    .end(( error, res ) => {
      token = res.body.accessToken
      done()
    })
  })
  it('POST /orders', (done) => {
    chai.request(app)
    .post('/orders')
    .set('user-key', splitToken(token))
    .send(seed.newOrder)
    .end(( error, res ) => {
      orderID = res.body.orderId
      console.log(orderID)
      expect(res.body).to.have.property('orderId')
      done()
    })
  });
  it('GET information about Order', (done) => {
    chai.request(app)
    .get(`/orders/${orderID}`)
    .end(( error, res ) => {
      expect(res.body.getInfo).to.not.be.empty
      done()
    })
  });
  it('GET orders by customer', (done) => {
    chai.request(app)
    .get('/orders/inCustomer')
    .set('user-key', splitToken(token))
    .end(( error, res ) => {
      expect(res.body.getOrdersByCustomer).to.not.be.empty
      expect(res.body.getOrdersByCustomer[0].name).to.eql('Mike')
      done()
    })
  });
  it('GET short information about orders', (done) => {
    chai.request(app)
    .get(`/orders/shortDetail/${orderID}`)
    .end(( error, res ) => {
      expect(res.body.getShortInfo).to.not.be.empty
      expect(res.body.getShortInfo[0]).to.have.property('order_id')
      expect(res.body.getShortInfo[0]).to.have.property('total_amount')
      expect(res.body.getShortInfo[0]).to.have.property('status')
      expect(res.body.getShortInfo[0]).to.have.property('name')
      done()
    })
  })
})
