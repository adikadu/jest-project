const controller = require('../../controller/student_controller');
const model = require('../../model/student_model');
const httpMock = require('node-mocks-http');
const studentsMockList = require('../../mockData/student.json');
const { getAllStudents } = require('../../controller/student_controller');

model.find = jest.fn();
let req, res, next;

beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
});
afterEach(()=>{
    model.find.mockClear();
});

describe("Test getAllStudents", ()=>{
    test('Existance test', async()=>{
        expect(typeof controller.getAllStudents).toBe('function');
    });
    test('Test getAllStudents with entries in database', async()=>{
        model.find.mockReturnValue(studentsMockList);
        await getAllStudents(req, res, next);
        expect(model.find).toHaveBeenCalled();
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual(studentsMockList);
    });
    test('Test getAllStudents with no entries in database', async()=>{
        model.find.mockReturnValue(null);
        await getAllStudents(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toEqual('No students found');
    });
    test('Test getAllStudents for 500 status code', async()=>{
        model.find.mockRejectedValue("fake exception from find");
        await getAllStudents(req, res, next);
        expect(model.find).toHaveBeenCalled();
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toStrictEqual("fake exception from find");
    });
});
