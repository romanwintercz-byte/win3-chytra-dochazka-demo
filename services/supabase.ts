
import { Employee, Job, TimeEntry, MonthStatus, TimesheetStatus, Notification } from '../types';
import { MOCK_EMPLOYEES, MOCK_JOBS, MOCK_ENTRIES } from './mockData';

// --- FAKE SUPABASE SERVICE (LOCAL STORAGE ONLY) ---
// This completely replaces the backend for the demo version.

const LS_KEYS = {
    EMPLOYEES: 'smartwork_demo_employees',
    JOBS: 'smartwork_demo_jobs',
    ENTRIES: 'smartwork_demo_entries',
    REPORTS: 'smartwork_demo_reports',
    NOTIFICATIONS: 'smartwork_demo_notifications'
};

// Helper to simulate network latency
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to initialize data if empty
const initializeDemoData = () => {
    if (!localStorage.getItem(LS_KEYS.EMPLOYEES)) {
        localStorage.setItem(LS_KEYS.EMPLOYEES, JSON.stringify(MOCK_EMPLOYEES));
    }
    if (!localStorage.getItem(LS_KEYS.JOBS)) {
        localStorage.setItem(LS_KEYS.JOBS, JSON.stringify(MOCK_JOBS));
    }
    if (!localStorage.getItem(LS_KEYS.ENTRIES)) {
        localStorage.setItem(LS_KEYS.ENTRIES, JSON.stringify(MOCK_ENTRIES));
    }
    // Reports and notifications start empty
};

// Initialize on load
if (typeof window !== 'undefined') {
    initializeDemoData();
}

export const resetDemoData = () => {
    localStorage.clear();
    initializeDemoData();
    window.location.reload();
};

// --- EMPLOYEES ---
export const fetchEmployees = async (): Promise<Employee[]> => {
    await delay();
    const data = localStorage.getItem(LS_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : MOCK_EMPLOYEES;
};

export const addEmployee = async (employee: Employee) => {
    await delay();
    const emps = JSON.parse(localStorage.getItem(LS_KEYS.EMPLOYEES) || '[]');
    emps.push({ ...employee, isActive: true });
    localStorage.setItem(LS_KEYS.EMPLOYEES, JSON.stringify(emps));
};

export const updateEmployee = async (employee: Employee) => {
    await delay();
    const emps = JSON.parse(localStorage.getItem(LS_KEYS.EMPLOYEES) || '[]') as Employee[];
    const idx = emps.findIndex(e => e.id === employee.id);
    if (idx !== -1) {
        emps[idx] = employee;
        localStorage.setItem(LS_KEYS.EMPLOYEES, JSON.stringify(emps));
    }
};

export const updateEmployeeStatus = async (id: string, isActive: boolean) => {
    await delay();
    const emps = JSON.parse(localStorage.getItem(LS_KEYS.EMPLOYEES) || '[]') as Employee[];
    const idx = emps.findIndex(e => e.id === id);
    if (idx !== -1) {
        emps[idx].isActive = isActive;
        localStorage.setItem(LS_KEYS.EMPLOYEES, JSON.stringify(emps));
    }
};

export const updateEmployeePin = async (id: string, pin: string | null) => {
    // No-op in demo
};

// --- JOBS ---
export const fetchJobs = async (): Promise<Job[]> => {
    await delay();
    const data = localStorage.getItem(LS_KEYS.JOBS);
    return data ? JSON.parse(data) : MOCK_JOBS;
};

export const addJob = async (job: Job) => {
    await delay();
    const jobs = JSON.parse(localStorage.getItem(LS_KEYS.JOBS) || '[]');
    jobs.push(job);
    localStorage.setItem(LS_KEYS.JOBS, JSON.stringify(jobs));
};

export const updateJobStatus = async (id: string, isActive: boolean) => {
    await delay();
    const jobs = JSON.parse(localStorage.getItem(LS_KEYS.JOBS) || '[]') as Job[];
    const idx = jobs.findIndex(j => j.id === id);
    if (idx !== -1) {
        jobs[idx].isActive = isActive;
        localStorage.setItem(LS_KEYS.JOBS, JSON.stringify(jobs));
    }
};

// --- TIME ENTRIES ---
export const fetchTimeEntries = async (): Promise<TimeEntry[]> => {
    await delay();
    const data = localStorage.getItem(LS_KEYS.ENTRIES);
    return data ? JSON.parse(data) : MOCK_ENTRIES;
};

export const addTimeEntriesBulk = async (newEntries: TimeEntry[]) => {
    await delay();
    const entries = JSON.parse(localStorage.getItem(LS_KEYS.ENTRIES) || '[]');
    // Prepend new entries (simple implementation)
    const updated = [...newEntries, ...entries];
    localStorage.setItem(LS_KEYS.ENTRIES, JSON.stringify(updated));
};

export const deleteTimeEntriesForDate = async (employeeId: string, date: string) => {
    await delay();
    let entries = JSON.parse(localStorage.getItem(LS_KEYS.ENTRIES) || '[]') as TimeEntry[];
    entries = entries.filter(e => !(e.employeeId === employeeId && e.date === date));
    localStorage.setItem(LS_KEYS.ENTRIES, JSON.stringify(entries));
};

export const deleteTimeEntry = async (id: string) => {
    await delay();
    let entries = JSON.parse(localStorage.getItem(LS_KEYS.ENTRIES) || '[]') as TimeEntry[];
    entries = entries.filter(e => e.id !== id);
    localStorage.setItem(LS_KEYS.ENTRIES, JSON.stringify(entries));
};

// --- REPORTS ---
export const fetchMonthlyReports = async (month: string): Promise<MonthStatus[]> => {
    await delay();
    const reports = JSON.parse(localStorage.getItem(LS_KEYS.REPORTS) || '[]') as MonthStatus[];
    return reports.filter(r => r.month === month);
};

export const upsertMonthlyReport = async (report: MonthStatus) => {
    await delay();
    let reports = JSON.parse(localStorage.getItem(LS_KEYS.REPORTS) || '[]') as MonthStatus[];
    const idx = reports.findIndex(r => r.employeeId === report.employeeId && r.month === report.month);
    if (idx !== -1) {
        reports[idx] = { ...reports[idx], ...report };
    } else {
        reports.push(report);
    }
    localStorage.setItem(LS_KEYS.REPORTS, JSON.stringify(reports));
};

// --- LOCKS ---
export const fetchGlobalLock = async (month: string): Promise<boolean> => {
    return false; // Always unlocked in demo initially
};

export const toggleGlobalLock = async (month: string, isLocked: boolean, managerId: string) => {
    // Just fake it for UI feedback
    await delay();
};

// --- NOTIFICATIONS ---
export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
    await delay();
    const all = JSON.parse(localStorage.getItem(LS_KEYS.NOTIFICATIONS) || '[]') as Notification[];
    return all.filter(n => n.userId === userId);
};

