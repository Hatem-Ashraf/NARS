# NARS

# How to deal with apis

## faculty competences:

create competense
http://localhost:8085/facultyComp
methode:post
[
{
"code": "FAC001",
"description": "Teaching Techniques",
"level": "A"
},
{
"code": "FAC002",
"description": "Curriculum Development",
"level": "A"
},
{
"code": "FAC003",
"description": "Assessment Methods",
"level": "A"
}
]

get all competenses
http://localhost:8085/facultyComp

updatecompetence by id
http://localhost:8085/updateFacultyComp/<id>
{
"code": "MC4",
"description": "Faculty Competence 4 Description",
"level": "A"
}

delete competence
http://localhost:8085/deleteFacultyComp/<id>

getCompetence by id
http://localhost:8085/facultyComp/<id>

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

## faculty:

add faculty,get all faculties:
http://localhost:8083
json:
{
"name": " Faculty of Engineering",
"dean": "rana195387@feng.bu.edu.eg",
"about": "engineering is important",
"competences": ["65f5ee81964ffe6361a4fcad", "65f5eecf964ffe6361a"]
}

update,getfacultybyid,delete:
http://localhost:8083/<id>

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
department competences:
create competence,get all competences:
http://localhost:8085/departmentComp
json:
[6+3
{
"code": "COMPJK",
"description": "Software Development Fundamentals",
"level": "B"
},
{
"code": "COMPMF",
"description": "Database Management Systems",
"level": "B"
},
{
"code": "COMPPO",
"description": "Network Security",
"level": "B"
}
]

get comp:
http://localhost:8085/departmentComp/<id>
update:
http://localhost:8085/updateDepComp/<id>

delete
http://localhost:8085/deleteDepComp/<id>

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

## department:

add department,get all department
http://localhost:8084
json:
{
"name": "Department of Computer Science",
"code": "CS",
"about": "computer science for better future.",
"departmentHead": "hatem195301@feng.bu.edu.eg",
"competences": ["65f5ee81964ffe6361a4fcad", "65f5eee9964ffe6361a4fcb1"],
"facultyId": "65eb1d67d1555f7450c9a027",
"vision": "To be a leader in computer science education and research.",
"mission": "To provide high-quality education and conduct innovative research in computer science."
}

update,delete,get department by id:
http://localhost:8084/<id>

search bar request
http://localhost:8084/searchDep?facultyId=65eb200ed1555f7450c9a02b&code=DEP103

get department by faculty id, or getting all the departments under certain faculty
http://localhost:8084/getDepartmentsByFaculty/65f60110f95cd7a5e3c17e56

# get all departments at the same time

http://localhost:8084/getDepByFaculties
{
"facultyIds": ["65eb1d67d1555f7450c9a027","65f60110f95cd7a5e3c17e56"]
}
/////////////////////////////

## department coordinator

addProgram : POST http://localhost:8086/  
json : {
"name": "Computer Science 1",
"competences": [
{
"code": "CS100",
"description": "Introduction to Computer Science"
},
{
"code": "CS202",
"description": "Data Structures and Algorithms"
}
]
}

getAllPrograms : GET http://localhost:8086/

getProgram : GET http://localhost:8086/:id

updateProgram : patch http://localhost:8086/:id
JSON : {
"name": "Computer Science ",
"competences": [
{
"code": "CS100",
"description": "Introduction to Computer Science"
},
{
"code": "CS202",
"description": "Data Structures and Algorithms"
}
]
}

deleteProgram : delete http://localhost:8086/:id

////////////////////////////////////////////////////

# program competences

createProgramComp: POST http://localhost:8085/programComp/
JSON :
[
{
"code": "comp1",
"description": "Description of comp1",
"level": "C"
},
{
"code": "comp2",
"description": "Description of comp2",
"level": "C"
},
{
"code": "comp3",
"description": "Description of comp3",
"level": "C"
}
]

getAllProgramCompetences: GET http://localhost:8085/programComp/

deleteProgramCompetence: delete http://localhost:8085/deleteProComp/:id

updateProgramCompetence: put http://localhost:8085/updateProComp/:id
JSON :
{
"code": "comp3",
"description": "Description of comp3",
"level": "C"
}

getProgramCompetenceById: GET http://localhost:8085/programComp/:id

///////////////////////////

# program Objective

