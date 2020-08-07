const router = require('express').Router();
const controller = require('../controller/student_controller');
const {authUser} = require('./authUser');

router.get('/', (req, res)=>{
    res.json({
        status: 'Hi from api-routes.',
        des: 'all routes are here.'
    });
});
router.post('/contact', controller.createStudent);
router.get('/contact', controller.getAllStudents);
router.get('/contact/:id', controller.getStudentsbyId);
router.put('/contact/:id',authUser, controller.updateStudentById);
router.delete('/contact/:id', controller.deleteStudent);
router.post('/contact/login', controller.studentLogin);

module.exports = router;