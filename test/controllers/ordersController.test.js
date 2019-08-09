import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import seed from '../seed/seed';

chai.use(chaiHttp);
chai.should()
const expect = chai.expect;

describe('TEST for orders', () => {
  // it('POST /orders', (done) => {
  //   chai.request(app)
  //   .post('/orders')
  //   .send(seed.newOrder)
  //   .end(( error, res ) => {
  //     console.log(res)
  //   })
  // })
})
