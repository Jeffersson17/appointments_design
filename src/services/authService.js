import { loginRequest } from "@/api/auth";

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

export const login = async ({ email, password }) => {
  const { data } = await loginRequest({ email, password });
  const accessToken = data.access;
  const refreshToken = data.refresh ?? null;
  const user = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
  };

  sessionStorage.setItem("access_token", accessToken);
  if (refreshToken) {
    sessionStorage.setItem("refresh_token", refreshToken);
  }

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const logout = async () => {
  try {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("auth_user");
  } catch (error) {
    console.error("Erro durante o logout:", error);
  }
  await delay(80);
};
