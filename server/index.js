const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



app.post('/signup', async (req, res) => {
  try {
    const {  name, password, id, role, department } = req.body;
    
    const checkPrnSql = 'SELECT id FROM users WHERE id = ?';
    db.query(checkPrnSql, [id], (error, results) => {
      if (error) {
        console.error('Error checking PRN:', error);
        return res.status(500).json({ success: false, message: 'Error checking PRN' });
      } else {
        if (results.length > 0) {
          console.log('PRN already exists');
          return res.status(400).json({ success: false, message: 'User already exists' });
        } else {
          console.log('PRN does not exist');
          // Hash the password for security
          bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
              console.error('Error hashing password:', err);
              return res.status(500).json({ success: false, message: 'Error hashing password' });
            } else {
              // Insert user into the users table
              const userSql = 'INSERT INTO users (id, password, name,role,department) VALUES (?, ?, ?,?,?)';
              db.query(userSql, [id, hashedPassword, name,role,department], (userErr, userResult) => {
                if (userErr) {
                  console.error('Error inserting user:', userErr);
                  return res.status(500).json({ success: false, message: 'Error inserting user' });
                } 
                else 
                {
                 res.status(200).json({success:true , message:'Registration successful'})
                }
              });
            }
          });
        }
      }
    });
  } catch (error) {

    console.error('Error in signup:', error);
    res.status(500).json({
      success: false,
      message: 'Error in signup',
      error: error.message
    });
  }
});


//*login*//

app.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;

    const searchUserById = "SELECT * FROM users WHERE id = ?";
    db.query(searchUserById, [id], async (error, results) => {
      if (error) {
        console.error('Error searching user by ID:', error);
        return res.status(500).json({
          success: false,
          message: 'Error searching user by ID'
        });
      } else {
        if (results.length > 0) {
          // User found
          console.log('User found:', results[0]);

          const passwordMatch = await bcrypt.compare(password, results[0].password);
          if (passwordMatch) {
            // Passwords match, user authentication successful
            const token = await jwt.sign(
            { 
             id : results[0].id,
             role:results[0].role,
             name : results[0].name,
             department:results[0].department
         
            },process.env.JWT_SECRET,{ expiresIn: '2d' }
            )
            console.log('User authenticated successfully:', results[0]);
            return res.status(200).json({
              success: true,
              message: 'User authenticated successfully',
              user: results[0] ,
              token:token
            });
          } else {
            
            console.log('Wrong password');
            return res.status(401).json({
              success: false,
              message: 'Wrong password'
            });
          }
        } else {
     
          console.log('User not found');
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error in login',
      error: error.message 
    });
  }
});


//*get profile details*//
app.get('/profile/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = 'SELECT id,  name, role, deptartment FROM users WHERE id = ?';

  // Execute the query
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

  
    if (results.length === 0) {
      res.status(404).send('User not found');
      return;
    }

 
    const userProfile = {
      id: results[0].id,
      email: results[0].email,
      name: results[0].name,
      role: results[0].role,
      dept_name: results[0].dept_name
    };

    res.json(userProfile);
  });
});


