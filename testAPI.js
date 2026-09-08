async function testFlow() {
  try {
    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sprinthub.com', password: '123456' })
    });
    const loginData = await loginRes.json();
    console.log('Login Status:', loginRes.status);
    console.log('Login Response:', loginData);
    
    if (loginRes.status !== 200) return;
    const token = loginData.token;
    
    const createRes = await fetch('http://localhost:4000/api/groups', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Group', description: 'Test Desc' })
    });
    const createData = await createRes.json();
    console.log('Create Status:', createRes.status);
    console.log('Create Response:', createData);
    
    const meRes = await fetch('http://localhost:4000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meData = await meRes.json();
    console.log('Me Status:', meRes.status);
    console.log('Me Response:', meData);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testFlow();
