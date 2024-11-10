import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";  // Using ObjectId for string-based _id
import checkauth from "../check-auth.mjs";

const router = express.Router();

// RegEx patterns
const amountPattern = /^\d+(\.\d{1,2})?$/;  // Validates amounts like 100.00 or 0.99
const currencyPattern = /^[A-Z]{3}$/;        // Validates currency codes like USD, ZAR
const providerPattern = /^.+$/;               // Validates any non-empty string for provider
const swiftCodePattern = /^[A-Z0-9]{8,11}$/;  // Validates SWIFT code (8 or 11 alphanumeric characters)
const accountPattern = /^\w{16}$/;           // Validates recipient_account: 16 alphanumeric characters

// Validate input using RegEx patterns
function validatePaymentDetails({ recipient_account, amount, currency, provider, swift_code }) {
    if (!recipient_account || !accountPattern.test(recipient_account)) return "Invalid recipient account: Must be 16 alphanumeric characters.";
    if (!amountPattern.test(amount)) return "Invalid amount: Must be a valid decimal number.";
    if (!currencyPattern.test(currency)) return "Invalid currency: Must be a 3-letter uppercase code.";
    if (!providerPattern.test(provider)) return "Invalid provider: Must not be empty.";
    if (!swift_code || !swiftCodePattern.test(swift_code)) return "Invalid SWIFT code: Must be 8 or 11 alphanumeric characters.";
    return null;  // No errors
}

// Get all payment details
router.get("/get_payment_details", checkauth, async (req, res) => {
    let collection = await db.collection("payment_details");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);  // Call status before send
});

// Register new payment details (includes SWIFT code and recipient_account)
router.post("/register_payment_details", async (req, res) => {
    try {
        const { recipient_account, amount, currency, provider, swift_code } = req.body;

        // Validate input fields
        const validationError = validatePaymentDetails({ recipient_account, amount, currency, provider, swift_code });
        if (validationError) {
            return res.status(400).send({ message: validationError });
        }

        let newDocument = {
            recipient_account, // Store recipient account
            amount,
            currency,
            provider,
            swift_code  // Store SWIFT code with the payment details
        };

        let collection = await db.collection("payment_details");
        let result = await collection.insertOne(newDocument);
        res.status(201).send(result);  // Status 201 for Created
    } catch (error) {
        console.error("Error registering payment:", error);
        res.status(500).send({ message: "Error registering payment" });
    }
});

// Update a record by id
router.patch("/:id", checkauth, async (req, res) => {
    const query = { _id: new ObjectId(req.params.id.toString()) };  // Cast id to string

    const { recipient_account, amount, currency, provider, swift_code } = req.body;

    // Validate input fields
    const validationError = validatePaymentDetails({ recipient_account, amount, currency, provider, swift_code });
    if (validationError) {
        return res.status(400).send({ message: validationError });
    }

    const updates = {
        $set: {
            recipient_account, // Update recipient account
            amount,
            currency,
            provider,
            swift_code  // Update SWIFT code as well
        }
    };

    let collection = await db.collection("payment_details");
    let result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Payment not found" });
    }

    res.status(200).send({ message: "Payment updated", result });
});

// Get a single record by id
router.get("/:id", checkauth, async (req, res) => {
    const query = { _id: new ObjectId(req.params.id.toString()) };  // Cast id to string
    let collection = await db.collection("payment_details");
    let result = await collection.findOne(query);

    if (!result) {
        return res.status(404).send({ message: "Payment not found" });
    }

    res.status(200).send(result);
});

// Delete a record by id
router.delete("/:id", checkauth, async (req, res) => {
    const query = { _id: new ObjectId(req.params.id.toString()) };  // Cast id to string

    let collection = await db.collection("payment_details");
    let result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Payment not found" });
    }

    res.status(200).send({ message: "Payment deleted", result });
});

export default router;
