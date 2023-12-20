const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

require('./database/config'); // Database
const productData = require('./database/productData'); // Collections
const userInfo = require('./database/userInfo'); // Collections
const carts = require('./database/userCarts') //collcetions
const purchased = require('./database/purchased')// collcetions
const locations = require('./database/location')
const sliderimage = require('./database/sliderphoto')



//getting images for slider
app.get('/sliderimage/:productname', async (req, resp) => {
    try {
        const productName = req.params.productname; // Trim whitespaces from the product name
        console.log('Product Name:', productName);

        // Use await to wait for the Mongoose query to complete
        const data = await sliderimage.find({ category: productName });

        // Extract image addresses from the data
      //  const addresses = data.map(item => item.images.map(img => img.address)).flat();

        console.log('Addresses:', data);

        resp.json(data);
    } catch (error) {
        console.error('Error fetching slider images:', error);
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});




//getting data of all products
app.get('/product-data/:productname', async (req, resp) => {
    try {
        const productType = req.params.productname;
        const data = await productData.find({ category: productType }).limit(6);
        resp.json(data);
    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});


// perchased products
app.post('/shopping', async (req, resp) => {
    try {
        const { name, email, totalprice, count } = req.body;
        console.log(name, email, totalprice, count)
        const added_product = new purchased({ name, email, totalprice, count });
        const saved_data = await added_product.save();

        // Respond with all fields in the saved data
        resp.json(saved_data);
    } catch (error) {
        console.error('Error:', error);
        resp.status(500).json({ error: "Internal Server Error" });
    }
});
// acccss perchaedproduct
app.get('/getshopingData/:email', async (req, resp) => {
    try {
        const email = req.params.email;
        const cartData = await purchased.find({ email: email });
        resp.json(cartData);

    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }

});

//register
app.post('/register', async (req, resp) => { // Changed route path to /register

    try {
        const { name, email, password } = req.body; // Data from the user
        const exist = await userInfo.findOne({ email }); // Checking if email is already present
        if (exist) {
            return resp.status(400).json({ error: 'Email is already registered' });
        }
        const newUser = new userInfo({ name, email, password }); // Creating a new user document
        const savedUser = await newUser.save(); // Saving into the database
        resp.json(savedUser);
    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});




//login
app.post('/login', async (req, resp) => {
    try {
        const { email, password } = req.body; // Data from the user
        const user = await userInfo.findOne({ email });
        if (!user) {
            return resp.status(200).json({ info: "user not found" });
        }
        if (user.password === password) {
            return resp.status(200).json({ info: 1 });
        } else {
            return resp.status(200).json({ info: "password not macth" });
        }
    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});


// adding data to carts
app.post('/addcarts', async (req, resp) => {
    try {
        const { productname, email } = req.body; // Getting data from users
        console.log("this is email", email)
        console.log("this is product name", productname)
        const addData = new carts({ email, productname }); // Converting into format
        const savedCarts = await addData.save(); // Data saved
        resp.json(savedCarts);
        console.log(savedCarts)
    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});

//showing carts

app.get('/getcartsData/:email', async (req, resp) => {
    try {
        const email = req.params.email;
        const cartData = await carts.find({ email: email });
        const Selected_data = cartData.map(item => item.productname)
        resp.json(Selected_data);

    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }

});

//set locations
app.post('/location', async (req, resp) => {
    try {
        const { email, location } = req.body;
        const exist = await locations.findOne({ email: email });

        if (exist === null) {
            const new_location = new locations({ email, location });
            const data = await new_location.save();
            resp.json(data);
        } else {
            resp.status(200).json({ error: 'Data is already existed' });
        }
    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});

//getloations
app.get('/getlocation/:email', async (req, resp) => {
    try {
        const email = req.params.email; // Retrieve email from request parameters
        const getdata = await locations.findOne({ email: email });

        if (!getdata) {
            resp.status(200).json({ error: 'Not found' });
        } else {
            const get_location = getdata.location;
            resp.json(get_location);
        }
    } catch (error) {
        resp.status(500).json({ error: 'Internal server error' });
    }
});



// serach products
app.get('/search/:searchProduct', async (req, res) => {
    try {
        const { searchProduct } = req.params;

        // Using a regular expression to perform a case-insensitive search
        const regex = new RegExp(searchProduct, 'i');

        // Find products that match the category using the regex
        const selected = await productData.find({ category: regex });

        res.json(selected);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
