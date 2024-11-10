import express from "express";
import db from "../db/conn.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

// RegEx patterns
const usernamePattern = /^.+@portal\.com$/;  // Any characters followed by @portal.com
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;  // Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special char

// Validate input using RegEx patterns
function validateEmployeeDetails({ username, password }) {
    if (!usernamePattern.test(username)) return "Invalid username: Must end with @portal.com.";
    if (!passwordPattern.test(password)) return "Invalid password: Must be 8 characters long, contain uppercase, lowercase, number, and special character.";
    return null;  // No errors
}

// Register new employee details
router.post("/register_employee_details", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input fields
        const validationError = validateEmployeeDetails({ username, password });
        if (validationError) {
            return res.status(400).send({ message: validationError });
        }

        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password

        let newDocument = {
            username,
            password: hashedPassword
        };

        let collection = await db.collection("employee_details");
        let result = await collection.insertOne(newDocument);
        res.status(201).send(result);  // Status 201 for Created
    } catch (error) {
        console.error("Error registering employee:", error);
        res.status(500).send({ message: "Error registering employee" });
    }
});

// Login
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { username, password } = req.body;
    console.log(`Username: ${username}, Password: ${password}`);

    // Validate username and password format
    const validationError = validateEmployeeDetails({ username, password });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const collection = await db.collection("employee_details");

        // Find the employee by username
        const employee = await collection.findOne({ username });

        if (!employee) {
            return res.status(401).json({ message: "Authentication failed: Employee not found" });
        }

        const passwordMatch = await bcrypt.compare(password, employee.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed: Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: employee.username },
            "this_secret_should_be_longer_than_it_is",
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Authentication successful", token, username: employee.username });
        console.log("Your new token is", token);

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed due to server error" });
    }
});

export default router;
