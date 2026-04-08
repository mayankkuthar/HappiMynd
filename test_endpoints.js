const axios = require('axios');

const BASE_URL = 'https://happimynd.com';

// List of endpoints to test
const endpoints = [
  { method: 'POST', path: '/api/v1/start-assessment', data: { platform: 'android' }, auth: true },
  { method: 'GET', path: '/api/v1/mood-emoji-list', data: null, auth: true },
  { method: 'POST', path: '/api/v1/psychologist-listing', data: { search: '' }, auth: true },
  { method: 'POST', path: '/api/v1/login', data: { username: 'test', password: 'test', device_token: 'TestDeviceToken' }, auth: false },
];

async function testEndpoint(endpoint, token = null) {
  const url = `${BASE_URL}${endpoint.path}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token && endpoint.auth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${endpoint.method} ${url}`);
  console.log(`${'='.repeat(60)}`);

  try {
    let response;
    
    if (endpoint.method === 'POST') {
      response = await axios.post(url, endpoint.data, { headers, timeout: 10000 });
    } else if (endpoint.method === 'GET') {
      response = await axios.get(url, { headers, timeout: 10000 });
    }

    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Response:`, JSON.stringify(response.data, null, 2).substring(0, 500));
    return { success: true, token: response.data?.user?.access_token || token };
  } catch (error) {
    console.log(`❌ Error: ${error.response?.status || error.message}`);
    if (error.response?.data) {
      console.log(`❌ Response:`, JSON.stringify(error.response.data, null, 2).substring(0, 500));
    }
    return { success: false, token };
  }
}

async function runTests() {
  console.log('🚀 Starting API Endpoint Tests...');
  console.log(`📍 Base URL: ${BASE_URL}`);
  
  let token = null;

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint, token);
    if (result.token && !token) {
      token = result.token;
      console.log(`\n🔑 Got auth token: ${token.substring(0, 50)}...`);
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Testing Complete!');
  console.log(`${'='.repeat(60)}\n`);
}

runTests().catch(console.error);
