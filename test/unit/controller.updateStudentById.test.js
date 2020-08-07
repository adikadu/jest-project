const controller = require('../../controller/student_controller');
const model = require('../../model/student_model');
const httpMock = require('node-mocks-http');
const mockStudentList = require('../../mockData/student.json');
const { updateStudentById } = require('../../controller/student_controller');

model.findOne = jest.fn();
model.findByIdAndUpdate = jest.fn();

let req, res, next;
beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
});
afterEach(()=>{
    model.findOne.mockClear();
    model.findByIdAndUpdate.mockClear();
});

describe("Test suite for controller updateStudentById", ()=>{
    test("Existence test", ()=>{
        expect(typeof controller.updateStudentById).toBe('function');
    });
    test('Email already exist test', async()=>{
        req.body.email = mockStudentList[0].email;
        model.findOne.mockReturnValue(mockStudentList[0]);
        await controller.updateStudentById(req, res, next);
        expect(model.findOne).toHaveBeenCalledWith({email: req.body.email});
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toStrictEqual('email already exist in database');
    });
    test('Email does not exit and return status of 201', async()=>{
        req.params.id = mockStudentList[0]._id;
        req.body = {...mockStudentList[0]};
        model.findOne.mockReturnValue(false);
        model.findByIdAndUpdate.mockReturnValue(mockStudentList[0]);
        await updateStudentById(req, res, next);
        expect(model.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, {useFindAndModify: false});
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual(mockStudentList[0]);
    });
    test('Email does not exit and return status of 404', async()=>{
        req.params.id = mockStudentList[0]._id;
        req.body = {...mockStudentList[0]};
        model.findOne.mockReturnValue(false);
        model.findByIdAndUpdate.mockReturnValue(false);
        await updateStudentById(req, res, next);
        expect(model.findByIdAndUpdate).toHaveBeenCalled(req.params.id, req.body, {useFindAndModify: false});
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toStrictEqual('student not found');
    });
    test('Exception case for updateStudentById', async ()=>{
        // req.body.email = mockStudentList[0]._id;
        model.findByIdAndUpdate.mockRejectedValue('Rejection for findOne');
        await updateStudentById(req, res, next);
        expect(model.findByIdAndUpdate).toHaveBeenCalled();
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toBe('Rejection for findOne');
    });
});