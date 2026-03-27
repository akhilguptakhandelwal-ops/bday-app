import React, { useState } from 'react';
import { MessageSquare, Save, Info } from 'lucide-react';

const TemplateManager = () => {
  const [template, setTemplate] = useState("Happy Birthday {name}! Wishing you a fantastic day! 🎉");

  const handleSave = () => {
    localStorage.setItem('bday_template', template);
    alert('Template saved!');
  };

  return (
    <div className="template-manager space-y-6">
      <div className="glass glass-card space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="text-secondary" /> Message Template
        </h2>
        
        <div className="space-y-2">
          <label className="text-sm text-text-muted">Edit your message template</label>
          <textarea 
            className="w-full bg-surface border border-glass-border rounded-xl p-4 text-text min-h-[150px] outline-none focus:border-primary transition-colors"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Type your birthday wish here..."
          />
        </div>

        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <Info className="text-primary shrink-0" size={20} />
          <div className="text-xs space-y-1">
            <p className="font-bold">Placeholders:</p>
            <p><code className="bg-white/10 px-1 rounded">{'{name}'}</code> - Person's full name</p>
            <p><code className="bg-white/10 px-1 rounded">{'{age}'}</code> - Calculated age</p>
          </div>
        </div>

        <button onClick={handleSave} className="btn btn-primary w-full">
          <Save size={20} /> Save Template
        </button>
      </div>

      <div className="glass glass-card">
        <h3 className="font-bold mb-2">About App</h3>
        <p className="text-sm text-text-muted">
          Version 1.0.0<br />
          Built for Mobile Use
        </p>
      </div>
    </div>
  );
};

export default TemplateManager;
