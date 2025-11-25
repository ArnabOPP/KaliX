(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/csv-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Google Sheets CSV fetching and parsing service
__turbopack_context__.s([
    "fetchUsersFromCSV",
    ()=>fetchUsersFromCSV,
    "findUserByEmail",
    ()=>findUserByEmail,
    "getAllUsers",
    ()=>getAllUsers
]);
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSoUrbuhtYLt8rgvqUa50dR1t8xYvrZvIZE0HXP3otUOEKICNi52AaKMs1W_sKcnTEsJlYNnRRcq1Qr/pub?gid=0&single=true&output=csv";
// Parse CSV text into records - improved parser for edge cases
function parseCSV(text) {
    const lines = text.trim().split("\n").filter((line)=>line.trim().length > 0);
    console.log("[v0] CSV lines count:", lines.length);
    console.log("[v0] First line (headers):", lines[0]);
    if (lines.length === 0) {
        console.log("[v0] No data found in CSV");
        return [];
    }
    const headers = lines[0].split(",").map((h)=>h.trim().toLowerCase());
    console.log("[v0] Parsed headers:", headers);
    const records = lines.slice(1).map((line, idx)=>{
        const values = line.split(",").map((v)=>v.trim());
        const record = {};
        headers.forEach((header, index)=>{
            record[header] = values[index] || "";
        });
        if (record.email) {
            console.log(`[v0] Row ${idx + 2}: ${record.email}`);
        }
        return record;
    });
    console.log("[v0] Total records parsed:", records.length);
    return records;
}
// Fetch and cache CSV data
let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
;
async function fetchUsersFromCSV() {
    // Return cached data if still valid
    if (cachedData && Date.now() - lastFetchTime < CACHE_DURATION) {
        console.log("[v0] Returning cached data");
        return cachedData;
    }
    try {
        console.log("[v0] Fetching CSV from:", CSV_URL);
        const response = await fetch(CSV_URL, {
            cache: "no-store"
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvText = await response.text();
        console.log("[v0] CSV response length:", csvText.length);
        console.log("[v0] First 500 chars:", csvText.substring(0, 500));
        const records = parseCSV(csvText);
        cachedData = records.filter((record)=>record.email && record.email.length > 0).map((record)=>({
                email: record.email || "",
                password: record.password || "",
                name: record.name || "",
                status: record.status?.toLowerCase() || "offline",
                phone: record.contact || ""
            }));
        console.log("[v0] Processed users count:", cachedData.length);
        console.log("[v0] Processed users:", cachedData);
        lastFetchTime = Date.now();
        return cachedData;
    } catch (error) {
        console.error("[v0] Failed to fetch CSV:", error);
        return [];
    }
}
async function findUserByEmail(email) {
    const users = await fetchUsersFromCSV();
    const found = users.find((u)=>u.email.toLowerCase() === email.toLowerCase());
    console.log("[v0] Finding user:", email, "Found:", !!found);
    return found;
}
async function getAllUsers() {
    return fetchUsersFromCSV();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$csv$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/csv-service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [userContacts, setUserContacts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Check if user is already logged in on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const storedUser = localStorage.getItem("kali_user");
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    loadUserContacts(parsedUser.email);
                } catch  {
                    localStorage.removeItem("kali_user");
                }
            }
            setIsLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    const loadUserContacts = async (userEmail)=>{
        try {
            const allUsers = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$csv$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllUsers"])();
            console.log("[v0] All users loaded:", allUsers.length);
            console.log("[v0] Current user email:", userEmail);
            const contactDetails = allUsers.filter((u)=>u.email.toLowerCase() !== userEmail.toLowerCase()).map((contact)=>({
                    id: contact.email,
                    userId: userEmail,
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone,
                    status: contact.status?.toLowerCase() || "offline",
                    avatar: contact.name.substring(0, 2).toUpperCase(),
                    department: "TEAM"
                }));
            console.log("[v0] Final contacts:", contactDetails);
            setUserContacts(contactDetails);
        } catch (error) {
            console.error("[v0] Failed to load contacts:", error);
            setUserContacts([]);
        }
    };
    const login = async (email, password)=>{
        setIsLoading(true);
        try {
            await new Promise((resolve)=>setTimeout(resolve, 500));
            const csvUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$csv$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findUserByEmail"])(email);
            if (!csvUser || csvUser.password !== password) {
                throw new Error("Invalid email or password");
            }
            const userData = {
                id: email,
                name: csvUser.name,
                email: csvUser.email,
                avatar: csvUser.name.substring(0, 2).toUpperCase(),
                status: csvUser.status
            };
            setUser(userData);
            await loadUserContacts(email);
            localStorage.setItem("kali_user", JSON.stringify(userData));
        } finally{
            setIsLoading(false);
        }
    };
    const logout = ()=>{
        setUser(null);
        setUserContacts([]);
        localStorage.removeItem("kali_user");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isLoading,
            login,
            logout,
            userContacts
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "0fa8Atave/GSVNrOhaywDIXuLLE=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_b52d7b24._.js.map