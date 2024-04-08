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

* get staff by id: GET http://localhost:8081/staff/id
* get all department admins by facultyId: GET http://localhost:8081/depAdmins
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



## Prgoram
* get all programs: GET http://localhost:8086/:facultyId/department/:departmentId

* create new program: POST http://localhost:8086/:facultyId/department/:departmentId
{
"name": "Test program 111",
"competences": ["660393995a91f5aa4add3888", "660393995a91f5aa4add388a"]
}

* Update a program : PATCH http://localhost:8086/:facultyId/department/:departmentId/program/programId
* Delete a program : DELETE http://localhost:8086/:facultyId/department/:departmentId/program/programId
* Get a program : GET http://localhost:8086/:facultyId/department/:departmentId/program/programId