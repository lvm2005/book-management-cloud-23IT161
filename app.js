require("dotenv").config();

const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const { engine } = require("express-handlebars");

const { connectDatabases } = require("./config/database");
const bookRoutes = require("./routes/books");

const app = express();

app.engine(
    "handlebars",
    engine({
        defaultLayout: "main"
    })
);

app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
    session({
        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_WRITE_URI,
            dbName: process.env.DB_NAME,
            collectionName: "sessions"
        }),

        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60
        }
    })
);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDatabases();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();

app.use("/books", bookRoutes);