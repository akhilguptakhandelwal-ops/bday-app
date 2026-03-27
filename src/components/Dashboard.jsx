import React, { useState, useEffect } from 'react';
import { Calendar, Send, MessageCircle } from 'lucide-react';
import { getAllItems } from '../utils/db';
import { generateMessage, formatWhatsAppLink } from '../utils/whatsapp';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [todayBirthdays, setTodayBirthdays] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      const all = await getAllItems('birthdays');
      const today = new Date();
      const todayStr = `${today.getMonth() + 1}-${today.getDate()}`;
      
      const isToday = all.filter(p => {
        const d = new Date(p.dob);
        return `${d.getMonth() + 1}-${d.getDate()}` === todayStr;
      });

      setTodayBirthdays(isToday);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSend = (person) => {
    const template = "Happy Birthday {name}! Wishing you a fantastic day! 🎉";
    const message = generateMessage(template, person);
    const link = formatWhatsAppLink(person.phone, message);
    window.open(link, '_blank');
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="dashboard">
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="text-primary" /> Today's Birthdays
        </h2>
        
        {todayBirthdays.length === 0 ? (
          <div className="glass glass-card text-center py-8">
            <p className="text-text-muted">No birthdays today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayBirthdays.map((person) => (
              <motion.div 
                key={person.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass glass-card flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{person.name}</h3>
                  <p className="text-sm text-text-muted">{person.phone}</p>
                </div>
                <button 
                  onClick={() => handleSend(person)}
                  className="btn btn-primary pulse"
                >
                  <MessageCircle size={18} /> Send Wish
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
