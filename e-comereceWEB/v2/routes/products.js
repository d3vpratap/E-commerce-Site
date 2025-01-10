const express = require('express');
const router = express.Router(); //mini express application.
const Product = require('../models/products');
const {isLoggedIn} = require('../middleware');
const User = require('../models/user');


//Get all products
router.get('/products',async(req,res)=>{
         const products =  await  Product.find({});
        res.render('products/index',{products});
});
router.get('/product/new',isLoggedIn,(req,res)=>{
    res.render('products/new');
})
router.post('/products',isLoggedIn,async(req,res)=>{
    try{
            const {name ,price,desc,img} = req.body;
        await Product.create({name,price,desc,img});
        req.flash('success','Product Created Succesfully!');
        res.redirect('/products');
    }
    catch(e){
        req.flash('error','Product cannot be created');
        res.redirect('/products/new');
    }
    
})
router.get('/products/:productid',isLoggedIn,async(req,res)=>{
    const {productid} = req.params;
    const product = await Product.findById(productid).populate('reviews');
    // console.log(product);
    res.render('products/show',{product});
})
router.get('/products/:productid/edit',isLoggedIn,async(req,res)=>{
    const{productid} = req.params;
    const product = await Product.findById(productid);
    res.render('products/edit',{product});
})
router.patch('/products/:productid', isLoggedIn, async (req, res) => {
    const { productid } = req.params;
    const { name, price, img, desc } = req.body;
    const cart  = req.body;
    console.log(cart);
    try {
        // Update the product in the Product collection
        await Product.findByIdAndUpdate(productid, { name, price, img, desc });

        // Update product details in all carts containing this product

        req.flash('success', 'Product changes saved and updated in carts!');
        res.redirect(`/products/${productid}`);
    } catch (err) {
        console.error('Error updating product or cart:', err);
        req.flash('error', 'Could not update product information!');
        res.redirect(`/products/${productid}/edit`);
    }
});

router.delete('/products/:productid',isLoggedIn,async(req,res)=>{
    const {productid} = req.params;
    await Product.findByIdAndDelete(productid);
    res.redirect('/products');
})

module.exports = router;