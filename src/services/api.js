// src/services/api.js
const API_BASE_URL = '/api'; // db.json is in public/api

let DB_CACHE = {
    users: [],
    courses: [],
    siteStats: { totalRevenue: 0 }
};
let dataInitialized = false;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const initializeData = async () => {
    if (dataInitialized) return;
    try {
        const response = await fetch(`${API_BASE_URL}/db.json?${new Date().getTime()}`); // Cache buster
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for db.json`);
        const jsonData = await response.json();
        DB_CACHE = {
            users: jsonData.users.map(u => ({ ...u, enrolledCourses: u.enrolledCourses || [] })),
            courses: jsonData.courses,
            siteStats: jsonData.siteStats
        };
        dataInitialized = true;
        console.log("Mock API: Data initialized", DB_CACHE);
    } catch (error) {
        console.error("Mock API: Failed to initialize data:", error);
        // Fallback or re-throw if critical
        DB_CACHE = { users: [], courses: [], siteStats: { totalRevenue: 0 } };
        dataInitialized = true; // Prevent re-attempts
    }
};

// --- User API ---
export const getUsers = async () => {
    await initializeData();
    await delay(300);
    return [...DB_CACHE.users];
};

export const getUser = async (userId) => {
    await initializeData();
    await delay(100);
    return DB_CACHE.users.find(u => u.id === userId);
};

export const updateUser = async (userId, userData) => {
    await initializeData();
    await delay(400);
    const userIndex = DB_CACHE.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        DB_CACHE.users[userIndex] = { ...DB_CACHE.users[userIndex], ...userData };
        console.log("Mock API: Updated user", DB_CACHE.users[userIndex]);
        return { success: true, user: { ...DB_CACHE.users[userIndex] } };
    }
    return { success: false, message: "User not found" };
};

export const deleteUser = async (userId) => {
    await initializeData();
    await delay(400);
    const initialLength = DB_CACHE.users.length;
    DB_CACHE.users = DB_CACHE.users.filter(u => u.id !== userId);
    // Also remove user from any course enrollments (more complex if courses store enrolled user IDs)
    console.log("Mock API: Deleted user", userId);
    return { success: DB_CACHE.users.length < initialLength };
};

// --- Course API ---
export const getCourses = async () => {
    await initializeData();
    await delay(300);
    return [...DB_CACHE.courses];
};

export const getPublishedCourses = async () => {
    await initializeData();
    await delay(300);
    return DB_CACHE.courses.filter(c => c.status === 'Published');
}

export const getCourse = async (courseId) => {
    await initializeData();
    await delay(100);
    return DB_CACHE.courses.find(c => c.id === courseId);
};

export const createCourse = async (courseData, instructor) => {
    await initializeData();
    await delay(500);

    // Ensure price is a number before saving to the mock DB_CACHE
    const priceAsNumber = parseFloat(courseData.price);
    const finalPrice = isNaN(priceAsNumber) ? 0 : priceAsNumber; // Default to 0 if not a valid number

    const newCourse = {
        id: `course${Date.now()}`, // Simple unique ID
        ...courseData, // Spread the rest of the data
        price: finalPrice, // Use the ensured numeric price
        instructorId: instructor.id,
        instructorName: instructor.username, // Or a display name field from user object
        status: courseData.status || 'Draft',
        // enrollments: 0, // Not explicitly tracking enrollments count on course object in this simplified model
    };
    DB_CACHE.courses.push(newCourse);
    // Note: If you were writing to a real db.json file here, you'd JSON.stringify DB_CACHE
    // and write it. For this mock, it's in-memory.
    console.log("Mock API: Created course", newCourse);
    return { success: true, course: newCourse };
};

export const updateCourse = async (courseId, courseData) => {
    await initializeData();
    await delay(400);
    const courseIndex = DB_CACHE.courses.findIndex(c => c.id === courseId);
    if (courseIndex > -1) {
        // Ensure price is a number before updating
        const priceAsNumber = parseFloat(courseData.price);
        const finalPrice = isNaN(priceAsNumber) ? (DB_CACHE.courses[courseIndex].price || 0) : priceAsNumber; // Keep old price or 0 if new is invalid

        DB_CACHE.courses[courseIndex] = {
            ...DB_CACHE.courses[courseIndex],
            ...courseData,
            price: finalPrice, // Use the ensured numeric price
        };
        console.log("Mock API: Updated course", DB_CACHE.courses[courseIndex]);
        return { success: true, course: { ...DB_CACHE.courses[courseIndex] } };
    }
    return { success: false, message: "Course not found" };
};


export const deleteCourse = async (courseId) => {
    await initializeData();
    await delay(400);
    const initialLength = DB_CACHE.courses.length;
    DB_CACHE.courses = DB_CACHE.courses.filter(c => c.id !== courseId);
    // Also unenroll all users from this course
    DB_CACHE.users.forEach(user => {
        user.enrolledCourses = user.enrolledCourses.filter(id => id !== courseId);
    });
    console.log("Mock API: Deleted course", courseId);
    return { success: DB_CACHE.courses.length < initialLength };
};

export const getCoursesByFaculty = async (facultyId) => {
    await initializeData();
    await delay(200);
    return DB_CACHE.courses.filter(c => c.instructorId === facultyId);
};

// --- Enrollment API ---
export const enrollInCourse = async (userId, courseId) => {
    await initializeData();
    await delay(300);
    const user = DB_CACHE.users.find(u => u.id === userId);
    const course = DB_CACHE.courses.find(c => c.id === courseId);
    if (user && course) {
        if (!user.enrolledCourses.includes(courseId)) {
            user.enrolledCourses.push(courseId);
            // course.enrollments = (course.enrollments || 0) + 1; // If tracking on course obj
            console.log(`Mock API: User ${userId} enrolled in ${courseId}`);
            return { success: true };
        }
        return { success: false, message: "Already enrolled" };
    }
    return { success: false, message: "User or Course not found" };
};

export const unenrollFromCourse = async (userId, courseId) => {
    await initializeData();
    await delay(300);
    const user = DB_CACHE.users.find(u => u.id === userId);
    if (user) {
        const initialLength = user.enrolledCourses.length;
        user.enrolledCourses = user.enrolledCourses.filter(id => id !== courseId);
        // const course = DB_CACHE.courses.find(c => c.id === courseId);
        // if (course && course.enrollments > 0) course.enrollments -=1;
        console.log(`Mock API: User ${userId} unenrolled from ${courseId}`);
        return { success: user.enrolledCourses.length < initialLength };
    }
    return { success: false, message: "User not found" };
};

export const getEnrolledCoursesForUser = async (userId) => {
    await initializeData();
    await delay(200);
    const user = DB_CACHE.users.find(u => u.id === userId);
    if (user) {
        return user.enrolledCourses.map(courseId => DB_CACHE.courses.find(c => c.id === courseId)).filter(Boolean);
    }
    return [];
};

export const getStudentsInCourse = async (courseId) => {
    await initializeData();
    await delay(200);
    return DB_CACHE.users.filter(user => user.enrolledCourses.includes(courseId));
};


// --- Admin Dashboard Specific Data ---
export const getAdminDashboardStats = async () => {
    await initializeData();
    await delay(500);

    const totalUsers = DB_CACHE.users.length;
    const activeCourses = DB_CACHE.courses.filter(c => c.status === 'Published').length;
    // More complex stats can be derived here
    let totalEnrollments = 0;
    DB_CACHE.users.forEach(u => totalEnrollments += u.enrolledCourses.length);

    // For charts - simple random data for now, or derive from join dates
    const labelsLast7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse();

    return {
        stats: {
            totalUsers,
            activeCourses,
            totalEnrollments, // Example new stat
            totalRevenue: DB_CACHE.siteStats.totalRevenue,
            facultyCount: DB_CACHE.users.filter(u => u.role === 'faculty').length,
            studentCount: DB_CACHE.users.filter(u => u.role === 'user').length,
        },
        registrationChartData: {
            labels: labelsLast7Days,
            datasets: [{
                label: 'New Users',
                data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5)),
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        // Add more chart data if needed
    };
};

// Helper to generate a unique ID if your db.json doesn't have one for new users
export const generateId = (prefix = '') => {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Used by AuthContext for registration
export const findUserByUsername = async (username) => {
    await initializeData();
    return DB_CACHE.users.find(u => u.username === username);
};

export const addUser = async (userData) => {
    await initializeData();
    const newUser = {
        id: generateId(userData.role.substring(0,1)), // e.g. u_random, f_random
        ...userData,
        joined: new Date().toISOString().split('T')[0],
        status: 'active',
        enrolledCourses: []
    };
    DB_CACHE.users.push(newUser);
    console.log("Mock API: Added new user", newUser);
    return { success: true, user: newUser };
};



// Optional: Function to get unique categories
export const getCourseCategories = async () => {
    await initializeData();
    const courses = await getPublishedCourses();
    const categories = new Set(courses.map(course => course.category));
    return Array.from(categories);
};

// Helper to get date N days ago in YYYY-MM-DD format
const getDateNDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
};

export const getAnalyticsData = async () => {
    await initializeData();
    await delay(600); // Simulate slightly longer fetch for more data

    const users = [...DB_CACHE.users];
    const courses = [...DB_CACHE.courses];

    // 1. User Registration Trend (e.g., last 30 days)
    const registrationTrend = {
        labels: [],
        data: [],
    };
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const dailyRegistrations = {};
    for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(thirtyDaysAgo.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        registrationTrend.labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        dailyRegistrations[dateString] = 0;
    }
    users.forEach(user => {
        if (user.joined && user.joined >= thirtyDaysAgo.toISOString().split('T')[0]) {
            dailyRegistrations[user.joined] = (dailyRegistrations[user.joined] || 0) + 1;
        }
    });
    registrationTrend.data = Object.values(dailyRegistrations);


    // 2. Course Categories Distribution (Pie Chart)
    const categoryCounts = {};
    courses.forEach(course => {
        categoryCounts[course.category] = (categoryCounts[course.category] || 0) + 1;
    });
    const courseCategoryDistribution = {
        labels: Object.keys(categoryCounts),
        data: Object.values(categoryCounts),
    };

    // 3. Enrollments per Course (Bar Chart - Top N courses)
    const enrollmentsPerCourse = {};
    users.forEach(user => {
        user.enrolledCourses.forEach(courseId => {
            enrollmentsPerCourse[courseId] = (enrollmentsPerCourse[courseId] || 0) + 1;
        });
    });
    const sortedCourseEnrollments = Object.entries(enrollmentsPerCourse)
        .map(([courseId, count]) => {
            const course = courses.find(c => c.id === courseId);
            return { name: course ? course.title : `Course ${courseId}`, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10

    const topCoursesByEnrollment = {
        labels: sortedCourseEnrollments.map(c => c.name),
        data: sortedCourseEnrollments.map(c => c.count),
    };

    // 4. User Role Distribution (Doughnut Chart)
    const roleCounts = { admin: 0, faculty: 0, user: 0 };
    users.forEach(user => {
        if (roleCounts.hasOwnProperty(user.role)) {
            roleCounts[user.role]++;
        }
    });
    const userRoleDistribution = {
        labels: Object.keys(roleCounts).map(role => role.charAt(0).toUpperCase() + role.slice(1)), // Capitalize
        data: Object.values(roleCounts),
    };

    return {
        registrationTrend,
        courseCategoryDistribution,
        topCoursesByEnrollment,
        userRoleDistribution,
        // Add more processed data as needed
    };
};