createProgramObjective:POST http://localhost:8085/programObj/
JSON :
[
{
"code": "obj1",
"description": "Description of objective 1"
},
{
"code": "obj2",
"description": "Description of objective 2"
},
{
"code": "obj3",
"description": "Description of objective 3"
}
]

getAllProgramObjectives:GET http://localhost:8085/programObj/

deleteProgramObjective:delete http://localhost:8085/deleteProObj/:id

updateProgramObjective:put http://localhost:8085/updateProObj/:id

getProgramObjectiveById:GET http://localhost:8085/programObj/:id

# staff

- get staff by id: GET http://localhost:8081/staff/id
- get all department admins by facultyId: GET http://localhost:8081/depAdmins
  {
  "facultyId": "65eb1d67d1555f7450c9a027"
  }

newDepartmentAdmin : POST http://localhost:8081/newDepartmentAdmin
JSON :
{
"name":"sayed",
"email":"said1234@feng.bu.edu.eg",
"faculty":"65eb1d67d1555f7450c9a027",
"department":"65eb337db351e20dc76a9134",
"roles":"department admin"
}

newProgramAdmin : POST http://localhost:8081/newProgramAdmin
JSON :
{
"name":"sayed",
"email":"said1@feng.bu.edu.eg",
"faculty":"65eb1d67d1555f7450c9a027",
"department":"65eb337db351e20dc76a9134",
"roles":"program admin",
"program":"65d7b844a5a017b149d2ed0d"
}

newInstructor : POST http://localhost:8081/newInstructor
JSON :
{
"name":"sayed",
"email":"said12@feng.bu.edu.eg",
"faculty":"65eb1d67d1555f7450c9a027",
"department":"65eb337db351e20dc76a9134",
"roles":"instructor",
"program":"65d7b844a5a017b149d2ed0d"
}

newQualityCoordinator : POST http://localhost:8081/newQualityCoordinator
JSON :
{
"name":"sayed",
"email":"said123@feng.bu.edu.eg",
"faculty":"65eb1d67d1555f7450c9a027",
"roles":"quality coordinator"
}

##################################################################################################

#FOR PETER
program coordinator APIS
create Course , get all courses:
http://localhost:8087/newCourse

json:
{
"name": "Software Engineering",
"code": "CS450",
"hours": 4,
"program": "65eb2803478252cb316569c2"
}
delete,update,get course by id
http://localhost:8087/newCourse/<courseid>

get all courses under certain program
http://localhost:8087/getCoursesByProgramId/<programId>

assign instructor to course or mutiple courses
http://localhost:8087/assign-course-instructor
{
"instructorId": "65cb5ae3140600eebac07fc0",
"courseIds": ["65f8caa91c297968e2db0f7d","65f8cca01c297968e2db0f7f"]
}
get all instructors
http://localhost:8081/getAllInstructors

get instructor by id
http://localhost:8081/staff/<id>

## Prgoram

- get all programs: GET http://localhost:8086/:facultyId/department/:departmentId

- create new program: POST http://localhost:8086/:facultyId/department/:departmentId
  {
  "name": "Test program 111",
  "competences": ["660393995a91f5aa4add3888", "660393995a91f5aa4add388a"]
  }

- Update a program : PATCH http://localhost:8086/:facultyId/department/:departmentId/program/programId
- Delete a program : DELETE http://localhost:8086/:facultyId/department/:departmentId/program/programId
- Get a program : GET http://localhost:8086/:facultyId/department/:departmentId/program/programId

## Course TOPICS

createTopic: POST http://localhost:8087/

json:
{
"courseCode": "ENG101",
"courseTitle": "Introduction to English Literature",
"courseAims": "This course aims to introduce students to the fundamentals of English literature.",
"courseInformation": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
"competences": ["6123456789abcdef01234567", "7123456789abcdef01234568"],
"learningOutcomes": [
{ "code": "LO1", "name": "Demonstrate an understanding of key literary concepts." },
{ "code": "LO2", "name": "Analyze and interpret literary texts effectively." },
{ "code": "LO3", "name": "Communicate ideas and arguments clearly in written form." }
]
}

getAllTopics: GET http://localhost:8087/

getTopic: GET http://localhost:8087/:topicId

deleteTopic: delete http://localhost:8087/:topicId

updateTopic : patch http://localhost:8087/:topicId

