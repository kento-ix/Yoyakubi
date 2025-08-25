import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerForm from "./pages/CustomerForm";
import MenuSelection from "./pages/MenuSelection";
import ReservationConfirm from "./pages/Confirm";
import ReservationComplete from "./pages/ReservationComplete";
import StepperComponent from "./components/stepper/Stepper";

import Calendar from "./pages/Calendar";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <StepperComponent>
              <MenuSelection/>
            </StepperComponent>
          }
        />
        <Route path="/customer-form" element={<CustomerForm />} />
        <Route
          path="/menu"
          element={
            <StepperComponent>
              <MenuSelection />
            </StepperComponent>
          }
        />
        <Route
          path="/datetime"
          element={
            <StepperComponent>
              <Calendar />
            </StepperComponent>
          }
        />
        <Route
          path="/confirm"
          element={
            <StepperComponent>
              <ReservationConfirm />
            </StepperComponent>
          }
        />
        <Route
          path="/complete"
          element={
            <StepperComponent>
              <ReservationComplete />
            </StepperComponent>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
