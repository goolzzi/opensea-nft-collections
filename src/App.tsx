import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import TopNav from './components/TopNav';
import HomePage from './containers/home';

function App() {
  return (
    <>
      <ToastContainer />
      <TopNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
