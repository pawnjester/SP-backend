import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import seed from '../seed/seed';

chai.use(chaiHttp);
chai.should()
const expect = chai.expect;

describe('Test For Product Controller', () => {
  it ('GET /products/:product_id', (done) => {
    chai.request(app)
    .get('/products/2')
    .end(( error, res) => {
      expect(res.body).to.be.an('object')
      expect(res.body.getProduct).to.have.property('product_id')
      expect(res.body.getProduct).to.have.property('name')
      expect(res.body.getProduct).to.have.property('description')
      expect(res.body.getProduct).to.have.property('price')
      expect(res.body.getProduct).to.have.property('discounted_price')
      expect(res.body.getProduct).to.have.property('image')
      expect(res.body.getProduct).to.have.property('image_2')
      expect(res.body.getProduct).to.have.property('thumbnail')
      expect(res.body.getProduct).to.have.property('display')
      done()
    })
  });
  it( 'GET /products/:product_id/details', (done) => {
    chai.request(app)
    .get('/products/2/details')
    .end(( error, res ) => {
      expect(res.body).to.be.an('object')
      done()
    })
  });
  it ('GET /products/:product_id/details returns an error with invalid id', (done) => {
    chai.request(app)
    .get('/products/2d/details')
    .end(( error, res ) => {
      expect(res.body.error).to.be.an('object')
      done()
    })
  });
  it('GET /products', (done) => {
    chai.request(app)
    .get('/products')
    .end(( error, res ) => {
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('count')
      expect(res.body).to.have.property('rows')
      expect(res.body.rows).to.be.an('array')
      expect(res.body.rows).to.have.lengthOf(20)
      done()
    })
  });
  it('GET /products with params limit,page and description_length', (done) => {
    chai.request(app)
    .get('/products?limit=10&page=5&description_length=300')
    .end(( error, res ) => {
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('count')
      expect(res.body).to.have.property('rows')
      expect(res.body.rows).to.be.an('array')
      expect(res.body.rows).to.have.lengthOf(10)
      done()
    })
  });
  it('GET /products/inCategory/:category_id', (done) => {
    chai.request(app)
    .get('/products/inCategory/2')
    .end(( error, res ) => {
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('count')
      expect(res.body).to.have.property('rows')
      expect(res.body.rows).to.be.an('array')
      done()
    })
  });
  it('GET /products/inCategory/:category_id', (done) => {
    chai.request(app)
    .get('/products/inCategory/2?limit=5&page=1')
    .end(( error, res ) => {
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('count')
      expect(res.body).to.have.property('rows')
      expect(res.body.rows).to.be.an('array')
      expect(res.body.rows).to.have.lengthOf(5)
      done()
    })
  });
  it('GET /products/inDepartment/:department_id', (done) => {
    chai.request(app)
    .get('/products/inDepartment/3')
    .end(( error, res ) => {
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('count')
      expect(res.body).to.have.property('rows')
      expect(res.body.rows).to.be.an('array')
      done()
    })
  });
  it('GET /products/inDepartment/:department_id with invalid id', (done) => {
    chai.request(app)
    .get('/products/inDepartment/3f')
    .end(( error, res ) => {
      expect(res.body.error).to.be.an('object')
      expect(res.body.error).to.not.be.empty
      done()
    })
  });
  it('GET /products/inDepartment/:department_id with params', (done) => {
    chai.request(app)
    .get('/products/inDepartment/3?limit=2&page=2')
    .end(( error, res ) => {
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.property('count')
      expect(res.body).to.have.property('rows')
      expect(res.body.rows).to.be.an('array')
      expect(res.body.rows).to.have.lengthOf(2)
      done()
    })
  });
  it('GET /products/:product_id/details', (done) => {
    chai.request(app)
    .get('/products/2/details')
    .end(( error, res ) => {
      expect(res.body).to.be.an('object')
      expect(res.body.detailsResult).to.have.property('product_id')
      expect(res.body.detailsResult).to.have.property('name')
      expect(res.body.detailsResult).to.have.property('description')
      expect(res.body.detailsResult).to.have.property('price')
      expect(res.body.detailsResult).to.have.property('discounted_price')
      expect(res.body.detailsResult).to.have.property('image')
      expect(res.body.detailsResult).to.have.property('image_2')
      done()
    })
  });
  it('GET /products/:product_id/details with invalid id', (done) => {
    chai.request(app)
    .get('/products/y/details')
    .end(( error, res ) => {
      expect(res.body.error).to.be.an('object')
      expect(res.body.error).to.not.be.empty
      done()
    })
  });
  it('GET /products/:product_id/locations', (done) => {
    chai.request(app)
    .get('/products/1/locations')
    .end(( error, res ) => {
      expect(res.body.getLocationOfProduct).to.be.an('object')
      expect(res.body.getLocationOfProduct).to.have.property('category_id')
      expect(res.body.getLocationOfProduct).to.have.property('category_name')
      expect(res.body.getLocationOfProduct).to.have.property('department_id')
      expect(res.body.getLocationOfProduct).to.have.property('department_name')
      done()
    })
  });
  // it('POST /products/:product_id/reviews', (done) => {
  //   chai.request(app)
  //   .post('/products/1/reviews')
  //   .send(seed.newReview)
  //   .end(( error, res ) => {
  //     console.log(res)
  //     done()
  //   })
  // })
  it ('GET /products/:product_id/reviews', (done) => {
    chai.request(app)
    .get('/products/1/reviews')
    .end(( error, res ) => {
      expect(res.body.getReviews).to.be.an('array')
      done()
    })
  });
})
