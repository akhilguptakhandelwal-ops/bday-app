import React, { useState, useEffect } from 'react';
import { Search, Trash2, User, Phone, Calendar as CalendarIcon } from 'lucide-react';
import { getAllItems, deleteItem } from '../utils/db';

const BirthdayList = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: '', phone: '', dob: '' });

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    const all = await getAllItems('birthdays');
    setBirthdays(all.sort((a, b) => a.name.localeCompare(b.name)));
    setLoading(false);
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!newPerson.name || !newPerson.phone || !newPerson.dob) return alert('All fields required');
    
    const { addItem } = await import('../utils/db');
    await addItem('birthdays', {
      ...newPerson,
      importedAt: new Date().toISOString()
    });
    
    setNewPerson({ name: '', phone: '', dob: '' });
    setShowAddForm(false);
    loadBirthdays();
    alert('Added! Remember to SYNC in the Import tab to update the Bot.');
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this birthday?')) {
      await deleteItem('birthdays', id);
      loadBirthdays();
    }
  };

  const filtered = birthdays.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone.includes(searchTerm)
  );

  if (loading) return <div>Loading list...</div>;

  return (
    <div className="birthday-list space-y-4">
      <div className="flex justify-between items-center gap-2">
        <div className="glass flex items-center px-4 py-2 gap-2 flex-grow">
          <Search size={20} className="text-text-muted" />
          <input 
            type="text"
            placeholder="Search name or phone..."
            className="bg-transparent border-none text-text w-full outline-none py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary h-[50px] w-[50px] !p-0 rounded-full"
        >
          {showAddForm ? '✕' : '+'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddPerson} className="glass glass-card space-y-4">
          <input 
            type="text" placeholder="Name" className="w-full bg-surface-hover p-3 rounded-lg border-none text-text outline-none"
            value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})}
          />
          <input 
            type="text" placeholder="Phone (e.g. 919876543210)" className="w-full bg-surface-hover p-3 rounded-lg border-none text-text outline-none"
            value={newPerson.phone} onChange={e => setNewPerson({...newPerson, phone: e.target.value})}
          />
          <input 
            type="date" className="w-full bg-surface-hover p-3 rounded-lg border-none text-text outline-none"
            value={newPerson.dob} onChange={e => setNewPerson({...newPerson, dob: e.target.value})}
          />
          <button type="submit" className="btn btn-primary w-full">Save Birthday</button>
        </form>
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-text-muted">No birthdays found</div>
        ) : (
          filtered.map(person => (
            <div key={person.id} className="glass glass-card flex justify-between items-center group">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <User size={16} className="text-primary" /> {person.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Phone size={14} /> {person.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <CalendarIcon size={14} /> {new Date(person.dob).toLocaleDateString()}
                </div>
              </div>
              <button 
                onClick={() => handleDelete(person.id)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BirthdayList;
