import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<
    "payment" | "code" | "success"
  >("payment");
  const [enteredCode, setEnteredCode] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Система лимитов для кодов
  const [codeLimits, setCodeLimits] = useState<{
    [key: string]: { count: number; lastReset: number };
  }>({
    "083": { count: 0, lastReset: Date.now() },
    "154": { count: 0, lastReset: Date.now() },
  });

  const handlePayment = () => {
    setCurrentPage("code");
  };

  useEffect(() => {
    if (currentPage === "code" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentPage]);

  const checkCodeLimit = (code: string) => {
    if (code === "1872") return true; // Без ограничений

    const now = Date.now();
    const limit = codeLimits[code];

    if (!limit) return false;

    // Сброс счетчика каждый час
    if (now - limit.lastReset > 3600000) {
      setCodeLimits((prev) => ({
        ...prev,
        [code]: { count: 0, lastReset: now },
      }));
      return true;
    }

    return limit.count < 10;
  };

  const handleCodeSubmit = () => {
    const validCodes = ["083", "154", "1872"];
    setError("");

    if (!validCodes.includes(enteredCode)) {
      setError("Ошибка");
      return;
    }

    if (!checkCodeLimit(enteredCode)) {
      setError("Ошибка");
      return;
    }

    // Увеличиваем счетчик для ограниченных кодов
    if (enteredCode === "083" || enteredCode === "154") {
      setCodeLimits((prev) => ({
        ...prev,
        [enteredCode]: {
          ...prev[enteredCode],
          count: prev[enteredCode].count + 1,
        },
      }));
    }

    setCurrentPage("success");
  };

  const renderPaymentPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#4ECDC4] to-[#25B7D1] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-full flex items-center justify-center mb-4">
            <Icon name="QrCode" size={32} className="text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent">
            Приватный доступ
          </CardTitle>
          <p className="text-gray-600 mt-2">Система защищенного входа</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full mb-4">
              <Icon name="Shield" size={16} className="text-[#25B7D1]" />
              <span className="text-sm text-gray-700">
                QR-код верифицирован
              </span>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:from-[#ff5252] hover:to-[#26c6da] text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <Icon name="CreditCard" size={20} className="mr-2" />
            Оплатить
          </Button>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Icon name="Lock" size={12} />
              <span>Безопасно</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="CheckCircle" size={12} />
              <span>Проверено</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCodePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#4ECDC4] via-[#25B7D1] to-[#FF6B6B] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#4ECDC4] to-[#25B7D1] rounded-full flex items-center justify-center mb-4">
            <Icon name="KeyRound" size={32} className="text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#4ECDC4] to-[#25B7D1] bg-clip-text text-transparent">
            Введите код
          </CardTitle>
          <p className="text-gray-600 mt-2">Код доступа для продолжения</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Input
              ref={inputRef}
              type="text"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              placeholder="Введите код доступа"
              className="text-center text-lg font-mono tracking-wider py-3 border-2 focus:border-[#25B7D1] transition-all duration-300"
              maxLength={4}
              autoFocus
            />

            {error && (
              <div className="text-red-500 text-center font-medium animate-fade-in">
                {error}
              </div>
            )}
          </div>

          <Button
            onClick={handleCodeSubmit}
            className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#25B7D1] hover:from-[#26c6da] hover:to-[#0288d1] text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            disabled={!enteredCode.trim()}
          >
            <Icon name="ArrowRight" size={20} className="mr-2" />
            Подтвердить
          </Button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full text-xs text-gray-600">
              <Icon name="Info" size={12} />
              <span>Коды 083, 154 - до 10 раз в час</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSuccessPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#25B7D1] via-[#4ECDC4] to-[#FF6B6B] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 animate-scale-in">
            <Icon name="CheckCircle" size={40} className="text-white" />
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-4">
            Успешно
          </h2>

          <p className="text-gray-600 mb-8">
            Доступ разрешен. Добро пожаловать!
          </p>

          <Button
            onClick={() => {
              setCurrentPage("payment");
              setEnteredCode("");
              setError("");
            }}
            variant="outline"
            className="border-[#25B7D1] text-[#25B7D1] hover:bg-[#25B7D1] hover:text-white transition-all duration-300"
          >
            <Icon name="Home" size={16} className="mr-2" />
            Вернуться на 1 страницу
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const Index = () => {
    switch (currentPage) {
      case "payment":
        return renderPaymentPage();
      case "code":
        return renderCodePage();
      case "success":
        return renderSuccessPage();
      default:
        return renderPaymentPage();
    }
  };

  return <Index />;
};

export default Index;
