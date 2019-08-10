import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import seed from '../seed/seed';
import connection from '../../config/config';
import { splitToken } from '../../utils/authenticate';

chai.use(chaiHttp);
chai.should()
const expect = chai.expect;
let token;

describe('TEST for customers', () => {
  const query = `delete from customer`
  before((done) => {
    connection.query(query)
    done()
  })
  it('POST /customers', (done) => {
    chai.request(app)
    .post('/customers')
    .send(seed.newUser)
    .end(( error, res ) => {
      token = res.body.accessToken
      console.log(res)
      expect(res.body).to.have.property('accessToken')
      expect(res.body).to.have.property('expires_in')
      expect(res.body).to.have.property('customer')
      expect(res.body.customer.schema).to.have.property('customer_id')
      expect(res.body.customer.schema).to.have.property('name')
      expect(res.body.customer.schema).to.have.property('email')
      expect(res.body.customer.schema).to.have.property('credit_card')
      expect(res.body.customer.schema).to.not.have.property('password')
      done()
    })
  });
  it('PUT /customer', (done) => {
    chai.request(app)
    .put('/customer')
    .set('user-key', splitToken(token))
    .send(seed.updateUser)
    .end(( error, res ) => {
      expect(res.body).to.be.an('object')
      expect(res.body.customer).to.have.property('customer_id')
      expect(res.body.customer).to.have.property('name')
      expect(res.body.customer).to.have.property('email')
      expect(res.body.customer).to.have.property('credit_card')
      expect(res.body.customer).to.not.have.property('password')
      done()
    })
  });
  it('GET /customer', (done) => {
    chai.request(app)
    .get('/customer')
    .set('user-key', splitToken(token))
    .end(( error, res) => {
      expect(res.body.modifiedCustomer).to.have.property('customer_id')
      expect(res.body.modifiedCustomer).to.have.property('email')
      expect(res.body.modifiedCustomer).to.have.property('name')
      expect(res.body.modifiedCustomer).to.have.property('credit_card')
      expect(res.body.modifiedCustomer).to.not.have.property('password')
      done()
    })
  });
  it('POST /customers/login', (done) => {
    chai.request(app)
    .post('/customers/login')
    .send(seed.loginUser)
    .end(( error, res ) => {
      console.log("67", res)
      // expect(res.body.customer).to.be.an('object')
      // expect(res.body.customer).to.have.property('customer_id')
      // expect(res.body.customer).to.not.have.property('password')
      done()
    })
  })
})
