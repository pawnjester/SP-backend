import {  validateEmail } from "./generateId";
const validation = {
  departmentId (req, res, next) {
    const { department_id } = req.params
    if ( isNaN(department_id)) {
      return res.status(400).json({
        "error" : {
          "status" : 400,
          "code": "DEP_01",
          "message": "The ID is not a number.",
          "field": "department_id"
        }
      })
    }
    next()
  },
  attributeId (req, res, next) {
    const { attribute_id } = req.params
    if ( isNaN(attribute_id)) {
      return res.status(400).json({
        "error" : {
          "status" : 400,
          "code": "ATT_01",
          "message": "The ID is not a number.",
          "field": "attribute_id"
        }
      })
    }
    next()
  },
  taxId ( req, res, next) {
    const { tax_id } = req.params
    if (isNaN(tax_id)) {
      return res.status(400).json({
        "error" : {
          "status" : 400,
          "code": "TAX_01",
          "message": "The ID is not a number.",
          "field": "tax_id"
        }
      })
    }
    next()
  },
  productId ( req, res, next) {
    const {product_id} = req.params;
    if (isNaN(product_id)) {
      return res.status(400).json({
        "error" : {
          "status" : 400,
          "code": "PRO_01",
          "message": "The ID is not a number.",
          "field": "product_id"
        }
      })
    }
    next()
  },
  categoryId ( req, res, next) {
    const {category_id} = req.params;
    if (isNaN(category_id)) {
      return res.status(400).json({
        "error" : {
          "status" : 400,
          "code": "CAT_01",
          "message": "The ID is not a number.",
          "field": "category_id"
        }
      })
    }
    next()
  },
  shippingId ( req, res, next) {
    const { shipping_region_id } = req.params;
    if (isNaN(shipping_region_id)) {
      return res.status(400).json({
        "error" : {
          "status" : 400,
          "code": "SHI_01",
          "message": "The ID is not a number.",
          "field": "shipping_region_id"
        }
      })
    }
    next()
  },
  checkCreditCard ( req, res, next ) {
    const { credit_card } = req.body;
    let value = value.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    for (let i = value.length - 1; i >= 0; i--) {
      var digit = parseInt(value.charAt(i));

      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) == 0;
  },
  checkUserInput(req, res, next) {
    let { email, name,day_phone,
      eve_phone, mob_phone } = req.body;
    if(!email || !name || !eve_phone || !mob_phone || !day_phone) {
      return res.status(400).json({
        "code": "USR_02",
        "message": "The fields are required.",
        "field": "req.body",
        "status": "400"
      });
    }
    else if (!name.trim() || !email.trim()) {
      return res.status(400).json({
        "code": "USR_02",
        "message": "The fields(email or name) are required.",
        "field": "req.body",
        "status": "400"
      });
    } else if (!validateEmail(email.trim())) {
      return res.status(400).json({
        'code': 'USR_03',
        'message': 'The email is invalid.',
        'field': 'email',
        'status': '400'
      })
    } else if (!day_phone.trim() ) {
      return res.status(400).json({
        "code": "USR_02",
        "message": "The fields are required.",
        "field": "day_phone",
        "status": "400"
      });
    } else if (!eve_phone.trim() ) {
      return res.status(400).json({
        "code": "USR_02",
        "message": "The fields are required.",
        "field": "eve_phone",
        "status": "400"
      });
    } else if (!mob_phone.trim()) {
      return res.status(400).json({
        "code": "USR_02",
        "message": "The fields are required.",
        "field": "mob_phone",
        "status": "400"
      });
    }
    next()
  },
  updateCustomer (req, res, next ) {
    const {
      shipping_region_id,
      city,
      region,
      postal_code,
      country } = req.body
    let errorName;
    if (!shipping_region_id ) {
      return res.status(400).json({
        "code": "USR_02",
        "message": "The fields are required.",
        "field": "shipping_region_id",
        "status": "400"
      });
    }else if (!city) {
      return res.status(400).json({
        "code": "USR_02",
        "message": "The fields are required.",
        "field": "city",
        "status": "400"
      });
    }else if ( !region ) {
      return res.status(400).json({
        "code": "USR_02",
        "message": "The fields are required.",
        "field": "region",
        "status": "400"
      });
    }else if (!postal_code ) {
      return res.status(400).json({
        "code": "USR_02",
        "message": "The fields are required.",
        "field": "postal_code",
        "status": "400"
      });
    } else if (!country) {
      return res.status(400).json({
        "code": "USR_02",
        "message": "The fields are required.",
        "field": "country",
        "status": "400"
      });
    }
    else if (isNaN(shipping_region_id)) {
      return res.status(422).json({
        "error" : {
          "status" : 422,
          "code": "SHI_01",
          "message": "The ID is not a number.",
          "field": "shipping_region_id"
        }
      })
    }
    next()
  }
}

export default validation;
