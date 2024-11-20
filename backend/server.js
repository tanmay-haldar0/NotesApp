import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import { connect_db } from './config/db.js';
import userRoutes from "./routes/user.route.js";
import notesRoutes from "./routes/notes.route.js";
import path from "path";

const app = express();
dotenv.config();

app.use(express.json());

app.use(cors({
    origin: "*",
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

app.listen(PORT,()=>{
    console.log("Server started at http://localhost:" + PORT); 
    connect_db();
});
 