const controller = require('../../controller/student_controller');
const model = require('../../model/student_model');
const httpMock = require('node-mocks-http');
const mockStudentList = require('../../mockData/student.json');

model.findByIdAndDelete = jest.fn();
let req, res, next;
beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
});
afterEach(()=>{
    model.findByIdAndDelete.mockClear();
});

describe('Test Suite for Delete student', ()=>{
    test("Existance test", ()=>{
        expect(typeof controller.deleteStudent).toBe('function');
    });
    test('Test for status of 200', async()=>{
        req.params.id = mockStudentList[0]._id;
        model.findByIdAndDelete.mockReturnValue(mockStudentList[0]);
        await controller.deleteStudent(req, res, next);
        expect(model.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(mockStudentList[0]);
    });
    test('Test for status of 404', async()=>{
        req.params.id = mockStudentList[0]._id;
        model.findByIdAndDelete.mockReturnValue(null);
        await controller.deleteStudent(req, res, next);
        expect(model.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toStrictEqual(`student with ${req.params.id} does not exist`);
    });
    test('Test for status of 500', async()=>{
        req.params.id = mockStudentList[0]._id;
        model.findByIdAndDelete.mockRejectedValue("fake rejected value from findByIdAndDelete");
        await controller.deleteStudent(req, res, next);
        expect(model.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toStrictEqual("fake rejected value from findByIdAndDelete");
    });
});