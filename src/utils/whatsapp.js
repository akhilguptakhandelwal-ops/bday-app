export const formatWhatsAppLink = (phone, message) => {
  // Remove non-numeric characters from phone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // URL encode the message
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const generateMessage = (template, person) => {
  let message = template;
  message = message.replace(/{name}/g, person.name);
  message = message.replace(/{age}/g, calculateAge(person.dob));
  return message;
};

const calculateAge = (dobString) => {
  const dob = new Date(dobString);
  const diff_ms = Date.now() - dob.getTime();
  const age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
};
