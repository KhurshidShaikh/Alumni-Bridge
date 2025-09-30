// Test script for analytics endpoint
import fetch from 'node-fetch';

const testAnalytics = async () => {
    try {
        // You'll need to replace this with a valid admin token
        const adminToken = 'your-admin-token-here';
        
        const response = await fetch('http://localhost:3000/api/admin/analytics?timeRange=30d', {
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Analytics endpoint working!');
            console.log('📊 Overview Stats:', data.data.overview);
            console.log('📈 Growth Metrics:', data.data.growthMetrics);
            console.log('🏢 Department Stats:', Object.keys(data.data.departmentStats));
            console.log('🔄 Recent Activity Count:', data.data.recentActivity.length);
        } else {
            console.log('❌ Analytics endpoint error:', data.error);
        }
    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
};

console.log('🧪 Testing Analytics Endpoint...');
console.log('⚠️  Make sure to replace the admin token in this file');
console.log('⚠️  Make sure the server is running on port 3000');
testAnalytics();
