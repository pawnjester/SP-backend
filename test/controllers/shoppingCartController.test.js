import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import seed from '../seed/seed';

chai.use(chaiHttp);
chai.should()
const expect = chai.expect;
let itemId;

describe('TEST for Shopping Cart Controller', () => {
  it ('GET /shoppingcart/generateUniqueId', (done) => {
    chai.request(app)
    .get('/shoppingcart/generateUniqueId')
    .end(( error, res ) => {
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('cart_id')
      done()
    })
  });
  it ('POST /shoppingcart/add', (done) => {
    chai.request(app)
    .post('/shoppingcart/add')
    .send(seed.addProductToCart)
    .end(( error, res ) => {
      itemId = res.body.getProducts[0].item_id
      expect(res.body.getProducts).to.be.an('array')
      expect(res.body.getProducts).to.not.be.empty
      expect(res.body.getProducts[0]).to.have.property('attributes')
      expect(res.body.getProducts[0]).to.have.property('price')
      expect(res.body.getProducts[0]).to.have.property('quantity')
      expect(res.body.getProducts[0]).to.have.property('image')
      expect(res.body.getProducts[0]).to.have.property('subtotal')
      done()
    })
  });
  it('GET /shoppingcart/:cart_id', (done) => {
    chai.request(app)
    .get('/shoppingcart/OP4h3jNpK')
    .end(( error, res ) => {
      expect(res.body.getListOfProducts).to.not.be.empty
      expect(res.body.getListOfProducts).to.have.lengthOf(1)
      done()
    })
  });
  it('PUT /shoppingcart/update/:item_id', (done) => {
    chai.request(app)
    .put(`/shoppingcart/update/${itemId}`)
    .send(seed.updateCart)
    .end(( error, res ) => {
      expect(res.body.getProduct).to.not.be.empty
      expect(res.body.getProduct[0]).to.have.property('item_id')
      expect(res.body.getProduct[0]).to.have.property('name')
      expect(res.body.getProduct[0]).to.have.property('image')
      expect(res.body.getProduct[0]).to.have.property('price')
      expect(res.body.getProduct[0]).to.have.property('attributes')
      expect(res.body.getProduct[0]).to.have.property('subtotal')
      done()
    })
  });
  it('PUT /shoppingcart/update/:item_id with an invalid id', (done) => {
    chai.request(app)
    .put("/shoppingcart/update/800")
    .send(seed.updateCart)
    .end(( error, res ) => {
      expect(res.body.error).to.have.property('code')
      expect(res.body.error).to.have.property('message')
      expect(res.body.error).to.have.property('field')
      expect(res.body.error).to.have.property('status')
      done()
    })
  });
  it('GET /shoppingcart/totalAmount/:cart_id', (done) => {
    chai.request(app)
    .get('/shoppingcart/totalAmount/OP4h3jNpK')
    .end(( error, res ) => {
      console.log(res)
      expect(res.body.totalAmount).to.be.an('array')
      done()
    })
  })
  it('GET /shoppingcart/moveToCart/:item_id', (done) => {
    chai.request(app)
    .get(`/shoppingcart/moveToCart/${itemId}`)
    .end(( error, res ) => {
      done()
    })
  });
  it("GET /shoppingcart/saveForLater/item_id", (done) => {
    chai.request(app)
    .get(`/shoppingcart/saveForLater/${itemId}`)
    .end(( error, res ) => {
      done()
    })
  })
  it('DELETE /shoppingcart/empty/:cart_id', (done) => {
    chai.request(app)
    .delete('/shoppingcart/empty/OP4h3jNpK')
    .end(( error, res ) => {
      expect(res.body.emptyCart).to.be.an('array')
      expect(res.body.emptyCart).to.be.empty
      done()
    })
  });
  it('GET /shoppingcart/getSaved/:cart_id', (done) => {
    chai.request(app)
    .get('/shoppingcart/getSaved/OP4h3jNpK')
    .end(( error, res ) => {
      expect(res.body.getProducts).to.be.an('array')
      done()
    })
  });
})