// Route to add a new question
app.post('/questions', (req, res) => {
  const { department, question_text, image_url, math_expression, created_by_id, correct_option, option_1, option_2, option_3, option_4, subject } = req.body; // Include subject from request body
  const query = `INSERT INTO Questions (department, question_text, image_url, math_expression, created_by_id, correct_option, option_1, option_2, option_3, option_4, subject) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; // Include subject in the query
  db.query(query, [department, question_text, image_url, math_expression, created_by_id, correct_option, option_1, option_2, option_3, option_4, subject], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'Question added successfully' });
    }
  });
});

app.get('/getquestions', (req, res) => {
  const { department, subject } = req.query;
  const query = `SELECT * FROM Questions WHERE department = ? AND subject = ?`;
  db.query(query, [department, subject], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.post('/create-test', (req, res) => {
    const { department, coursename, duration, created_by_id, questions } = req.body;

    // Insert into Test table
    const testInsertQuery = 'INSERT INTO Test (department, course_name, duration, created_by_id) VALUES (?, ?, ?, ?)';
    db.query(testInsertQuery, [department, coursename, duration, created_by_id], (err, result) => {
        if (err) {
            console.error('Error inserting into Test table: ', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        const testId = result.insertId;
        // Insert into Test_Question table
        const testQuestionInsertQuery = 'INSERT INTO Test_Question (test_id, question_id, subject) VALUES (?, ?, ?)';
        questions.forEach(questionId => {
            db.query(testQuestionInsertQuery, [testId, questionId, coursename], (err, result) => {
                if (err) {
                    console.error('Error inserting into Test_Question table: ', err);
                    return;
                }
            });
        });

        res.status(201).json({ message: 'Test created successfully', testId });
    });
});


app.get('/test/questions', (req, res) => {
    const { test_id } = req.query;

    
    const query = 'SELECT * FROM Questions WHERE question_id IN (SELECT question_id FROM Test_Question WHERE test_id = ?)';
    db.query(query, [test_id], (err, results) => {
        if (err) {
            console.error('Error fetching test questions: ', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        res.status(200).json(results);
    });
});


// Backend API for retrieving tests created by a specific user
app.get('/faculty/tests', (req, res) => {
    const { created_by_id } = req.query;

    // Retrieve tests created by the specified user
    const query = 'SELECT * FROM Test WHERE created_by_id = ?';
    db.query(query, [created_by_id], (err, results) => {
        if (err) {
            console.error('Error fetching tests: ', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        res.status(200).json(results);
    });
});

app.get('/department/tests', (req, res) => {
    const { department } = req.query;

    // Retrieve tests created by the specified user
    const query = 'SELECT * FROM Test WHERE created_by_id = ?';
    db.query(query, [department], (err, results) => {
        if (err) {
            console.error('Error fetching tests: ', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        res.status(200).json(results);
    });
});

// Backend API for retrieving test details by test ID
app.get('/test/details', (req, res) => {
    const { test_id } = req.query;

    // Retrieve test details by test ID
    const query = 'SELECT * FROM Test WHERE test_id = ?';
    db.query(query, [test_id], (err, results) => {
        if (err) {
            console.error('Error fetching test details: ', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        res.status(200).json(results[0]);
    });
    
});

// Backend API for retrieving test questions by test ID
app.get('/test/questions', (req, res) => {
    const { test_id } = req.query;

    // Retrieve test questions by test ID
    const query = 'SELECT q.* FROM Questions q JOIN Test_Question tq ON q.question_id = tq.question_id WHERE tq.test_id = ?';
    db.query(query, [test_id], (err, results) => {
        if (err) {
            console.error('Error fetching test questions: ', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        res.status(200).json(results);
    });
});

app.get('/get-tests', (req, res) => {
    const department = req.query.department;
    const query = 'SELECT test_id, course_name, duration FROM Test WHERE department = ?';
    db.query(query, [department], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(200).json(result);
        }
    });
});

app.get('/test/questions/student', (req, res) => {
    const { test_id , department } = req.query;

    // Retrieve test questions by test ID
    const query = 'SELECT q.* FROM Questions q JOIN Test_Question tq ON q.question_id = tq.question_id WHERE tq.test_id = ? and q.department= ?';
    db.query(query, [test_id,department], (err, results) => {
        if (err) {
            console.error('Error fetching test questions: ', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        res.status(200).json(results);
    });
});


app.get('/test/duration', (req, res) => {
    const { test_id, department } = req.query;

    // Retrieve test duration by test ID and department
    const query = 'SELECT duration FROM Test WHERE test_id = ? AND department = ?';
    db.query(query, [test_id, department], (err, results) => {
        if (err) {
            console.error('Error fetching test duration:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }

        const duration = results[0].duration;
        res.status(200).json({ duration });
    });
});


app.post('/start-test', async (req, res) => {
    const { testId, testcourse, studentId } = req.body;

    try {
       const insertQuery = 'INSERT IGNORE INTO test_records (test_id, coursename, student_id, status) VALUES (?, ?, ?, ?)';
        const insertParams = [testId, testcourse, studentId, 'ongoing'];
        const result = await db.query(insertQuery, insertParams);

        if (result.affectedRows === 0) {
            console.log('No new record inserted');
            return res.status(500).json({ message: 'Failed to start test. No new record inserted.' });
        }
        console.log(result)
        const recordId = result.insertId;
        console.log(`New test record inserted with ID: ${recordId}`);

        res.status(200).json({ message: 'Test started successfully', recordId });
    } catch (error) {
        console.error('Error starting test:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.put('/update-test-status/:test_id/:student_id/:coursename', async (req, res) => {
    const { status, marks} = req.body;
    const { test_id,student_id ,coursename } = req.params;

    try {
        // Update test status and marks in test_records table
        const updateQuery = 'UPDATE test_records SET status = ?, marks = ? WHERE test_id = ? and student_id = ? and coursename = ?';
        const params = [status, marks, test_id , student_id,coursename];
        console.log(params)
        await db.query(updateQuery, params);

        res.status(200).json({ message: 'Test status updated successfully' });
    } catch (error) {
        console.error('Error updating test status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/get-distinct-records/:testId/:courseName', (req, res) => {
    const { testId, courseName } = req.params;

    const query = 'SELECT DISTINCT student_id, status FROM test_records WHERE test_id = ? AND coursename = ?';
    const params = [testId, courseName];
    
    db.query(query, params, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (Array.isArray(rows)) {
            
            res.status(200).json({ success: true, data: rows });
        } else {
            console.error('Query result is not an array:', rows);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
});
