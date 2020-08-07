const controller = require('../../controller/student_controller');
const model = require('../../model/student_model');
const httpMock = require('node-mocks-http');
require('dotenv').config();
const mockStudentList = require('../../mockData/student.json');
const reqData = require('../../mockData/reqData.json')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const studentModel = require('../../model/student_model');

model.findOne = jest.fn();
bcrypt.compare = jest.fn();
jwt.sign = jest.fn();

let req, res, next;
beforeAll(()=>{
    model.findOne.mockClear();
    bcrypt.compare.mockClear();
    jwt.sign.mockClear();
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
    req.body = {...reqData};
});

describe('Test suite for controler studentlogin', ()=>{
    test('Existance test', ()=>{
        expect(typeof controller.studentLogin).toBe('function');
    });
    test('Test for successfull login, sataus code 200', async()=>{
        model.findOne.mockReturnValue(reqData);
        bcrypt.compare.mockReturnValue(true);
        jwt.sign.mockReturnValue('fakejwttoken');
        await controller.studentLogin(req, res, next);
        expect(model.findOne).toHaveBeenCalled();
        expect(bcrypt.compare).toHaveBeenCalled();
        expect(jwt.sign).toHaveBeenCalledWith({data: req.body}, process.env.JWT_SECRET, {expiresIn: '1h'});
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(reqData);
        expect(res._getHeaders()['auth-token']).toStrictEqual("fakejwttoken");
    });
    test('Test for student not present, sataus code 404', async()=>{
        model.findOne.mockReturnValue(false);
        await controller.studentLogin(req, res, next);
        expect(model.findOne).toHaveBeenCalled();
        expect(res.statusCode).toBe(404);
    });
    test('Test for invalid password, sataus code 404', async()=>{
        model.findOne.mockReturnValue(reqData);
        bcrypt.compare.mockReturnValue(false);
        await controller.studentLogin(req, res, next);
        expect(model.findOne).toHaveBeenCalled();
        expect(bcrypt.compare).toHaveBeenCalled();
        expect(res.statusCode).toBe(404);
    });
    test('Test for status code 500', async()=>{
        model.findOne.mockRejectedValue('fake rejection from model findOne');
        await controller.studentLogin(req, res, next);
        expect(res.statusCode).toBe(500);
    });
});