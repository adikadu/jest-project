const controller = require('../../controller/student_controller');
const model = require('../../model/student_model');
const httpMock = require('node-mocks-http');
const reqData = require('../../mockData/reqData.json');
const bcrypt = require('bcrypt');

model.findOne = jest.fn();
model.create = jest.fn();
bcrypt.genSalt = jest.fn();
bcrypt.hash = jest.fn();

let req, res, next;
beforeEach(()=>{
    model.findOne.mockClear();
    model.create.mockClear();
    bcrypt.genSalt.mockClear();
    bcrypt.genSalt.mockClear();
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
    req.body = {...reqData};
});

describe('Test Suite for controller createStudent', ()=>{
    test('Existance test', ()=>{
        expect(typeof controller.createStudent).toBe('function');
    });
    test('Create student wirh status of 201', async()=>{
        model.findOne.mockReturnValue(false);
        bcrypt.genSalt.mockReturnValue(10);
        bcrypt.hash.mockReturnValue("fakehashstring");
        model.create.mockReturnValue(reqData);
        await controller.createStudent(req, res, next);
        expect(model.findOne).toHaveBeenCalled();
        expect(bcrypt.genSalt).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalled();
        expect(model.create).toHaveBeenCalledWith(req.body);
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual(reqData);
    });
    test('student already exist status code 404', async()=>{
        model.findOne.mockReturnValue(true);
        await controller.createStudent(req, res, next);
        expect(model.findOne).toHaveBeenCalled();
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toBe("email alrady exist");
    });
    test('Test for the status code of 500', async()=>{
        model.findOne.mockReturnValue(false);
        bcrypt.genSalt.mockReturnValue(10);
        bcrypt.hash.mockReturnValue("fakehashstring");
        model.create.mockRejectedValue("fake exception from model.create");
        await controller.createStudent(req, res, next);
        expect(model.findOne).toHaveBeenCalled();
        expect(bcrypt.genSalt).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalled();
        expect(model.create).toHaveBeenCalledWith(req.body);
        expect(res.statusCode).toBe(500);
        expect(res._getData()).toBe("Error creating new Student");
    });
});