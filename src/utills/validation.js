import validator from "validator"

function validateSignUpData(req) {
  const { username, emailId, password } = req.body;

  if (!username) {
    throw new Error("Name field should not be empty");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email id");
  }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    
    }
  }

  export default validateSignUpData;


