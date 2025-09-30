import { zValidator } from "@hono/zod-validator";
import { success, z } from "zod";
import { Hono } from "hono";
import { loginSchema, registerSchema, updateProfileSchema } from "../schemas";
import { register } from "module";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constants";
import { da } from "date-fns/locale";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()

     .get("/current", sessionMiddleware, (c) => {
          const user = c.get("user");

          return c.json({ data: user });
     }
          
     )     

    .post("/login",
         zValidator("json", loginSchema), 
    async (c) => {

          const { email, password } = c.req.valid("json");
          
          const { account } = await createAdminClient();
          const session = await account.createEmailPasswordSession(
               email,
               password
          );

          setCookie(c, AUTH_COOKIE, session.secret, {
               httpOnly: true,
               secure: true,
               sameSite: "strict",
               path: "/",
               maxAge: 60 * 60 * 24 * 30, // 1 month
          });

          return c.json({ success: true });
   }
)

.post("/register",
     zValidator("json", registerSchema),
async (c) => {
     const { name, email, password } = c.req.valid("json");
     
     const { account } = await createAdminClient();
     const user = await account.create(ID.unique(),
      email, 
      password, 
      name,
     );

     const session = await account.createEmailPasswordSession(
          email,
          password,
     );

     setCookie(c, AUTH_COOKIE, session.secret, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30, // 1 month
     });

     return c.json({ success: true });
}
)

.post("/logout", sessionMiddleware, async (c) => {
     
     const account = c.get("account");

     deleteCookie(c, AUTH_COOKIE);
     await account.deleteSession("current");

     return c.json({ success: true });
})

.patch("/profile",
     sessionMiddleware,
     zValidator("json", updateProfileSchema),
     async (c) => {
          const { name, avatar, avatarPublicId } = c.req.valid("json");
          const account = c.get("account");

          try {
               const updatedUser = await account.updateName(name);
               // Note: Appwrite doesn't support custom avatar URLs directly
               // The avatar and avatarPublicId will be handled client-side for display purposes
               return c.json({ data: { ...updatedUser, avatar, avatarPublicId } });
          } catch (error) {
               return c.json({ error: "Failed to update profile" }, 400);
          }
     }
);

export default app;