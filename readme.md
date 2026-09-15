#Backend each folder with file work.

Folder: - config(for configuring upor setting up express with the thrid party apps like cloudinary, razorpay)
1. db.js : - function connectDB()
2. cloudinary.js : -  it is a set up of the cloudinary by config the name key and api secret key from the dotenv file.
3. razorpay.js : - it is a set up of the razorpay doing config().
4. cashfree.js : - cashfree payment gateway setting up the environment and the api key and secret key from .env.

Folder: -  Controller (That contains all the functions of the authentication , orders, products etc.)
1. authController.js = writes functions for authentication ex: - login register etc.
2. productController.js: -  this contains functions of the product realated such as create, update, delete,getproductid, getallProducts, and also while creating the function we need upload the cloudinary and connect it using the config().
3. orderController.js: -  this contains functions related to the orders in the website such as create, getallmyorders, getorderbyid, updateorderlists using the database.

4. paymentController.js: - this contains createOrder function and the verfiyPyament function , createorder creates the payment id that leads user to a checkout and verify payment function verifies the payment is compoleted for not.

5. analyticsController.js : - this fetches the data and displays the number of the total luse total order etc to the admin dashboard only.

Folder: -  Middleware(That contains all the middleware such as admin verify and the login token verify)
1. authMiddleware.js : -  jwt.verify the token for checking if the user is the logged in or not.
2. adminMiddleware.js : -  this contains a isAdmin const named middleware that checks if the user is admin or not using the req,res, next.


Folder  : -  Model (This is the database data creation schema then model)
1. user.js  :- to create the model of user.
2. order.js : -  model/order.js this is the schema and model of the orders containing fields such as the user, product, total amount etc. 
3. product :-  model/product.js this is the mongoose.model that creates the data of the product such as the name, descrption etc. 

Folder : -  Routes (This contians all the routes for the authControllers functions ).
1. authRoutes.js : -  use the functions of authentication with the routes like /register, /login importing the functions from authcontroller .
2. orderRoutes.js : -  that contains all the route with the middleware and the functions created in the orderController.
3. productRoutes.js: - that contains the route with the imports such as multer that creates the upload folder with all the images and uses the functions and and middleware in the routes .
4. paymentRoutes.js :- contains got the routes for the paymentcontroller such as /order , /verify
5. analyticsRoutes.js : -  contains routes for thhe analytics routes getAdminStatus.

Folder: -  uploads (all the images and doc in the cloudinary uploads here)
---images, videos, documents.etc
Folder: - utils ( this contains the any function we don't know where to put so we put it here.)
1. sendEmail.js: - it  uses the nodemailer to use the methods as createTramsport and send the email to the user and using the dotenv values.

seed.js:- this is a dummy data for each route data you can call it sample data.

Notes :- req gets updated  get(protect, myorders) here protect middleware updates the req and saves the user id in it that's makes it beneficial for the myoders function where we can fetch taht user by writeing user.req._id from the database. reference files are aorderrouters,js,orderController.js 


#Frontend

Folder : - Admin 

Folder : - Assets
Folder : - Components
Folder : - Context
Folder : - pages
Folder : - redux
Folder : - styles
