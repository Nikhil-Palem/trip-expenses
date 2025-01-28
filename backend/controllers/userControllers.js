import {pool} from "../models/db.js";

export const profileUpdate=async (req, res) => {
    const { url, User_Id } = req.body;
    try {
        const urlupdate = await pool.query("update users set profile_url=$1 where user_id=$2", [url, User_Id]);
        res.send({ success: `url:${urlupdate}` });
    } catch (err) {
        res.send({ error: "Database error" });
    }
};