import { useAtom } from "jotai";
import { selectedServiceAtom } from "@/atoms/serviceAtom";
import { selectedDateAtom, selectedTimeAtom } from "@/atoms/dateAtom";


const Test = () => {
    const [selectedServices] = useAtom(selectedServiceAtom);
    const [date] = useAtom(selectedDateAtom);
    const [time] = useAtom(selectedTimeAtom);

  return (
    <div>
      <h2>選択中のメニュー</h2>
        <ul>
          {selectedServices.map((service) => (
            <li key={service.id}>
              {service.name} ({service.duration}分 / ¥{service.price})
            </li>
          ))}
        </ul>

        <h2>予約確認</h2>
        <p>日付: {date ?? "未選択"}</p>
        <p>時間: {time ?? "未選択"}</p>
    </div>
  );
};

export default Test;
