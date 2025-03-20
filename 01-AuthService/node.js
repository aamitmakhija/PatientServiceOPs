const bcrypt = require('bcryptjs');

const plainPassword = 'alpha123'; // Entered password from the login form
const storedHash = "$2a$10$OZaeOLpIq12h23OuICxUguNjrGSBXaAhZOa2soNBo/Rpnt6flN4NW"; // The stored hash in MongoDB

bcrypt.compare(plainPassword, storedHash).then(isMatch => {
  console.log("Password match result:", isMatch); // Should print `true`
}).catch(err => console.log(err));