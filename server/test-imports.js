// Test file to check imports
console.log('Testing imports...');

try {
    console.log('1. Testing userModel...');
    const { userModel } = await import('./models/userModel.js');
    console.log('✓ userModel imported successfully');

    console.log('2. Testing Announcement...');
    const { Announcement } = await import('./models/Announcement.js');
    console.log('✓ Announcement imported successfully');

    console.log('3. Testing AdminLog...');
    const { AdminLog } = await import('./models/adminLogModel.js');
    console.log('✓ AdminLog imported successfully');

    console.log('4. Testing BulkImport...');
    const { BulkImport } = await import('./models/bulkImportModel.js');
    console.log('✓ BulkImport imported successfully');

    console.log('5. Testing SystemSettings...');
    const { SystemSettings } = await import('./models/systemSettingsModel.js');
    console.log('✓ SystemSettings imported successfully');

    console.log('6. Testing EventModel...');
    const { EventModel } = await import('./models/Event.js');
    console.log('✓ EventModel imported successfully');

    console.log('7. Testing Job...');
    const { Job } = await import('./models/jobModel.js');
    console.log('✓ Job imported successfully');

    console.log('8. Testing Post...');
    const { Post } = await import('./models/postModel.js');
    console.log('✓ Post imported successfully');

    console.log('All imports successful!');
} catch (error) {
    console.error('Import error:', error.message);
    console.error('Stack:', error.stack);
}
