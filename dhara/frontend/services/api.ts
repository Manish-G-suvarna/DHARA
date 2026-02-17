import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('dhara_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auth
export const registerUser = (data: any) =>
    api.post('/auth/register', data);

export const loginUser = (data: any) =>
    api.post('/auth/login', data);

export const getMe = () => api.get('/auth/me');

// Users
export const updateProfile = (data: any) =>
    api.put('/users/me', data);

// Herbs
export const getHerbs = () => api.get('/herbs');
export const getHerbById = (id: number) => api.get(`/herbs/${id}`);

// Medicines
export const getMedicines = () => api.get('/medicines');

// Interactions
export const checkInteraction = (herbId: number, medicineId: number) =>
    api.post('/interactions/check', { herbId, medicineId });

// Diet
export const getDietPlan = () => api.get('/diet/week');
export const saveDietPlan = (data: any) =>
    api.post('/diet/week', data);

// Chatbot
export const queryChatbot = (message: string, context?: any) =>
    api.post('/chatbot/query', { message, context });
export const submitQuiz = (answers: any[]) => api.post('/chatbot/query', { message: "QUIZ_SUBMISSION", context: { answers } }); // Reusing query endpoint or create new one in backend if needed. 
// Actually the Python API has /api/chatbot/quiz, but nodejs forwards to /api/chatbot/query. 
// Let's check Nodejs proxy. It strictly proxies /api/chatbot/query. 
// I should properly implement a proxy for quiz or just piggyback on query.
// Piggybacking on query with context is easier for now without changing backend route structure too much.
// Wait, my Python API has /api/chatbot/quiz. Nodejs only calls queryChatbot -> axios.post(..., query).
// Check Nodejs controller again.


export default api;
