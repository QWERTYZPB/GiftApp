import { useState, useEffect } from 'react';
import { apiService, EventDate } from '../utils/api';
import { getLocalStorage } from '@/utils/LocalStorageUtils';


import styles from '@/styles/main-page.module.css'


interface EventPropsId {
  event_id : string
}


const RaffleTimer = ({event_id}: EventPropsId) => {

  const eventID = event_id

  const [timeLeft, setTimeLeft] = useState<EventDate>({ 
    days: 0, 
    hours: 0, 
    minutes: 0, 
    seconds: 0
  });

  // Функция для преобразования времени в секунды
  const toSeconds = (t: EventDate) => 
    t.days * 86400 + t.hours * 3600 + t.minutes * 60 + t.seconds;

  

  useEffect(() => {
    let syncInterval: NodeJS.Timeout;
    let timerInterval: NodeJS.Timeout;
    const tick = (prev: EventDate) => {
      const total = toSeconds(prev) - 1;
      
      if (total <= 0) return { 
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
  
      return {
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60
      };
    };
    
    const syncWithServer = async () => {
      try {
        const serverTime = await apiService.getEventDate(eventID as string);
        setTimeLeft(serverTime);
      } catch (error) {
        console.error('Ошибка синхронизации:', error);
      }
    };

    // Первоначальная загрузка данных
    syncWithServer().then(() => {
      // Запуск таймера
      timerInterval = setInterval(() => {
        setTimeLeft(prev => tick(prev));
      }, 1000);

      // Синхронизация с сервером каждые 5 минут
      syncInterval = setInterval(syncWithServer, 300_000);
    });

    return () => {
      clearInterval(timerInterval);
      clearInterval(syncInterval);
    };
  }, [eventID]);

  // Форматирование времени с ведущими нулями
  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={styles.timer}>
      {/* {timeLeft.days > 0 && `${}, `} */}
      {format(timeLeft.hours+timeLeft.days*24)}:
      {format(timeLeft.minutes)}:
      {format(timeLeft.seconds)}
    </div>
  );
};


export default RaffleTimer;