// Test admin routes imports
import express from 'express';

console.log('Testing admin routes imports...');

try {
    console.log('1. Testing AuthAdmin middleware...');
    const { AuthAdmin } = await import('./middlewere/AdminAuth.js');
    console.log('✓ AuthAdmin imported successfully');

    console.log('2. Testing Admin controller functions...');
    const {
        adminLogin,
        getDashboardStats,
        getAllUsers,
        verifyUser,
        suspendUser,
        deleteUser,
        createAnnouncement,
        getAllAnnouncements,
        updateAnnouncement,
        deleteAnnouncement,
        bulkImportUsers,
        getBulkImportStatus,
        getBulkImportHistory,
        getAdminLogs
    } = await import('./controllers/Admin.js');
    console.log('✓ All Admin controller functions imported successfully');

    console.log('3. Testing multer...');
    const multer = await import('multer');
    console.log('✓ Multer imported successfully');

    console.log('4. Testing path...');
    const path = await import('path');
    console.log('✓ Path imported successfully');

    console.log('All admin route dependencies imported successfully!');
} catch (error) {
    console.error('Admin routes import error:', error.message);
    console.error('Stack:', error.stack);
}
