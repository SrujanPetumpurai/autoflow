
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
export const HOOKS_URL = "https://zapier-clone-hook.onrender.com"
export const PROVIDER_CONFIG: Record<string, { connectUrl: string }> = {
  google: { connectUrl: `${BACKEND_URL}/api/v1/google` },
  github: { connectUrl: `${BACKEND_URL}/api/v1/github` },
  gmail:{connectUrl:`${BACKEND_URL}/api/v1/gmail/auth`}
}