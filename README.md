# TOPICS
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

# MARKS
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

# SURVAYS
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



