const controller = require('../../controller/student_controller');
const model = require('../../model/student_model');
const httpMock = require('node-mocks-http');
const mockStudentList = require('../../mockData/student.json');

model.findById = jest.fn();
let req, res, next;
beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
});
afterEach(()=>{
    model.findById.mockClear();
});

describe('Test suite for controller', ()=>{
    test('Check if getStudentsById() exists or not', ()=>{
        expect(typeof controller.getStudentsbyId).toBe('function');
    });
    test('Test the getStudentsBy function of controller', async ()=>{
        req.params.id = mockStudentList[0]._id;
        model.findById.mockReturnValue(mockStudentList[0]);
        await controller.getStudentsbyId(req, res, next);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockStudentList[0]);
    });
    test('Test when getStudentsBy return null', async()=>{
        req.params.id = mockStudentList[0]._id;
        model.findById.mockReturnValue(null);
        await controller.getStudentsbyId(req, res, next);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toBe(404);
    });
    test('Exception case for getStudentsById', async()=>{
        req.params.id = mockStudentList[0]._id;
        model.findById.mockRejectedValue("fake Exception from findById");
        await controller.getStudentsbyId(req, res, next);
        expect(model.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toStrictEqual("fake Exception from findById");
    });
});