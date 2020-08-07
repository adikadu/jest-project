const studentModel = require('../model/student_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const saltRounds = 10;

const createStudent = async (req, res, next)=>{
    try{
        // console.log('Inside createStudent');
        const isPresent = await studentModel.findOne({email: req.body.email});
        if(isPresent) return res.status(404).json('email alrady exist');
        else {
            const salt = await bcrypt.genSalt(saltRounds);
            req.body.password = await bcrypt.hash(req.body.password, salt);
            const newStudent = await studentModel.create(req.body);
            res.status(201).json(newStudent);
        }
    } catch(err){
        console.log(err);
        res.status(500).send('Error creating new Student');
    }
};

const getAllStudents = async (req, res, next)=>{
    try{
        const students = await studentModel.find({});
        if(students && students.length>0) return res.status(201).json(students);
        return res.status(404).send('No students found');
    } catch(err) {
        res.status(500).json(err);
    }
}

const getStudentsbyId =  async (req, res, next)=>{
    try{
        const found = await studentModel.findById(req.params.id);
        if(found) return res.status(200).json(found);
        return res.status(404).json(`student with id ${req.params.id} is not present`);

    } catch(err){
        res.status(500).json(err);
    }
}

const updateStudentById = async (req, res, next)=>{
    try{
        if(req.body.email){
            const isPresent = await studentModel.findOne({email: req.body.email});
            if(isPresent) return res.status(404).json('email already exist in database');
        }
        const updatedStudent = await studentModel.findByIdAndUpdate(req.params.id, req.body, {useFindAndModify: false});
        if(updatedStudent) return res.status(201).json(updatedStudent);
        return res.status(404).json('student not found');
    } catch(err){
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res, next)=>{
    try{
        const deletedStudent = await studentModel.findByIdAndDelete(req.params.id);
        if(deletedStudent) return res.status(200).json(deletedStudent);
        return res.status(404).json(`student with ${req.params.id} does not exist`); 
    } catch(err){
        res.status(500).json(err);
    }
}

const studentLogin = async (req, res, next)=>{
    try{
        const student = await studentModel.findOne({email: req.body.email});
        if(student){
            const cmp = await bcrypt.compare(req.body.password, student.password);
            if(cmp){
                const token = await jwt.sign({data: student}, process.env.JWT_SECRET, {expiresIn: '1h'});
                res.header('auth-token', token);
                return res.status(200).json(student);
            }
            return res.status(404).json('check credentials'); 
        }
        return res.status(404).json('Invalid email');
    } catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    createStudent,
    getAllStudents,
    getStudentsbyId,
    updateStudentById,
    deleteStudent,
    studentLogin
};