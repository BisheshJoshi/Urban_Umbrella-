type JsonValue = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

// Helper to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_HISTORY = [
  { id: 1, type: "URL", target: "uniswap.org", risk: "safe", date: "2026-04-13", score: 12 },
  { id: 2, type: "Contract", target: "TokenSale.sol", risk: "caution", date: "2026-04-12", score: 55 },
  { id: 3, type: "URL", target: "app.aave.com", risk: "safe", date: "2026-04-12", score: 8 },
  { id: 4, type: "URL", target: "free-nft-drop.xyz", risk: "danger", date: "2026-04-11", score: 91 },
  { id: 5, type: "Contract", target: "StakingPool.json", risk: "safe", date: "2026-04-10", score: 22 },
];

export async function mockApiGet<T>(path: string, authToken?: string): Promise<T> {
  await delay(600); // Simulate latency

  if (path === "/scans/history") {
    // Only return history if authenticated
    if (authToken) {
      return { scans: MOCK_HISTORY } as unknown as T;
    }
    return { scans: [] } as unknown as T;
  }

  if (path === "/auth/me") {
    return { authenticated: !!authToken } as unknown as T;
  }

  throw new Error(`Mock endpoint not implemented: GET ${path}`);
}

export async function mockApiPost<T>(path: string, body: JsonValue, _authToken?: string): Promise<T> {
  await delay(800); // Simulate latency

  if (path === "/auth/nonce") {
    return { 
      message: `Sign this message to verify your wallet for Urban Umbrella Platform.\n\nNonce: ${Math.random().toString(36).substring(7)}`,
      typedData: {
        domain: { name: 'Urban Umbrella', version: '1', chainId: (body as any)?.chainId || 1 },
        message: { action: 'authenticate' },
        primaryType: 'Auth',
        types: { Auth: [{ name: 'action', type: 'string' }] }
      }
    } as unknown as T;
  }

  if (path === "/auth/verify") {
    return { token: "mock_jwt_token_12345" } as unknown as T;
  }

  if (path === "/scan/url") {
    const url = (body as any)?.url || "";
    const lowerUrl = url.toLowerCase();

    let score = 0.05; // Default safe
    let findings: string[] = [];
    let recommendation = "";

    if (lowerUrl.includes("scam") || lowerUrl.includes("free-nft") || lowerUrl.includes("admin")) {
      score = 0.85; // Danger
      findings = ["Domain name matches known phishing patterns", "Hidden administration endpoints detected"];
      recommendation = "Do not connect your wallet or enter any sensitive information on this website.";
    } else if (lowerUrl.includes("test") || lowerUrl.includes("beta")) {
      score = 0.45; // Caution
      findings = ["This site appears to be in testing or development mode", "Some security headers are missing"];
      recommendation = "Exercise caution. Ensure you are not depositing real funds until verified.";
    } else {
      findings = ["SSL Certificate is valid", "No known malicious patterns found"];
      recommendation = "Website appears safe, but always remain vigilant.";
    }

    return {
      risk_score: score,
      findings,
      recommendation
    } as unknown as T;
  }

  if (path === "/scan/document") {
    const dataStr = JSON.stringify((body as any)?.data || {});
    let score = 0.1; // Default safe
    const findings: string[] = [];

    if (dataStr.includes("transfer_all") || dataStr.includes("owner") || dataStr.includes("drain")) {
      score = 0.75; // Danger
      findings.push("Identified functions that can drain user funds.");
      findings.push("Ownership privilege escalation patterns detected.");
    } else if (dataStr.includes("upgrade")) {
      score = 0.55; // Caution
      findings.push("Upgradeable contract proxy pattern detected. Verify the admin address.");
    } else {
      findings.push("No highly privileged functions found.");
      findings.push("Contract structure matches standard safe patterns.");
    }

    return {
      risk_score: score,
      findings,
      recommendation: score > 0.6 ? "Critical issues found. Avoid interacting with this contract." : "Standard contract patterns observed."
    } as unknown as T;
  }

  throw new Error(`Mock endpoint not implemented: POST ${path}`);
}

export function readMockApiBaseUrl(): string {
  return "mock://local";
}
