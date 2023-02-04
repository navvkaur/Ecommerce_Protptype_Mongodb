const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

 const errorController = require('./controllers/error');

 const Product = require('./models/product');
 const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

 const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const mongoose=require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

 app.use((req, res, next) => {
  User.findById('63de7c6cfcc7e404e10a4515')
    .then(user => {
      req.user = new User({name:user.name,email:user.email,cart:user.cart,_id:user._id})
      next();
    })
    .catch(err => console.log(err));

});

app.use('/admin', adminRoutes);
 app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://admin:navneet@cluster0.s8mk5ia.mongodb.net/shop?retryWrites=true&w=majority').then((result)=>{

// const user = new User({
//   name: 'admin',
//   email:'admin@gmail.com',
//    cart : {
//     items:[]
//   } 
// }) 
//  user.save();
app.listen(3000)
}).catch((err)=>{
  console.log(err);
})