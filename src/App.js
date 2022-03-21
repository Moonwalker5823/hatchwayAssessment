import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const URL = 'https://api.hatchways.io/assessment/students';

  const [students, setStudents] = useState([]);
  const [searchTag, setSearchTag] = useState('');
  const [searchName, setSearchName] = useState('');

  //Function that runs as page loads and fetches data from API using useEffect Hook
  useEffect(() => {
    fetch(URL)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setStudents(data.students);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  //Function to add a new tag to a student
  function addTag(event, student) {
    event.preventDefault();
    let currStudent = [...students];
    currStudent.forEach((el, i) => {
      if (el.id === student.id) {
        if (!el.hasOwnProperty('tags'))
          currStudent[i].tags = [event.target.tag.value];
        else currStudent[i].tags.push(event.target.tag.value);
      }
    });
    setStudents(currStudent);
    event.target.tag.value = '';
  }

  // Function that creates JSX to display a student's tags
  function displayTags(student) {
    if (students.hasOwnProperty('tags')) {
      return students.tags.map((tag, index) => {
        return (
          <div key={tag + index} className="studentTag">
            {tag}
          </div>
        );
      });
    }
  }

  // Function to Display Grades
  function displayGrades(index1, index2) {
    const gradesElement = document.querySelector(`#${index1}`);
    gradesElement.classList.toggle('hideGrades');
    const buttonElement = document.querySelector(`#${index2}`);
    const classes = buttonElement.classList;
    classes[1] === 'fa-plus'
      ? classes.replace('fa-plus', 'fa-minus')
      : classes.replace('fa-minus', 'fa-plus');
  }

  return (
    <div>
      <div className="searchInputs">
        <form>
          <input
            style={{ width: '100%', height: '50px' }}
            type="text"
            id="name"
            value={searchTag}
            placeholder="Search By Tag"
            onChange={(e) => {
              setSearchTag(e.target.value);
            }}
          />
        </form>
        <form>
          <input
            style={{ width: '100%', height: '50px' }}
            type="text"
            id="name"
            value={searchName}
            placeholder="Search By Name"
            onChange={(e) => {
              setSearchName(e.target.value);
            }}
          />
        </form>
      </div>
      {/* filter the students based on the array saved in state  */}
      <div className="studentContainer">
        {students
          .filter((student) => {
            //Nothing to search
            if (searchName === '' && searchTag === '') return true;
            else if (searchName !== '' && searchTag === '') {
              return student.firstName
                .concat(' ')
                .concat(student.lastName)
                .toUpperCase()
                .includes(searchName.toUpperCase());
            }

            //Search by tag only
            else if (searchTag !== '' && searchName === '') {
              if (!student.tags) return false;
              else if (students.tags) {
                let found = false;
                student.tags.forEach((tag) => {
                  if (tag.toUpperCase().includes(searchTag.toUpperCase())) {
                    found = true;
                  }
                });
                return found;
              }
            }
            // Search by both name and tag
            else if (searchTag !== '' && searchName !== '') {
              if (!student.tags) return false;
              else if (student.tags) {
                let found = false;
                student.tags.forEach((tag) => {
                  if (tag.toUpperCase().includes(searchTag.toUpperCase())) {
                    found = true;
                  }
                });

                let findNameMatch = student.firstName
                  .concat(' ')
                  .concat(student.lastName)
                  .toUpperCase()
                  .includes(searchName.toUpperCase());

                return findNameMatch && found ? true : false;
              }
            }
            return true;
          })

          //Display All students
          .map((student, index) => {
            return (
              <div key={index} className="student">
                <div className="studentImg">
                  <img
                    className="img"
                    src={student.pic}
                    alt={student.company}
                  />
                </div>

                <div className="studentInfoContainer">
                  <div className="studentInfoHeader">
                    {student.firstName.toUpperCase()}{' '}
                    {student.lastName.toUpperCase()}
                  </div>

                  <div className="studentInfo">
                    Email: {student.email}
                    <br />
                    Company: {student.company}
                    <br />
                    Skill: {student.skill}
                    <br />
                    Average:{' '}
                    {student.grades.reduce((a, b) => a + parseInt(b), 0) /
                      student.grades.length}
                    %
                  </div>

                  {/*  display Grades*/}
                  <div id={student.company + index}>
                    {student.grades.map((test, index) => {
                      return (
                        <div key={student.lastName + 'grades' + index}>
                          Test {(index += 1)}:  {test}%
                        </div>
                      );
                    })}
                  </div>

                  {/* Display Tag*/}
                  <div className="displayTag">{displayTags(student)}</div>

                  {/*Add Tag */}
                  <form
                    onSubmit={(e) => {
                      addTag(e, student);
                    }}
                  >
                    <input
                      type="text"
                      id="tag"
                      name="tag"
                      placeholder="Add a tag"
                      className="tagInput"
                    />
                  </form>
                  <hr />
                </div>

                {/* button to diplay grades  */}
                <div className="gradeButton">
                  <button
                    style={{ width: '50%', height: '25px' }}
                    onClick={() =>
                      displayGrades(
                        student.company + index,
                        student.lastName + 'button'
                      )
                    }
                  >
                    <i
                      id={student.lastName + 'button'}
                      className="fas fa-plus"
                    ></i>
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
