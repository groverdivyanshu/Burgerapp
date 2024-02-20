import express from "express";
import passport from "passport";
import { getAdminStats, getAdminUsers, login, logout, myProfile, register } from "../controllers/user.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router=express.Router();

router.post("/register",register)

router.post("/login",login)

router.get("/me",isAuthenticated,myProfile)
router.get("/logout",logout)

//Admin Routes

router.get("/admin/users",isAuthenticated,authorizeAdmin,getAdminUsers)
router.get("/admin/stats",isAuthenticated,authorizeAdmin,getAdminStats)
export default router;