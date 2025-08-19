import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Stepper, Button, Group, Container, Stack } from "@mantine/core";
import { IconUser, IconCalendar, IconCheck, IconPaperclip } from '@tabler/icons-react';

interface StepperComponentProps {
  children: React.ReactNode;
}

const StepperComponent: React.FC<StepperComponentProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ルートパスとステップの対応
  const stepRoutes = [
    {
      path: "/menu",
      step: 0,
      label: "メニュー選択",
      icon: <IconUser size={24} />,
    },
    {
      path: "/datetime",
      step: 1,
      label: "日時選択",
      icon: <IconCalendar size={24} />,
    },
    { 
      path: "/confirm",
      step: 2,
      label: "予約確認",
      icon: <IconCheck size={24} />,
    },
    {
      path: "/complete",
      step: 3,
      label: "予約完了",
      icon: <IconPaperclip size={24} />,
    },
  ];

  // 現在のステップを取得
  const getCurrentStep = () => {
    const currentRoute = stepRoutes.find(
      (route) => route.path === location.pathname
    );
    return currentRoute ? currentRoute.step : 0;
  };

  // 前のステップに戻る
  const handlePrevStep = () => {
    const currentStep = getCurrentStep();
    if (currentStep > 0) {
      const prevRoute = stepRoutes[currentStep - 1];
      navigate(prevRoute.path);
    }
  };

  // 次のステップに進む
  const handleNextStep = () => {
    const currentStep = getCurrentStep();
    if (currentStep < stepRoutes.length - 1) {
      const nextRoute = stepRoutes[currentStep + 1];
      navigate(nextRoute.path);
    }
  };

  // ステップクリック時の処理
  const handleStepClick = (stepIndex: number) => {
    const targetRoute = stepRoutes[stepIndex];
    if (targetRoute) {
      navigate(targetRoute.path);
    }
  };

  const currentStep = getCurrentStep();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === stepRoutes.length - 1;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* ステッパー表示 */}
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

        {/* ページコンテンツ */}
        <div>{children}</div>

        {/* ナビゲーションボタン - 完了ページでは非表示 */}
        {currentStep < 3 && (
          <Group justify="space-between" mt="xl">
            <Button
              variant="default"
              onClick={handlePrevStep}
              disabled={isFirstStep}
            >
              戻る
            </Button>
            <Button
              onClick={handleNextStep}
              color="pink"
              disabled={currentStep === 2}
            >
              次へ
            </Button>
          </Group>
        )}
      </Stack>
    </Container>
  );
};

export default StepperComponent;
