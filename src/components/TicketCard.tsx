import { useState, useEffect } from 'react';

import { Ticket, apiService } from '@/utils/api';
import { getLocalStorage } from '@/utils/LocalStorageUtils';

import styles from '../styles/main-page.module.css';



const Tickets = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const userID = getLocalStorage('user_id')
    const eventID = getLocalStorage('event_id')

    
    useEffect(() => {
        const fetchData = async () => {
        try {
            
            const userData = await apiService.getUserTickets(userID as string, eventID as string);
            setTickets(userData.tickets);

        } catch (_error) {
            console.error(_error);
        }
        };
        
        fetchData();
    }, [userID, eventID]);
    
    return (
    <div className={styles.ticketsSection}>
        <h2 className={styles.sectionTitle}>🎟 Тикеты</h2>
        <div className={styles.ticketsList}>
        
        {/* For test */}
        {/* <div key={1} className={styles.ticketCard}>
            <div>Тикет: <span className={styles.ticketNumber}>123</span></div>
            <div className={styles.ticketDate}>Получен : 1123</div>
        </div> */}
        
            {tickets.map(ticket => (
            <div key={ticket.id} className={styles.ticketCard}>
                <div>Тикет: <span className={styles.ticketNumber}>{ticket.number}</span></div>
                <div className={styles.ticketDate}>Получен : {ticket.createdAt}</div>
            </div>
            ))}
        </div>
        </div>
    );
}

export default Tickets