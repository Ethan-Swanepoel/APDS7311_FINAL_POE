import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";  // Using ObjectId for string-based _id
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import checkauth from "../check-auth.mjs";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

// RegEx patterns
const namePattern = /^[A-Za-z\s]+$/;  // Letters only (spaces allowed)
const idPattern = /^\d{13}$/;  // Exactly 13 digits
const accountPattern = /^\d{16}$/;  // Exactly 16 digits
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;  // Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special char

// Validate input using RegEx patterns
function validateCustomerDetails({ full_name, identification_num, account_num, password }) {
    if (!namePattern.test(full_name)) return "Invalid full name: Letters only.";
    if (!idPattern.test(identification_num)) return "Invalid ID number: Must be 13 digits.";
    if (!accountPattern.test(account_num)) return "Invalid account number: Must be 16 digits.";
    if (!passwordPattern.test(password)) return "Invalid password: Must be 8 characters, including uppercase, lowercase, digit, and special character.";
    return null;  // No errors
}

// Get all customer details
router.get("/get_customer_details", checkauth, async (req, res) => {
    let collection = await db.collection("customer_details");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);  // Call status before send
});

// Register new customer details
router.post("/register_customer_details", async (req, res) => {
    try {
        const { full_name, identification_num, account_num, password } = req.body;

        // Validate input fields
        const validationError = validateCustomerDetails({ full_name, identification_num, account_num, password });
        if (validationError) {
            return res.status(400).send({ message: validationError });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); 

        // Create the customer document
        const newCustomer = {
            full_name,
            identification_num,
            account_num,
            password: hashedPassword
        };

        // Insert the new customer into the collection
        let collection = await db.collection("customer_details");
        let result = await collection.insertOne(newCustomer);

        // Return success response with inserted data
        res.status(201).send({ message: "Customer registered successfully", data: result });
    } catch (error) {
        console.error("Error registering customer:", error);
        res.status(500).send({ message: "Error registering customer" });
    }
});

// Login
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { full_name, account_num, password } = req.body;
    console.log(`Full name: ${full_name}, Account number: ${account_num}, Password: ${password}`);

    try {
        const collection = await db.collection("customer_details");

        // Find the customer by full_name and account_num
        const customer = await collection.findOne({ full_name, account_num });

        // If the customer is not found
        if (!customer) {
            return res.status(401).json({ message: "Authentication failed: Customer not found" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, customer.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed: Incorrect password" });
        }

        // Authentication successful, create a JWT token
        const token = jwt.sign(
            { full_name: customer.full_name, account_num: customer.account_num },
            "this_secret_should_be_longer_than_it_is",
            { expiresIn: "1h" }
        );

        // Respond with the token and customer details
        res.status(200).json({ message: "Authentication successful", token, full_name: customer.full_name });
        console.log("Your new token is", token);
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed due to server error" });
    }
});

// Update a record by id
router.patch("/:id", checkauth, async (req, res) => {
    const { full_name, identification_num, account_num } = req.body;

    // Validate input fields
    const validationError = validateCustomerDetails({ full_name, identification_num, account_num, password: "Valid123!" }); // Dummy valid password for update
    if (validationError) {
        return res.status(400).send({ message: validationError });
    }

    const query = { _id: new ObjectId(req.params.id.toString()) };  // Cast id to string
    const updates = {
        $set: {
            full_name,
            identification_num,
            account_num
        }
    };

    let collection = await db.collection("customer_details");
    let result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Customer not found" });
    }

    res.status(200).send({ message: "Customer updated", result });
});

// Get a single record by id
router.get("/:id", checkauth, async (req, res) => {
    const query = { _id: new ObjectId(req.params.id.toString()) };  // Cast id to string
    let collection = await db.collection("customer_details");
    let result = await collection.findOne(query);

    if (!result) {
        return res.status(404).send({ message: "Customer not found" });
    }

    res.status(200).send(result);
});

// Delete a record by id
router.delete("/:id", checkauth, async (req, res) => {
    const query = { _id: new ObjectId(req.params.id.toString()) };  // Cast id to string

    let collection = await db.collection("customer_details");
    let result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Customer not found" });
    }

    res.status(200).send({ message: "Customer deleted", result });
});

export default router;
