import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { connect_db } from './config/db.js';
import userRoutes from "./routes/user.route.js";
import notesRoutes from "./routes/notes.route.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const app = express();

app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
}));

 
app.use("/api/user/", userRoutes);
app.use("/api/notes/", notesRoutes);


const _drname = path.resolve();
const PORT = process.env.PORT || 5000


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_drname, "/frontend/dist")));

    app.get("*", (req,res) =>{
        res.sendFile(path.resolve(_drname,"frontend","dist","index.html"));
    })
}

await connect_db();

app.listen(PORT,()=>{
    console.log("Server started at http://localhost:" + PORT); 
});
 