json:
{
"courseCode": "MATH101",
"courseTitle": "Introduction to Mathematics",
"courseAims": "This course aims to introduce students to the basics of mathematics.",
"courseInformation": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
"competences": ["8123456789abcdef01234569", "9123456789abcdef0123456a"],
{ "code": "LO1", "name": "Apply mathematical concepts to solve problems." },
{ "code": "LO2", "name": "Demonstrate proficiency in mathematical calculations." },
{ "code": "LO3", "name": "Communicate mathematical ideas effectively." }
]
}

## MARKS

addAllStudentMarks: POST http://localhost:8087/

json:
{
"courseId": "65f8b2371c297968e2db0f5a",
"marks": [
{
"studentId": "65c7bcd4eaa938686e9a1cc6",
"mark": {
"quizGrades": [85, 90, 92],
"midExamGrade": 88,
"finalProjectGrade": 95,
"finalExamGrade": 87
}
},
{
"studentId": "609cbf5da2d666001c1a649f",
"mark": {
"quizGrades": [78, 82, 80],
"midExamGrade": 85,
"finalProjectGrade": 90,
"finalExamGrade": 84
}
}
]
}

addStudentMarks: POST http://localhost:8087/:studentId

json:
{
"courseId": "65f8b2371c297968e2db0f5a",
"marks": [
{
"studentId": "65c7bcd4eaa938686e9a1cc6",
"mark": {
"quizGrades": [85, 90, 92],
"midExamGrade": 88,
"finalProjectGrade": 95,
"finalExamGrade": 87
}
}
getAllMarks: GET http://localhost:8087/

getStudentMarks GET http://localhost:8087/:studentId

updateStudentMarks: patch http://localhost:8087/:studentId

json:
{
"studentId": "65c7bcd4eaa938686e9a1cc6",
"marks": {
"quizGrades": [90, 85, 88],
"midExamGrade": 92,
"finalProjectGrade": 97,
"finalExamGrade": 89
}
}

## SURVAYS

getAllSurveys: get http://localhost:8082/

addSurvey: POST http://localhost:8082/

json:
{
"name": "Sample Survey",
"description": "This is a sample survey.",
"questions": ["Question 1", "Question 2"],
"dueTo": "2024-05-08T12:00:00.000Z",
"courseId": "60c7d32a8e79813c44552b31"
}

#quality coordinator to add competencies for all courses
route:
http://localhost:8087/newCourseComp/:courseId
json:
{
"qualityCompetencies": ["660390bd5a91f5aa4add384f", "6603924a5a91f5aa4add3865"]
}

#instructor TOPICS
create topic:
http://localhost:8087/topic/:courseId
json:
{
"title": "Advanced Topic: Applications",
"week": 3,
"plannedHours": 4,
"learningOutcomes": ["LO2", "LO3"]
}

get topic by id, update , delete
http://localhost:8087/topic/:topicId

get all topics
http://localhost:8087/topic

get all Topics under course:
http://localhost:8087/topic/getTopicsBycourse/:coureId

#instructor Courses
first to get back courses IDs
http://localhost:8081/getAssignedCourses/:instructorId

get back the equivalent courses by their ids
http://localhost:8087/getCoursesByIds
json
{
"courseIds": [
"660033497fa6bdc944beafeb",
"660033837fa6bdc944beafed"
]
}

# dashboard

course-count: get http://localhost:8087/course-count
program-count: get http://localhost:8086/program-count
department-count: get http://localhost:8084/department-count
faculty-count:get http://localhost:8083/faculty-count
stuff-count : get http://localhost:8081/stuff-count
student-count : get http://localhost:8081/student-count

# all competences

get all competences: get http://localhost:8085/allComp

# assessment methods

create assessment : post http://localhost:8087/assessment-methods/
JSON:
{
"assessment":"quiz1",
"grade":20,
"LO":["LO1","LO2"]
}

get all assessment methods: get http://localhost:8087/assessment-methods/

update assessment methods : put http://localhost:8087/assessment-methods/661c136e9e58ec625120c21b
JSON :
{
"assessment":"quiz1",
"grade":20,
"LO":["LO1","LO2"]
}

get assessment method by id : get http://localhost:8087/assessment-methods/661c136e9e58ec625120c21b

delete assessment method : delete http://localhost:8087/assessment-methods/661c136e9e58ec625120c21b
