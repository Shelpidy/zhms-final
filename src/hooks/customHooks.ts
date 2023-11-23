import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";

export function useCurrentUser(): CurrentUser | null {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [cookie, setCookie] = useCookies(["token"]);
  useEffect(() => {
    if (cookie?.token) {
      let decodedToken: CurrentUser = jwtDecode(cookie.token);
      console.log({ decodedToken });
      setUser(decodedToken);
    } else {
      setUser(null);
    }
  }, []);

  return user;
}
