// utils/api.ts
import axios from 'axios';

// Типы данных
export interface Channel {
  channelId: string;
  image_data?: string;
  channelName: string;
  channelUrl: string;
  isSubscribed: boolean;
}

export interface Winner {
  id: number;
  ticket: string;
  name: string;
  image_url: string;
}


export interface UserData {
  id: string;
  tickets: Ticket[];
  referralLink: string;
}

export interface Ticket {
  id: string;
  number: string;
  createdAt: string;
}

export interface SubscriptionStatus {
  allSubscribed: boolean;
  details: Channel[]
}


export interface EventDate {
  
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}



export interface EventData {
  users_to_invite: number,
  use_captcha: number
}

export interface CaptchaData {
  image: string,
  answers: string[],
  right: string

}



export interface ReferralAnswer {
  ok: boolean,
  message: string
}





const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Исправлено для Next.js
  headers: {
    'Content-Type': 'application/json',
  }
});

// API методы
export const apiService = {
  // Получение списка каналов
  getCaptcha: async (): Promise<CaptchaData> => {
    try {
      const response = await api.get(`/captcha`);
      return response.data;
    } catch (_error) {
      console.error(_error)
      throw new Error('Failed to fetch channels');
    }
  },

  getChannels: async (eventId: string): Promise<Channel[]> => {
    try {
      const response = await api.get(`/channels/${eventId}`);
      return response.data.channels;
    } catch (_error) {
      console.error(_error)
      throw new Error('Failed to fetch channels');
    }
  },

  getWinners: async (eventId: string): Promise<Winner[]> => {
    try {
      const response = await api.get(`/getWinners/${eventId}`);
      if (response.data.ok) {
        return response.data.result;
      }

      return response.data.ok

    } catch (_error) {
      console.error(_error)
      throw new Error('Get Winners failed');
    }
  },

  // Получение данных пользователя
  getUserData: async (userId: string, eventId: string): Promise<UserData> => {
    try {
      const response = await api.get(`/users/${userId}-${eventId}`);
      return response.data;
    } catch (_error) {
      console.error(_error)
      throw new Error('Failed to fetch user data');
    }
  },

  getUserTickets: async (userId: string, eventId: string): Promise<UserData> => {
    try {
      const response = await api.get(`/tickets/${userId}-${eventId}`);
      return response.data;
    } catch (_error) {
      console.error(_error)
      throw new Error('Failed to fetch tickets data');
    }
  },

  // Проверка подписок
  checkSubscriptions: async (userId: string, eventId: string): Promise<SubscriptionStatus> => {
    try {
      const response = await api.post(`/check-subscriptions/${userId}-${eventId}`);
      return response.data;
    } catch (_error) {
      console.error(_error)
      throw new Error('Subscription check failed');
    }
  },

  getEventDate: async (eventId: string): Promise<EventDate> => {
    try {
      const response = await api.get(`/getEventDate/${eventId}`);
      return response.data;
    } catch (_error) {
      console.error(_error)
      throw new Error('Get Event failed');
    }
  },

  getEventData: async (eventId: string): Promise<EventData> => {
    try {
      const response = await api.get(`/getEvent/${eventId}`);
      return response.data;
    } catch (_error) {
      console.error(_error)
      throw new Error('Get Event failed');
    }
  },
  

  SendUserToServer: async ( userId: string, fullname: string, username: string): Promise<{ok:boolean}> => {
    try {
      const response = await api.post("/UpdateUser",
            {
                username: username,
                fullname: fullname,
                user_id: userId
            }
        );

      return response.data;
    } catch (_error) {
      console.error(_error)
      throw new Error('Send User Data Failed');
    }
  },


  SendReferralToServer: async ( referral_id: string, referrer_id: string, event_id: string): Promise<ReferralAnswer> => {
    try {
      const response = await api.post("/MakeReferral",
            {
                referral_id: referral_id,
                referrer_id: referrer_id,
                event_id: event_id
            }
        );

      return response.data;
    } catch (_error) {
      console.error(_error)
      throw new Error('Send User Data Failed');
    }
  },
  
};

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Обработка HTTP ошибок
      switch (error.response.status) {
        case 401:
          // Перенаправление на страницу авторизации
          break;
        case 500:
          // Обработка серверных ошибок
          break;
        default:
          console.error('API Error:', error.message);
      }
    }
    return Promise.reject(error);
  }
);