export const createNotification = async (userId: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', senderId?: string) => {
    const all = JSON.parse(localStorage.getItem(LS_KEYS.NOTIFICATIONS) || '[]') as Notification[];
    all.unshift({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        message,
        type,
        isRead: false,
        createdAt: new Date().toISOString(),
        senderId
    });
    localStorage.setItem(LS_KEYS.NOTIFICATIONS, JSON.stringify(all));
};

export const createGlobalNotification = async (userIds: string[], message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    for (const uid of userIds) {
        await createNotification(uid, message, type);
    }
};

export const markNotificationAsRead = async (id: string) => {
    const all = JSON.parse(localStorage.getItem(LS_KEYS.NOTIFICATIONS) || '[]') as Notification[];
    const idx = all.findIndex(n => n.id === id);
    if (idx !== -1) {
        all[idx].isRead = true;
        localStorage.setItem(LS_KEYS.NOTIFICATIONS, JSON.stringify(all));
    }
};

export const markAllNotificationsAsRead = async (userId: string) => {
    const all = JSON.parse(localStorage.getItem(LS_KEYS.NOTIFICATIONS) || '[]') as Notification[];
    const updated = all.map(n => n.userId === userId ? { ...n, isRead: true } : n);
    localStorage.setItem(LS_KEYS.NOTIFICATIONS, JSON.stringify(updated));
};

// --- REALTIME (MOCKED) ---
export const subscribeToPresence = (userId: string, onSync: (ids: string[]) => void) => {
    // Fake presence: The current user + Random active employees
    setTimeout(() => {
        onSync([userId, 'manager-1', 'worker-1']);
    }, 1000);
    return { unsubscribe: () => {} };
};

export const subscribeToNotifications = (userId: string, onNewNotification: (n: Notification) => void) => {
    return { unsubscribe: () => {} };
};

// --- STORAGE ---
export const uploadAttachment = async (file: File): Promise<string | null> => {
    await delay(1000); // Fake upload time
    // Return a fake placeholder image to verify UI works
    return "https://via.placeholder.com/600x800.png?text=Demo+Attachment";
};
