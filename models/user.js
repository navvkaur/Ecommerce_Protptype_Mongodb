const mongodb = require('mongodb');
const MongoConnect = require('../util/database')

class User {
constructor(username,email,cart,id){
  this.username = username;
  this.email=email;
  this.cart = cart;
  this._id = id;
}
save(){
  const db = MongoConnect.getDb()
  db.collection('users').insertOne(this).then((result)=>{
    console.log(result)
  }).catch((err)=>{
    console.log(err)
  })

}

addOrders(){
  const db = MongoConnect.getDb()
 return this.getCart().then(products=>{
    const order = {
      items:products,
      user:{
        _id:new mongodb.ObjectId(this._id),
        username: this.username
      }
    }
  
  return db.collection('order').insertOne(order).then((result)=>{
   this.cart = {items:[]}
   return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)},{$set:{cart:{items:[]}}})
  })
})
}

addToCart(product){
  
  const cartProductIndex=this.cart.items.findIndex(cp=>{
    return cp.productId == product._id.toString()

  });

  let newquantity = 1;
  const updatedCartItems = [...this.cart.items]
  
  if(cartProductIndex >= 0)
  {
    newquantity = (this.cart.items[cartProductIndex].quantity) +1;
    
    updatedCartItems[cartProductIndex].quantity = newquantity
  }
  else{
    updatedCartItems.push({productId :new mongodb.ObjectId(product._id),quantity : newquantity })
  }

  const db =MongoConnect.getDb()
  
  const updatedCart = {items:updatedCartItems}
 return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)},{$set:{cart:updatedCart}})
 .then((result)=>{
  console.log(result)
}).catch((err)=>{
  console.log(err)
})


}
  static findbyId(userId){
    const db = MongoConnect.getDb()
     return db.collection('users').find({_id:new mongodb.ObjectId(userId)}).next().then(user=>{
      console.log(user)
      return user;
    }).catch((err)=>{
      console.log(err)
    })
  }
   getCart(){
    const db = MongoConnect.getDb()
    
    const productIds = this.cart.items.map(i=>{
      return i.productId;
    })
     return db.collection('products').find({_id:{$in:productIds}}).toArray().then(product=>{
     return product.map(p=>{
      return {
        ...p,
        quantity:this.cart.items.find(i=>{
          return i.productId.toString() == p._id.toString();
      }).quantity
    }
     })
    }).catch((err)=>{
      console.log(err)
    })
  }

  deletefromcart(productId){
        let updatedCartItems = this.cart.items.filter(item=>{
          return item.productId.toString() !== productId.toString();
      })

      const db = MongoConnect.getDb()
      return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)},{$set:{cart:{items:updatedCartItems}}});

  }
  
getOrders(){
  const db = MongoConnect.getDb()
  return db.collection('order').find({'user._id':new mongodb.ObjectId(this._id)}).toArray();
}

}
module.exports = User;
