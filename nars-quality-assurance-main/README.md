# How to deal with apis
faculty competences:
create competense 
http://localhost:8085/facultyComp
methode:post
{
  "code": "MC4",
  "description": "Faculty Competence 4 Description",
  "level": "A"
}

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
faculty:

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
{
  "code": "COMP002",
  "description": "Database Management Systems",
  "level": "B"
}

get comp:
http://localhost:8085/departmentComp/<id>
update:
http://localhost:8085/updateDepComp/<id>

delete
http://localhost:8085/deleteDepComp/<id>



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
department:

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