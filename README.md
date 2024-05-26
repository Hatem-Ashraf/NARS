# NARS
* maged14@feng.bu.edu.eg pass: password123 role:student

* said195451@feng.bu.edu.eg pass:123456789 role:instructor

* rana195387@feng.bu.edu.eg pass:123456789 role: system admin

* hatem195301@feng.bu.edu.eg pass:123456789 role:program coordinator

* zainab195418@feng.bu.edu.eg pass: 123456789 role:faculty admin

* aya195255@feng.bu.edu.eg pass:123456789 role:quality coordinator

* beter195290@feng.bu.edu.eg pass:12356789 role:Department admin

* ranatarek813@feng.bu.edu.eg pass:123456789 role:dean

* aya11@feng.bu.edu.eg pass:123456789 role:department head

*********************************************************************************************************

add course

POST http://localhost:8087/newCourse

JSON:
{
  "course": "660037cedf9a2d3bb02e619b",
 
  "name": "Software Engineering",
  
  "code": "CS450",
  
  "courseAims": "To introduce students to the fundamentals of computer science.",
  
  "courseInformation": "This course covers topics such as algorithms, data structures, and programming principles.",
  
  "Competences": ["660393995a91f5aa4add3888", "660393995a91f5aa4add388a"],
  
  "learningOutcomes": [
    { "code": "LO1", "name": "Understand basic algorithms and data structures." },
    { "code": "LO2", "name": "Write programs using PL." }
  ],
  
  "competencesModel": "programCompetences"
}

*********************************************************************************************************

{
  "course": "660037cedf9a2d3bb02e619b",
  
  "name": "Introduction to Computer Science",
  
  "code": "CS101",
  
  "courseAims": "To introduce students to the fundamentals of computer science.",
  
  "competences": ["660390bd5a91f5aa4add384f", "660390bd5a91f5aa4add3850", "660390bd5a91f5aa4add3851"],
  
  "learningOutcomes": [
    {
      "code": "LO1",
      "name": "Understand basic algorithms and data structures."
    },
    {
      "code": "LO2",
      "name": "Write programs using programming languages."
    },
    {
      "code": "LO3",
      "name": "Apply problem-solving techniques in programming."
    }
  ],
  
  "competencesModel": "facultyCompetences"
}

*********************************************************************************************************

{
  "name": "Computer Networks",
  
  "code": "CS204",
  
  "courseAims": "To provide an understanding of computer networking principles.",
  
  "competences": ["6603924a5a91f5aa4add3865", "6603924a5a91f5aa4add3865"],
  
  "learningOutcomes": [
    {
      "code": "LO1",
      "name": "Understand the fundamentals of computer networks."
    },
    {
      "code": "LO2",
      "name": "Configure and troubleshoot network devices."
    }
  ],
  
  "competencesModel": "departmentCompetences"
}



**********************************************************************

get selectedCompetences

POST http://localhost:8085/competences

json:
{
  "departmentIds": ["6603924a5a91f5aa4add3865", "6603924a5a91f5aa4add3866"],

  "facultyIds": ["660390bd5a91f5aa4add384f", "660390bd5a91f5aa4add3850"],
  
  "programIds": ["660393995a91f5aa4add3888", "660393995a91f5aa4add388a"]
}
