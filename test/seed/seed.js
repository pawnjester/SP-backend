const seed = {
  newOrder : {
    cart_id: "FuA7lUyQg",
    shipping_id: 4,
    tax_id: 2
  },
  newReview :{
    review: "Nice Footwear",
    rating: 5,
    product_id: 2,
    customer_id: 1,
    created_on: '2019-08-06 03:11:50'
  },
  newUser: {
    name: 'Philip',
    email: 'phil@example.com',
    password: 'phil123'
  },
  updateUser: {
    name: 'Mike',
    email: 'mike@example.com',
    day_phone: '+351323213511235',
    eve_phone: '+452436143246123',
    mob_phone: '+351323213511235'
  },
  loginUser: {
    email: 'phil@example.com',
    password: 'phil123'
  },
  updateAddress: {
    address_1: "shalewa",
    city: "Lagos",
    region: "TR",
    postal_code: 2334,
    country: "Nigeria",
    shipping_region_id: 45
  },
  badUpdateAddress: {
    address_1: "shalewa",
    city: "Lagos",
    region: "TR",
    postal_code: 2334,
    country: "Nigeria",
    shipping_region_id: "4f"
  },
  updateCreditCard: {
    credit_card: '5555555555554444'
  },
  updateFakeCreditCard: {
    credit_card: '5555554555554444'
  },
  addProductToCart: {
    cart_id: 'OP4h3jNpK',
    product_id: 12,
    attributes: 'Large, winter',
    quantity: 2,
    buy_now: 1
  },
  updateCart: {
    quantity: 8
  }
}

export default seed
