// for password encryption
const bcrypt = require('bcrypt');
// salt rounds to encrypt passwords
const saltRounds = 10;

// import models
const {Voter} = require('../models');

exports.index = async (req, res) => {
    try {
        const voter = await Voter.findAll();
        return res.json(voter);
    } catch (err) {
        return res.status(400).send({msg: "failed", error: err});
    }
}

exports.show = async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const {count, rows: voter} = await Voter.findAndCountAll({
            where: {uuid: uuid}
        });
        if (count < 1) {
            throw {msg: "Voter not found"};
        }
        return res.json(voter);
    } catch (err) {
        return res.status(400).send({msg: "failed", error: err});
    }
}

exports.delete = async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const {count} = await Voter.findAndCountAll({
            where: {uuid: uuid}
        });
        if (count < 1) {
            throw {msg: "Voter not found"};
        }
        await Voter.destroy({
            where: {uuid: uuid}
        });
        return res.json({msg: "deleted"});
    } catch (err) {
        return res.status(400).send({msg: "failed", error: err});
    }
}

exports.edit = async (req, res) => {
    const {uuid, firstname, lastname, email, password, cnic, dob, permanentAddress} = req.body;
    try {
        const {count} = await Voter.findAndCountAll({
            where: {uuid: uuid}
        });
        if (count < 1) {
            throw {msg: "Voter not found"};
        }
        await Voter.update({firstname, lastname, email, password, cnic, dob, permanentAddress}, {
            where: {uuid: uuid}
        });
        return res.json({msg: "edited"});
    } catch (err) {
        return res.status(400).send({msg: "failed", error: err});
    }
}

exports.create = (req, res) => {
    const {firstname, lastname, email, password, cnic, dob, permanentAddress} = req.body;
    try {
        bcrypt.hash(password, saltRounds, async (err, password) => {
            const voter = await Voter.create({firstname, lastname, email, password, cnic, dob, permanentAddress});
            return res.json(voter);
        });
    } catch(err) {
        res.status(400).send({msg: "failed", error: err});
    }
}