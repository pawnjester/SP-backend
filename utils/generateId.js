import shortId from 'shortid';


export const generateId = () => {
  const id = shortId.generate();
  return id;
}

export const isValidCard = (value) => {
  let newValue = value.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    // loop through values starting at the rightmost side
    for (let i = newValue.length - 1; i >= 0; i--) {
      var digit = parseInt(newValue.charAt(i));
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) == 0;
}

export const validateEmail = (email) => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


// export { generateId, isValidCard };
