const express = require("express");

const {
    getReadDb,
    getWriteDb
} = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const db = getReadDb();

        const books = await db
            .collection("books")
            .find({})
            .toArray();

        res.render("books", {
            books,
            fullName: process.env.FULL_NAME,
            mssv: process.env.MSSV,
            vat: process.env.VAT
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy dữ liệu");
    }
});
router.post("/", async (req, res) => {

    try {

        const {
            productCode,
            name,
            price
        } = req.body;

        const prefix = process.env.PREFIX;

        // Kiểm tra tiền tố MSSV
        if (!productCode.startsWith(prefix)) {
            return res.status(400).send(
                `Mã sản phẩm phải bắt đầu bằng ${prefix}`
            );
        }

        const originalPrice = Number(price);

        const vatRate = Number(process.env.VAT) / 100;

        const finalPrice =
            originalPrice + originalPrice * vatRate;

        const book = {
            productCode,
            name,
            originalPrice,
            vatRate: Number(process.env.VAT),
            finalPrice,
            createdAt: new Date()
        };

        const db = getWriteDb();

        await db.collection("books").insertOne(book);

        res.redirect("/books");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Không thể thêm sách"
        );
    }
});

module.exports = router;
