import https from "https";
import fs from "fs";
import customers from "./routes/customer.mjs";
import payments from "./routes/payment.mjs";
import employee from "./routes/employee.mjs";
import express from "express";
import cors from "cors";

const PORT = 3001;
const app = express();

const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
}

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
    credentials: true
}));


app.use(express.json());

//app.use((req, res, next) => {
//    res.setHeader('Access-Control-Allow-Origin', '*');
//    res.setHeader('Access-Control-Allow-Headers', '*');
//    res.setHeader('Access-Control-Allow-Methods', '*');
//    next();
//});

// Use the defined route handlers
app.use("/customer", customers);
app.route("/customer", customers);
app.use("/payment", payments);
app.route("/payment", payments);
app.use("/employee", employee);
app.route("/employee", employee);

let server = https.createServer(options, app);
console.log(`Server running on port ${PORT}`);
server.listen(PORT);
