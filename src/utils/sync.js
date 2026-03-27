export const syncToBot = async (birthdays) => {
    const BOT_URL = 'https://bday-dqrc.onrender.com/sync';
    try {
        const response = await fetch(BOT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(birthdays)
        });
        return await response.json();
    } catch (err) {
        console.error('Bot Sync Failed:', err);
        throw err;
    }
};
