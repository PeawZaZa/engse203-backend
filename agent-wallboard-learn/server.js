// ขั้นที่ 1: Import Express
const express = require('express') // เติมให้ถูก

// ขั้นที่ 2: สร้าง app  
const app = express(); // เติมให้ถูก
const agent = [
    { id: "A001", name: "Alice", status: "available" },
    { id: "A002", name: "Bob", status: "busy" },
    { id: "A003", name: "Charlie", status: "offline" },
    { id: "A004", name: "David", status: "available" },
    { id: "A005", name: "Eve", status: "busy" }
]
// ขั้นที่ 3: กำหนด PORT
const PORT = 3001;

// ขั้นที่ 4: สร้าง route แรก
app.get('/', (req, res) => {
    res.send("Hello Agent Wallboard!");
}); // เติม method และ response function

app.get('/health', (req, res) => {
    res.json({
    "status": "OK",
    "timestamp": new Date().toISOString()
});
});
app.get('/api/agents', (req, res) => {
    res.json({
        sucess: true,
        data: agent,
        count: agent.length,
        timestamp: new Date().toISOString()
    });
    });
    
// ขั้นที่ 5: เริ่ม server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});