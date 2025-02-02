import { pool } from "../models/db.js";

export const profileUpdate = async (req, res) => {
    const { url, User_Id } = req.body;
    try {
        const urlupdate = await pool.query("update users set profile_url=$1 where user_id=$2", [url, User_Id]);
        res.send({ success: `url:${urlupdate}` });
    } catch (err) {
        res.send({ error: "Database error" });
    }
};

export const CustomPlaces = async (req, res) => {
    const { id, User_Id, formData } = req.body;
    console.log(User_Id, formData);
    try {
        const customplaces = await pool.query("insert into custom_places (id,user_id,place_name,country,image_url,description,price,nearby_places) values($1,$2,$3,$4,$5,$6,$7,$8)  RETURNING *", [id, User_Id, formData.placeName, formData.country, formData.imgUrl, formData.description, formData.price, formData.nearByPlaces]);

        res.send({ success: customplaces.rows[0] });
    } catch (err) {
        console.error("Error adding custom place:", err);
        res.status(500).send({ error: "Database error", err });
    }
}

export const getCustomPlaces = async (req, res) => {
    const { User_Id } = req.query;
    console.log("UserId", User_Id);
    try {
        const customplaces = await pool.query("select * from custom_places where user_id=$1", [User_Id]);
        res.send({ success: customplaces.rows });
    } catch (err) {
        console.error("Error getting custom places:", err);
        res.status(500).send({ error: "Database error", err });
    }
}

export const deleteCustomPlace = async (req, res) => {
    const { id } = req.query;
    console.log(id);
    try {
        const deletedPlaces = await pool.query("delete from custom_places where id=$1 RETURNING *", [id]);
        // console.log(deletedPlaces.rows[0]);
        res.send({ success: deletedPlaces.rows[0]});
    } catch (err) {
        console.error("Error deleting custom place:", err);
        res.status(500).send({ error: "Database error", err });
    }
}