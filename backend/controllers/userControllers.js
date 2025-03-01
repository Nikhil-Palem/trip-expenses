import dataset from "../../src/Dataset.js";
import { pool } from "../models/db.js";
import bcrypt from 'bcrypt';
// const saltRounds = 10;

export const profileUpdate = async (req, res) => {
    const { url, User_Id, name, email, lang, gender } = req.body;
    console.log(url, User_Id, name, email, lang, gender);

    try {
        // Updating users table
        const fields = [];
        const values = [];
        let index = 1;

        if (name) {
            fields.push(`user_name = $${index}`);
            values.push(name);
            index++;
        }
        if (email) {
            fields.push(`email = $${index}`);
            values.push(email);
            index++;
        }
        if (url) {
            fields.push(`profile_url = $${index}`);
            values.push(url);
            index++;
        }

        if (fields.length > 0) {
            values.push(User_Id);
            const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = $${index}`;
            await pool.query(query, values);
            res.send({ success: "Successfully updated name|email|profile_url" });
        }

        // Checking if personal_details exists
        const personalDetailsCheck = await pool.query("SELECT * FROM personal_details WHERE user_id = $1", [User_Id]);

        if (personalDetailsCheck.rows.length > 0) {
            const personalFields = [];
            const personalValues = [];
            let personalIndex = 1;

            if (lang) {
                personalFields.push(`language = $${personalIndex}`);
                personalValues.push(lang);
                personalIndex++;
            }
            if (gender) {
                personalFields.push(`gender = $${personalIndex}`);
                personalValues.push(gender);
                personalIndex++;
            }

            if (personalFields.length > 0) {
                personalValues.push(User_Id);
                const personalQuery = `UPDATE personal_details SET ${personalFields.join(', ')} WHERE user_id = $${personalIndex}`;
                await pool.query(personalQuery, personalValues);
                res.send({ success: "Successfully updated lang|gender" });
            }
        } else {
            // Insert into personal_details if not exists
            const insertPersonalDetailsQuery = `
                INSERT INTO personal_details (user_id, language, gender)
                VALUES ($1, $2, $3)
            `;
            await pool.query(insertPersonalDetailsQuery, [User_Id, lang, gender]);
            res.send({ success: "Inserted lang|gender successfully" });
        }
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).send({ error: "Database error" });
    }
};

export const CustomPlaces = async (req, res) => {
    const { id, User_Id, formData } = req.body;
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

    try {
        const deletedPlaces = await pool.query("delete from custom_places where id=$1 RETURNING *", [id]);

        res.send({ success: deletedPlaces.rows[0] });
    } catch (err) {
        console.error("Error deleting custom place:", err);
        res.status(500).send({ error: "Database error", err });
    }
}

export const getPlaces = async (req, res) => {
    const { id, User_Id } = req.query;

    try {
        const places = await pool.query("select * from custom_places where id=$1 and user_id=$2", [id, User_Id]);

        res.send({ success: places.rows[0] });
    } catch (err) {
        console.error("Error getting places:", err);
        res.status(500).send({ error: "Database error", err });
    }
}

export const addCurrentTrip = async (req, res) => {
    const { trip_id, User_Id } = req.body;
    try {
        const resp = await pool.query("insert into current_trip(trip_id,user_id) values($1,$2) RETURNING *", [trip_id, User_Id]);
        res.status(200).json({ success: resp.rows[0] });
    } catch (err) {
        console.log("database error", err);
    }
};

export const patchExpenses = async (req, res) => {
    const { newExpense, trip_id, User_Id, manage_id } = req.body;
    try {
        const result = await pool.query(
            "UPDATE current_trip SET expense = COALESCE(expense, '[]'::jsonb) || $1::jsonb WHERE trip_id = $2 AND user_id = $3 and id=$4 RETURNING *",
            [newExpense, trip_id, User_Id, manage_id]
        );
        res.status(200).send({ success: "Successfully added expense", data: result.rows[0] });
    } catch (err) {

        res.status(500).send({ error: "Failed to add expense", err });
    }
}

export const patchMembers = async (req, res) => {
    const { newMember, trip_id, User_Id, manage_id } = req.body;
    try {
        const result = await pool.query(
            "UPDATE current_trip SET members = COALESCE(members, '[]'::jsonb) || $1::jsonb WHERE trip_id = $2 AND user_id = $3 and id=$4 RETURNING *",
            [newMember, trip_id, User_Id, manage_id]
        );

        res.status(200).send({ success: "Successfully added member", data: result.rows[0] });
    } catch (err) {

        res.status(500).send({ error: "Failed to add member", err });
    }
}

export const fetchMembers = async (req, res) => {
    const { User_Id, CurrentTripId, manage_id } = req.query;
    try {
        const resp = await pool.query("select members from current_trip where trip_id=$1 and user_id=$2 and id=$3", [CurrentTripId, User_Id, manage_id]);

        res.send({ success: resp.rows[0] });
    } catch (err) {
        res.send({ error: "error fetching data" });
    }
}

export const fetchExpenses = async (req, res) => {
    const { User_Id, CurrentTripId, manage_id } = req.query;

    try {
        const resp = await pool.query("select expense from current_trip where trip_id=$1 and user_id=$2 and id=$3", [CurrentTripId, User_Id, manage_id]);

        res.send({ success: resp.rows[0] });
    } catch (err) {
        res.send({ error: "error fetching data" });
    }
}

export const fetchPastTrips = async (req, res) => {
    const { User_Id } = req.query;

    try {

        const tripsResp = await pool.query(
            `SELECT id as mid, trip_id FROM current_trip 
             WHERE user_id = $1 AND completed = $2`,
            [User_Id, true]
        );

        let pastTrips = [];

        for (const trip of tripsResp.rows) {
            const tripId = trip.trip_id;
            const mid = trip.mid;


            const customPlaceResp = await pool.query(
                `SELECT * FROM custom_places WHERE id::BIGINT = $1::BIGINT`,
                [tripId]
            );

            if (customPlaceResp.rows.length > 0) {
                pastTrips.push({ ...customPlaceResp.rows[0], mid });
            } else {

                const datasetPlace = dataset.places.find(place => place.id == tripId);
                if (datasetPlace) {
                    pastTrips.push({ ...datasetPlace, place_name: datasetPlace.name, image_url: datasetPlace.image, mid });
                }
            }
        }

        res.send({ success: pastTrips });
    } catch (err) {
        res.send({ error: "Error fetching past trips", err });
    }
};

export const fetchCurrentTrip = async (req, res) => {
    const { User_Id, id } = req.query;
    try {
        const resp = await pool.query(
            `SELECT t2.* ,t1.id as mid
            FROM current_trip t1 
            JOIN custom_places t2 ON t1.trip_id = t2.id::BIGINT
             WHERE t1.user_id = $1 and t1.trip_id=$2 AND t1.completed = $3`,
            [User_Id, id, false]
        );


        res.send({ success: resp.rows[0] });
    } catch (err) {
        res.send({ error: err })
    }
}

export const updateCompleteStatus = async (req, res) => {
    const { User_Id, trip_id, manage_id } = req.body;
    try {
        await pool.query("update current_trip set completed=$1 where trip_id=$2 and user_id=$3 and id=$4", [true, trip_id, User_Id, manage_id]);
        res.send({ success: "succesfully updated the completed status" });
    } catch (err) {
        res.send({ error: "error updating the status", err });
    }
}

export const getManageId = async (req, res) => {
    const { trip_id, User_Id } = req.query;
    console.log(trip_id, User_Id)
    try {
        const resp = await pool.query("select id from current_trip where trip_id=$1 and user_id=$2", [trip_id, User_Id]);
        res.send({ success: resp.rows[0] });
    } catch (err) {
        res.send({ error: "error fetching the manage id", err })
    }
}

export const delMyTrips = async (req, res) => {
    const { id, trip_id, User_Id } = req.query;
    try {
        await pool.query("delete from current_trip where id=$1 and trip_id=$2 and user_id=$3", [id, trip_id, User_Id]);
        res.send({ success: "trip was sucessfully deleted" });
    } catch (err) {
        res.send({ error: "error deleting the trips", err });
    }
}

export const fetchAllExpenses = async (req, res) => {
    const { user_id } = req.query;
    console.log(user_id);

    try {

        const tripsResp = await pool.query(
            `SELECT id as mid, trip_id,expense FROM current_trip 
             WHERE user_id = $1 AND completed = $2`,
            [user_id, true]
        );

        let pastTrips = [];

        for (const trip of tripsResp.rows) {
            const tripId = trip.trip_id;
            const mid = trip.mid;


            const customPlaceResp = await pool.query(
                `SELECT place_name FROM custom_places WHERE id::BIGINT = $1::BIGINT`,
                [tripId]
            );

            console.log("place name", customPlaceResp)
            if (customPlaceResp.rows.length > 0) {
                pastTrips.push({ ...customPlaceResp.rows[0], TripObj: trip.expense, mid });
            } else {

                const datasetPlace = dataset.places.find(place => place.id == tripId);
                if (datasetPlace) {
                    pastTrips.push({ place_name: datasetPlace.name, TripObj: trip.expense, mid });
                }
            }
        }

        res.send({ success: pastTrips });
    } catch (err) {
        res.send({ error: "Error fetching past trips", err });
    }
}

export const getDateComplete = async (req, res) => {
    const { CurrentTripId, User_Id, manage_id } = req.query;
    try {
        const resp = await pool.query("select created_at,completed from current_trip where user_id=$1 and trip_id=$2 and id=$3", [User_Id, CurrentTripId, manage_id]);
        res.status(200).send(resp.rows[0]);
    } catch (err) {
        res.status(500).send({ error: "error fetching data and complete", err });
    }
}

export const personal_details = async (req, res) => {
    const { User_Id, PhNo, Address, DOB } = req.body;
    try {

        const resp = await pool.query("SELECT * FROM personal_details WHERE user_id = $1", [User_Id]);
        if (resp.rows.length > 0) {
            const personalFields = [];
            const personalValues = [];
            let personalIndex = 1;
            if (PhNo) {
                personalFields.push(`phone_no = $${personalIndex}`);
                personalValues.push(PhNo);
                personalIndex++;
            }
            if (Address) {
                personalFields.push(`address = $${personalIndex}`);
                personalValues.push(Address);
                personalIndex++;
            }
            if (DOB) {
                personalFields.push(`dob = $${personalIndex}`);
                personalValues.push(DOB);
                personalIndex++;
            }
            if (personalFields.length > 0) {
                personalValues.push(User_Id);
                const personalQuery = `UPDATE personal_details SET ${personalFields.join(', ')} WHERE user_id = $${personalIndex}`;
                await pool.query(personalQuery, personalValues);
                res.send({ success: "Successfully updated phone_number|address|dob" });
            }
        } else {
            const insertPersonalDetailsQuery = `
                INSERT INTO personal_details (user_id, phone_no, address, dob)
                VALUES ($1, $2, $3, $4)
            `;
            await pool.query(insertPersonalDetailsQuery, [User_Id, PhNo, Address, DOB]);
            res.send({ success: "Inserted phone_number|address|dob successfully" });
        }

    } catch (err) {
        console.error("Error adding personal details:", err);
        res.status(500).send({ error: "Database error", err });
    }
}

export const changePswd = async (req, res) => {
    const { currPswd, newPswd ,User_Id} = req.body;
    try {
        const resp = await pool.query("select password from users where user_id=$1", [User_Id]);
        if (resp.rows.length > 0) {
            const hashedPassword = resp.rows[0].password;
            if(hashedPassword=='google'){
                res.send({ status: 400, message: "You have signed in with google, you cannot change password" });
                return;
            }
            const isMatch = await bcrypt.compare(currPswd, hashedPassword);
            const hashCurrPassword=await bcrypt.hash(newPswd, 10);

            if (isMatch) {
                await pool.query("update users set password=$1 where user_id=$2", [hashCurrPassword, User_Id]);
                res.send({ status: 200, message: "Password changed successfully" });
            } else {
                res.send({ status: 400, message: "Current password is incorrect" });
            }
        } else {
            res.send({ status: 400, message: "User not found" });
        }
    } catch (err) {
        res.send({ message: "database error",err });
        console.log(err);
    }
}