# Run Project (API + Web + Playwright check)

Start both the .NET API and Next.js dev server as background processes, verify they are listening, and confirm Playwright MCP is reachable. Fix port conflicts automatically — no new terminal windows.

---

## Steps (execute in order)

### 1. Check ports
Run a single PowerShell command to detect whether port **5088** (API) and **3000** (web) are already in use:
```powershell
$api = netstat -ano | Select-String ":5088 " | Select-String "LISTENING"
$web = netstat -ano | Select-String ":3000 " | Select-String "LISTENING"
"API :5088 in use: $($null -ne $api)"; "Web :3000 in use: $($null -ne $web)"
if ($api) { $api }; if ($web) { $web }
```

### 2. Kill occupying processes (if needed)
If either port is occupied, extract the PID from the `netstat` output and kill it:
```powershell
# example — replace <PID> with the actual value
Stop-Process -Id <PID> -Force
```

### 3. Start API (background)
```bash
cd "D:/My-Projects/amr-engineering-portfolio/apps/api/src/AmrPortfolio.Api" && dotnet run &
```
Run with `run_in_background: true`. Expected log line: `Now listening on: http://localhost:5088`

### 4. Start Web (background)
```bash
cd "D:/My-Projects/amr-engineering-portfolio" && npm run dev:web &
```
Run with `run_in_background: true`. Expected log line: `Ready in`

### 5. Verify both ports are listening
After both background tasks complete (or after ~5 s), recheck:
```powershell
$api = netstat -ano | Select-String ":5088 " | Select-String "LISTENING"
$web = netstat -ano | Select-String ":3000 " | Select-String "LISTENING"
"API :5088 listening: $($null -ne $api)"; "Web :3000 listening: $($null -ne $web)"
```

### 6. Smoke-test Playwright MCP
Call `mcp__playwright__browser_navigate` with `http://localhost:3000/en` and then `mcp__playwright__browser_snapshot` to confirm the page rendered. Report any console errors found.

---

## Output

Report concisely:
- API status (port + first log line)
- Web status (port + any warnings)
- Playwright status (reachable / not reachable)
- Any errors that need attention (broken imports, crash overlays, etc.)

Do **not** open new terminal windows or PowerShell processes — all work stays inside the Claude Code session.
