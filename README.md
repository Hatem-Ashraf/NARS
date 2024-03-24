# NARS

# department coordinator

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

updateProgramCompetence: put http://localhost:8085/updateProObj/:id
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
