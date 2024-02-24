import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import QuestionForm from './components/QuestionForm';
import CreateTest from './components/CreateTest';
import QuestionList from './components/QuestionList';
import FacultyTests from './components/FacultyTests';
import TestDetails from './components/TestDetails';
import StudentTests from './components/StudentTests';
import TestPage from './components/TestPage';
import Temp from './components/Temp';



function App() {
  return (
    <div className="App">
     <Routes>
     <Route path='/' element={<Login></Login>}>
     </Route>
     <Route path='/signup' element={<Signup></Signup>}></Route>
     <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
     <Route path='/addquestion' element={<QuestionForm></QuestionForm>}></Route>
     <Route path='/addTest' element={<CreateTest></CreateTest>}></Route>
     <Route path='/questions' element={<QuestionList></QuestionList>}></Route>
      <Route path="/mytests" element={<FacultyTests></FacultyTests>} />
      <Route path="/mytests/:testId" element={<TestDetails></TestDetails>} />
      <Route path='/student/tests' element={<StudentTests></StudentTests>}></Route>
     <Route path='/attempt-test/:testId/:testcourse' element={<TestPage></TestPage>}></Route>
     <Route path='/records/:testId/:coursename' element={<Temp></Temp>}></Route>
     </Routes>
    </div>
  );
}

export default App;
