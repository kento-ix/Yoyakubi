import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerForm from "./pages/CustomerForm";
import MenuSelection from "./pages/MenuSelection";
import DateTimeSelection from "./pages/DateTimeSelection";
import ReservationConfirm from "./pages/ReservationConfirm";
import ReservationComplete from "./pages/ReservationComplete";
import StepperComponent from "./components/stepper/Stepper";

import Calendar from "./pages/Calendar";

function App() {
  return (
    <Router>
      <Routes>
        {/* テスト用: ステッパーから開始 */}
        <Route
          path="/"
          element={
            <StepperComponent>
              <Calendar/>
              {/* <MenuSelection /> */}
            </StepperComponent>
          }
        />
        <Route path="/customer-form" element={<CustomerForm />} />
        {/* 予約フロー（ステッパー内） */}
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
              <DateTimeSelection />
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
