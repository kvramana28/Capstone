// This file simulates a backend database service (e.g., connected to SQL).
// For this frontend-only application, it uses localStorage as a mock database.
// All functions are async to mimic real API calls.

import type { User } from '../types';

const USERS_STORAGE_KEY = 'users';

const simulateLatency = (delay: number = 250) => new Promise(res => setTimeout(res, delay));

const getUsers = (): User[] => {
    try {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    } catch (e) {
        console.error("Failed to parse users from localStorage", e);
        return [];
    }
};

const setUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const init_db = async () => {
    await simulateLatency(10); // minimal delay for init
    const users = getUsers();
    const adminExists = users.some((u: User) => u.role === 'admin');
    if (!adminExists) {
        const adminUser: User = { id: 'admin-001', email: 'admin@paddy.com', mobile: '0000000000', password: 'adminpassword', role: 'admin' };
        users.push(adminUser);
        setUsers(users);
    }
};

export const login_user = async (email: string, password: string): Promise<User | null> => {
    await simulateLatency();
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    return foundUser || null;
};

export const register_user = async (email: string, mobile: string, password: string): Promise<{ success: boolean; message: string; }> => {
    await simulateLatency();
    const users = getUsers();
    const emailExists = users.some(u => u.email === email);
    if (emailExists) {
        return { success: false, message: "An account with this email already exists." };
    }
    const mobileExists = users.some(u => u.mobile === mobile);
    if (mobileExists) {
        return { success: false, message: "An account with this mobile number already exists." };
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        mobile,
        password,
        role: 'farmer'
    };
    users.push(newUser);
    setUsers(users);
    return { success: true, message: "Registration successful! Please log in." };
};

export const find_user_by_mobile = async (mobile: string): Promise<User | null> => {
    await simulateLatency();
    const users = getUsers();
    return users.find(u => u.mobile === mobile) || null;
};

export const reset_user_password = async (mobile: string, newPassword: string): Promise<boolean> => {
    await simulateLatency();
    let users = getUsers();
    const userIndex = users.findIndex(u => u.mobile === mobile);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        setUsers(users);
        return true;
    }
    return false;
};

export const get_farmers = async (): Promise<User[]> => {
    await simulateLatency();
    const allUsers = getUsers();
    return allUsers.filter(user => user.role === 'farmer');
};
