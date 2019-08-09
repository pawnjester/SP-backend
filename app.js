import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import connection from './config/config';
import departments from './routes/departments';
import category from './routes/categories';
import attribute from './routes/attributes';
import product from './routes/products';
import order from './routes/orders';
import tax from './routes/tax';
import shipping from './routes/shipping';
import customer from './routes/customers';
import shopping from './routes/shoppingCart';
import stripe from './routes/stripe';
import passportConfig from './config/facebookConfig';


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', [
  departments,
  category,
  attribute,
  product,
  order,
  tax,
  shipping,
  customer,
  shopping,
  stripe ]);


const port = 3000;

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome Here'
  })
})

connection.getConnection(( error, connection ) => {
  if (error) {
    console.log(`An error occurred while connecting the DB ${error.message}`);
  } else {
    connection.release()
    app.listen(port,  () => {
      console.log('info', `Application has started on  ${port}`);
    });
  }
});

export default app;
