// for password encryption
const bcrypt = require('bcrypt');
// salt rounds to encrypt passwords
const saltRounds = 10;

// import models
const {Organizer} = require('../models');

exports.index = async (req, res) => {
    try {
        const organizers = await Organizer.findAll();
        return res.json(organizers);
    } catch (err) {
        return res.status(400).send({msg: "failed", error: err});
    }
}

exports.show = async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const {count, rows: organizer} = await Organizer.findAndCountAll({
            where: {uuid: uuid}
        });
        if (count < 1) {
            throw {msg: "Admin not found"};
        }
        return res.json(organizer);
    } catch (err) {
        return res.status(400).send({msg: "failed", error: err});
    }
}

exports.delete = async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const {count} = await Organizer.findAndCountAll({
            where: {uuid: uuid}
        });
        if (count < 1) {
            throw {msg: "organizer not found"};
        }
        await Organizer.destroy({
            where: {uuid: uuid}
        });
        return res.json({msg: "deleted"});
    } catch (err) {
        return res.status(400).send({msg: "failed", error: err});
    }
}

exports.edit = async (req, res) => {
    const {uuid, firstname, lastname, email, password, cnic, dob} = req.body;
    try {
        const {count} = await Organizer.findAndCountAll({
            where: {uuid: uuid}
        });
        if (count < 1) {
            throw {msg: "Admin not found"};
        }
        await Organizer.update({firstname, lastname, email, password, cnic, dob}, {
            where: {uuid: uuid}
        });
        return res.json({msg: "edited"});
    } catch (err) {
        return res.status(400).send({msg: "failed", error: err});
    }
}

exports.create = (req, res) => {
    const {firstname, lastname, email, password, cnic, dob} = req.body;
    try {
        bcrypt.hash(password, saltRounds, async (err, password) => {
            const organizer = await Organizer.create({firstname, lastname, email, password, cnic, dob});
            return res.json(organizer);
        });
    } catch(err) {
        res.status(400).send({msg: "failed", error: err});
    }
}