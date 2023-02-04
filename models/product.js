const mongodb = require('mongodb')
const MongoConnect = require('../util/database')


class Product {
  constructor(title,price,description,imageUrl,id,userId){
    this.title = title;
    this.price = price;
    this.description=description;
    this.imageUrl=imageUrl
    this._id = id;
    this.userId = userId;
  }
  save(){
    const db = MongoConnect.getDb()
    let dbop;
    if(this._id){
      dbop = db.collection('products').updateOne({_id: new mongodb.ObjectId(this._id)},{$set : this})
    }
    else{
dbop = db.collection('products').insertOne(this)
    }
    
    dbop.then((result)=>{
      console.log(result)
    }).catch((err)=>{
      console.log(err)
    })
  }
  static fetchAll(){
    const db = MongoConnect.getDb()
    return db.collection('products').find().toArray().then(products=>{
      
      return products;
    }).catch((err)=>{
      console.log(err)
    })
  }
  static findbyId(prodId){
    const db = MongoConnect.getDb()
    return db.collection('products').find({_id:new mongodb.ObjectId(prodId)}).next().then(product=>{
      console.log(product)
      return product;
    }).catch((err)=>{
      console.log(err)
    })
  }
  static deleteone(prodId){
    const db = MongoConnect.getDb()
    return db.collection('products').deleteOne({_id:new mongodb.ObjectId(prodId)}).then(product=>{
      console.log(product)

    }).catch((err)=>{
      console.log(err)
    })
}
}


module.exports = Product;
