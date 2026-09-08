#Backend each file work
1. db.js : - function connectDB()

2. authController.js = writes functions for authentication ex: - login register etc.

3. user.js  :- to create the model of user.

4. authMiddleware.js : -  jwt.verify the token and the admin role

5. authRoutes.js : -  use the functions of authentication with the routes.

6. sendEmail.js : - function for the sending email using the nodemailer.

<!-- req gets updated  get(protect, myorders) here protect middleware updates the req and saves the user id in it that's makes it beneficial for the myoders function where we can fetch taht user by writeing user.req._id from the database. reference files are aorderrouters,js,orderController.js -->

