import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Stepper, Container, Stack } from "@mantine/core";
import { IconUser, IconCalendar, IconCheck, IconPaperclip } from '@tabler/icons-react';

interface StepperComponentProps {
  children: React.ReactNode;
}

const StepperComponent: React.FC<StepperComponentProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const stepRoutes = [
    { path: "/menu", step: 0, label: "メニュー選択", icon: <IconUser size={24} /> },
    { path: "/datetime", step: 1, label: "日時選択", icon: <IconCalendar size={24} /> },
    { path: "/confirm", step: 2, label: "予約確認", icon: <IconCheck size={24} /> },
    { path: "/complete", step: 3, label: "予約完了", icon: <IconPaperclip size={24} /> },
  ];

  const getCurrentStep = () => {
    const currentRoute = stepRoutes.find(
      (route) => route.path === location.pathname
    );
    return currentRoute ? currentRoute.step : 0;
  };

  const handleStepClick = (stepIndex: number) => {
    const targetRoute = stepRoutes[stepIndex];
    if (targetRoute) {
      navigate(targetRoute.path);
    }
  };

  const currentStep = getCurrentStep();

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Stepper
          active={currentStep}
          onStepClick={handleStepClick}
          allowNextStepsSelect={false}
          orientation="horizontal"
        >
          {stepRoutes.map((route) => (
            <Stepper.Step
              key={route.path}
              icon={route.icon}
              label={
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  marginTop: "8px"
                }}>
                  <span style={{ fontSize: 14, textAlign: "center" }}>{route.label}</span>
                </div>
              }
            />
          ))}
          <Stepper.Completed>予約が完了しました！</Stepper.Completed>
        </Stepper>

        <div>{children}</div>
      </Stack>
    </Container>
  );
};

export default StepperComponent;
