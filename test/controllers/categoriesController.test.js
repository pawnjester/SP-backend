import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);
chai.should()
const expect = chai.expect;

describe('TEST for Categories Controller', () => {
  it('GET categories without query params', (done) => {
    chai.request(app)
    .get('/categories')
    .end(( error, res ) => {
      res.body.should.be.an('object');
      expect(res.body).to.have.property('count')
      expect(res.body).to.have.property('rows')
      expect(res.body.rows).to.be.an('array')
      done()
    })
  });
  it('GET categories with params - limit, page and order', (done) => {
    chai.request(app)
    .get('/categories?limit=3&page=1&order=category_id')
    .end(( error, res ) => {
      res.body.should.be.an('object');
      expect(res.body).to.have.property('count')
      expect(res.body).to.have.property('rows')
      expect(res.body.rows).to.be.an('array')
      expect(res.body.rows).to.have.lengthOf(3)
      done()
    })
  });
  it('GET a single category', (done) => {
    chai.request(app)
    .get('/categories/1')
    .end(( error, res ) => {
      expect(res.body.getCategoryById).to.be.an('object')
      expect(res.body.getCategoryById).to.have.property('category_id')
      expect(res.body.getCategoryById).to.have.property('name')
      expect(res.body.getCategoryById).to.have.property('description')
      expect(res.body.getCategoryById).to.have.property('department_id')
      done()
    })
  });
  it('GET a single category with invalid id', (done) => {
    chai.request(app)
    .get('/categories/f')
    .end(( error, res ) => {
      expect(res.body.error).to.be.an('object')
      expect(res.body.error).to.have.status(422)
      expect(res.body.error.message).to.equal('The ID is not a number.')
      expect(res.body.error.field).to.equal('category_id')
      done()
    })
  });
  it('GET categories of a product', (done) => {
    chai.request(app)
    .get('/categories/inProduct/101')
    .end(( error, res ) => {
      expect(res.body.getCategoriesOfProduct).to.be.an('array')
      expect(res.body.getCategoriesOfProduct).to.have.lengthOf(1)
      done()
    })
  });
  it('GET categories of a product with invalid id', (done) => {
    chai.request(app)
    .get('/categories/inProduct/101f')
    .end(( error, res ) => {
      expect(res.body.error).to.be.an('object')
      expect(res.body.error).to.have.status(422)
      expect(res.body.error.message).to.equal('The ID is not a number.')
      expect(res.body.error.field).to.equal('product_id')
      done()
    })
  });
  it('GET categories of department', (done) => {
    chai.request(app)
    .get('/categories/inDepartment/1')
    .end(( error, res ) => {
      expect(res.body.getCategoriesOfDept).to.be.an('array')
      done()
    })
  });
  it('GET categories of a department with invalid id', (done) => {
    chai.request(app)
    .get('/categories/inDepartment/1f')
    .end(( error, res ) => {
      expect(res.body.error).to.be.an('object')
      expect(res.body.error).to.have.status(422)
      expect(res.body.error.message).to.equal('The ID is not a number.')
      expect(res.body.error.field).to.equal('department_id')
      done()
    })
  })
})
