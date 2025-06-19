import express from "express"
import cors from "cors";
import "dotenv/config"
import path from "path";
import { fileURLToPath } from 'url';
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

//middleware
app.use(express.json());

// Configure CORS more comprehensively
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Handle OPTIONS requests explicitly
app.options('*', cors());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//api endpoints
app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

// Debug route to check API connectivity
app.get("/api/status", (req, res) => {
  res.json({ status: "API is working", endpoints: [
    '/api/user',
    '/api/product',
    '/api/cart',
    '/api/order'
  ]});
});

app.get("/",(req,res)=>{
    res.send("API working")
});

app.listen(port,()=>{
    console.log(`Server started on PORT: ${port}`);
    console.log(`API is accessible at http://localhost:${port}`);
});

export default app;

