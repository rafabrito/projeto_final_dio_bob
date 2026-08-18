# DIO Explorer — MCP Server

MCP server that exposes the three DIO Explorer capabilities as tools accessible by any MCP-compatible client (Bob, Claude Desktop, etc.) via **stdio** or **HTTP**.

---

## Tools

| Tool | Description |
|---|---|
| `trilha` | Find DIO study tracks by technology and return a full study plan |
| `desafio` | Generate a random coding challenge for a given level and technology |
| `certificado` | Generate a fictional DIO completion certificate in Markdown |

## Resource

| URI | Description |
|---|---|
| `dio://trilhas` | Full JSON catalogue of all available DIO study tracks |

---

## Usage

### Option 1 — stdio (Bob / Claude Desktop)

The server is already registered in `.bob/mcp.json` for this workspace. Bob will spawn it automatically.

To register it manually in another tool, add to your `mcp.json`:

```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": ["/absolute/path/to/mcp/build/index.js"]
    }
  }
}
```

### Option 2 — HTTP server

Run as a standalone HTTP server (useful for remote access or API integrations):

```bash
# default port 3456
DIO_MCP_HTTP=1 node build/index.js

# custom port
DIO_MCP_HTTP=1 DIO_MCP_PORT=8080 node build/index.js
```

Endpoints:
- `POST /mcp` — MCP Streamable HTTP transport (send JSON-RPC here)
- `GET  /health` — health check, returns `{"status":"ok","server":"dio-explorer","version":"1.0.0"}`

---

## Development

```bash
# install dependencies
cd mcp
npm install

# build (TypeScript → JavaScript)
npm run build

# rebuild and watch (requires nodemon or --watch support)
npm run dev
```

### Project layout

```
mcp/
├── src/
│   └── index.ts      # Server implementation (TypeScript)
├── build/
│   └── index.js      # Compiled output (run this)
├── package.json
└── tsconfig.json
```

---

## Tool reference

### `trilha`

```
Input:
  tecnologia  string  — Technology to search (e.g. "React", "Python", "Machine Learning")

Output:
  Plain-text study plan with modules, badges, XP, and promotion info
```

### `desafio`

```
Input:
  nivel       enum    — "basico" | "intermediario" | "avancado"
  tecnologia  string  — Target technology (e.g. "JavaScript", "React")

Output:
  Plain-text challenge with title, description, requirements, example, tip, XP and deadline
```

### `certificado`

```
Input:
  nome        string  — Full name of the student (e.g. "Ana Silva")
  tecnologia  string  — Technology / track to certify (e.g. "React")

Output:
  Markdown certificate
```
