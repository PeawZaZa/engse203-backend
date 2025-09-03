// ขั้นที่ 1: Import Express
const express = require('express') // เติมให้ถูก
const cors = require('cors');

// ขั้นที่ 2: สร้าง app  
const app = express(); // เติมให้ถูก
const agent = [
    { code: "A001", name: "Alice", status: "available", loginTime: null},
    { code: "A002", name: "Bob", status: "busy", loginTime: null},
    { code: "A003", name: "Charlie", status: "offline", loginTime: null},
    { code: "A004", name: "David", status: "available", loginTime: null},
    { code: "A005", name: "Eve", status: "busy", loginTime: null}
]
const validStatuses = ["Available", "Active", "Wrap Up", "Not Ready", "Offline"];
// ขั้นที่ 3: กำหนด PORT
const PORT = 3001;
app.use(express.json()); // สำคัญมาก!
app.use(cors());
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

app.get('/api/agents/count', (req, res) => {
    res.json({
        success: true,
        count: agent.length,
        timestamp: new Date().toISOString()
    });
});
app.patch('/api/agents/:code/status', (req, res) => {
    const code = req.params.code;
    const newStatus = req.body.status;
    
     const agentIndex = agent.findIndex(a => a.code === code);
    if (agentIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Agent not found."
        });
    }
    if (!validStatuses.includes(newStatus)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status value. Must be one of: " + validStatuses.join(", ")
        });
    }
   
    const oldStatus = agent[agentIndex].status;
    agent[agentIndex].status = newStatus;
    console.log(`[${new Date().toISOString()}]Agent ${code} status changed from ${oldStatus} to ${newStatus}`);
    res.json({
        success: true,
        message: `Agent ${code} status updated from ${oldStatus}to ${newStatus}.`,
        data: agent[agentIndex],
        timestamp: new Date().toISOString()
    });
});

app.get('/api/dashboard/stats', (req, res) => {
    const totalAgents = agent.length;
    const available = agent.filter(a => a.status.toLowerCase() === "available").length;
    const busy = agent.filter(a => a.status.toLowerCase() === "busy").length;
    const offline = agent.filter(a => a.status.toLowerCase() === "offline").length;
    const active = agent.filter(a => a.status.toLowerCase() === "active").length;
    const wrapup = agent.filter(a => a.status.toLowerCase() === "wrap up").length;
    const notready = agent.filter(a => a.status.toLowerCase() === "not ready").length;

    const availablePercent = totalAgents > 0 ? Math.round((available / totalAgents) * 100) : 0;
    const busyPercent = totalAgents > 0 ? Math.round((busy / totalAgents) * 100) : 0;
    const offlinePercent = totalAgents > 0 ? Math.round((offline / totalAgents) * 100) : 0;
    const activePercent = totalAgents > 0 ? Math.round((active / totalAgents) * 100) : 0;
    const wrapupPercent = totalAgents > 0 ? Math.round((wrapup / totalAgents) * 100) : 0;
    const notreadyPercent = totalAgents > 0 ? Math.round((notready / totalAgents) * 100) : 0;

    res.json({
        success: true,
        data: 
        {
            totalAgents,
            statusBreakdown:
            {
                available: { count: available, percent: availablePercent },
                busy: { count: busy, percent: busyPercent },
                offline: { count: offline, percent: offlinePercent },
                active: { count: active, percent: activePercent },
                wrapup: { count: wrapup, percent: wrapupPercent },
                notready: { count: notready, percent: notreadyPercent }
            }
        },
        timestamp: new Date().toISOString()
    });
});
app.post('/api/agents/:code/login', (req, res) => {
    const agentCode = req.params.code;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Agent name is required in the request body."
        });
    }
    const existingAgent = agent.findIndex(a => a.code === agentCode);
    if (existingAgent == -1) {
        return res.status(400).json({
            success: false,
            message: `Agent with code ${agentCode} does not exist.`
        });
       
    }
     agent[existingAgent].loginTime = new Date().toISOString();
     agent[existingAgent].status = "Available";
        res.json({
            success: true,
            message: `Agent ${name} (code: ${agentCode}) logged in successfully.`,
            data: agent[existingAgent],
            timestamp: new Date().toISOString()
        });
});

app.post('/api/agents/:code/logout', (req, res) => {
    const agentCode = req.params.code;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Agent name is required in the request body."
        });
    }
    const existingAgent = agent.findIndex(a => a.code === agentCode);
    if (existingAgent == -1) {
        return res.status(400).json({
            success: false,
            message: `Agent with code ${agentCode} does not exist.`
        });
       
    }
     agent[existingAgent].loginTime = null;
     agent[existingAgent].status = "Offline";
        res.json({
            success: true,
            message: `Agent ${name} (code: ${agentCode}) logged out successfully.`,
            data: agent[existingAgent],
            timestamp: new Date().toISOString()
        });
});


// ขั้นที่ 5: เริ่ม server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});