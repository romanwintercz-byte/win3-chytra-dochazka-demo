
import { Employee, Job, TimeEntry, WorkType, TimesheetStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

// 1. ZAMĚSTNANCI
export const MOCK_EMPLOYEES: Employee[] = [
    {
        id: 'manager-1',
        name: 'Ing. Petr Ředitel',
        email: 'petr@stavby-design.cz',
        role: 'Manager',
        avatar: 'https://ui-avatars.com/api/?name=Petr+Reditel&background=0F172A&color=fff&size=128',
        isActive: true
    },
    {
        id: 'worker-1',
        name: 'Karel Dělník',
        email: 'karel@stavby-design.cz',
        role: 'Zaměstnanec',
        avatar: 'https://ui-avatars.com/api/?name=Karel+Delnik&background=EA580C&color=fff&size=128',
        isActive: true,
        pinCode: '1234'
    },
    {
        id: 'worker-2',
        name: 'Jana Administrativa',
        email: 'jana@stavby-design.cz',
        role: 'Zaměstnanec',
        avatar: 'https://ui-avatars.com/api/?name=Jana+Admin&background=4F46E5&color=fff&size=128',
        isActive: true
    },
    {
        id: 'worker-3',
        name: 'Tomáš Nováček (Archiv)',
        email: 'tomas@stavby-design.cz',
        role: 'Zaměstnanec',
        avatar: 'https://ui-avatars.com/api/?name=Tomas+Novacek&background=94A3B8&color=fff&size=128',
        isActive: false
    }
];

// 2. ZAKÁZKY
export const MOCK_JOBS: Job[] = [
    { id: 'job-1', code: 'ZAK-2024-01', name: 'Rezidence Parková (Byty)', isActive: true },
    { id: 'job-2', code: 'ZAK-2024-05', name: 'Admin. budova Centrum', isActive: true },
    { id: 'job-3', code: 'INT-001', name: 'Interní / Porady / Dílna', isActive: true },
    { id: 'job-4', code: 'SRV-KLIENT', name: 'Servisní výjezdy', isActive: true },
    { id: 'job-old', code: 'OLD-2023', name: 'Dokončený projekt 2023', isActive: false }
];

// 3. GENERÁTOR DAT (Aby to vypadalo živě)
const generateEntries = (): TimeEntry[] => {
    const entries: TimeEntry[] = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // Current month (0-11)
    
    const yearStr = year.toString();
    const monthStr = String(month + 1).padStart(2, '0');

    // --- KAREL (Má vzorně vyplněno, ale s přesčasy) ---
    for (let d = 1; d <= 15; d++) {
        const dateObj = new Date(year, month, d);
        if (dateObj.getDay() === 0 || dateObj.getDay() === 6) continue; // Skip weekends
        const dateIso = dateObj.toISOString().split('T')[0];

        entries.push({
            id: uuidv4(),
            employeeId: 'worker-1',
            date: dateIso,
            project: 'Rezidence Parková (Byty)',
            description: 'Montáž sádrokartonu a izolace',
            hours: 8,
            type: WorkType.REGULAR
        });
        
        // Občas přesčas
        if (d % 3 === 0) {
             entries.push({
                id: uuidv4(),
                employeeId: 'worker-1',
                date: dateIso,
                project: 'Rezidence Parková (Byty)',
                description: 'Dokončování úseku A',
                hours: 2,
                type: WorkType.OVERTIME
            });
        }
    }
    // Karel - Nemoc
    entries.push({
        id: uuidv4(),
        employeeId: 'worker-1',
        date: new Date(year, month, 16).toISOString().split('T')[0],
        project: '',
        description: 'Chřipka',
        hours: 8,
        type: WorkType.SICK_DAY,
        attachmentUrl: 'https://cdn-icons-png.flaticon.com/512/2966/2966486.png' // Mock attachment
    });

    // --- JANA (Má tam díry - pro ukázku validace) ---
    for (let d = 1; d <= 10; d += 2) { // Vynechává dny
        const dateObj = new Date(year, month, d);
        if (dateObj.getDay() === 0 || dateObj.getDay() === 6) continue;
        const dateIso = dateObj.toISOString().split('T')[0];

        entries.push({
            id: uuidv4(),
            employeeId: 'worker-2',
            date: dateIso,
            project: 'Interní / Porady / Dílna',
            description: 'Fakturace a podklady',
            hours: 8,
            type: WorkType.REGULAR
        });
    }

    return entries;
};

export const MOCK_ENTRIES = generateEntries();
