import { createCookieSessionStorage } from "@remix-run/node";

export type UserSessionData = {
  username: string
}

export const auth = async (request: Request) => {
  const session = await userSessionStorage.getSession(request.headers.get("Cookie"));
  return {
    username: session.get("username"),
  } as UserSessionData
}

export const userSessionStorage = createCookieSessionStorage<UserSessionData>({
  cookie: {
      name: "__session",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET as string],
      secure: true,
    },
})