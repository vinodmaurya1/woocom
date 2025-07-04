const mongoose = require("mongoose");
const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cors = require('cors');
const path =  require("path")


const port = 5000 || process.env.PORT;


const corsOptions = {
  origin: ['http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
};


app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

mongoose.connect('mongodb://localhost:27017/woocom', {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/wp-json/wc/v3/auth", authRoutes);
app.use("/wp-json/wc/v3/products", productRoutes);


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
