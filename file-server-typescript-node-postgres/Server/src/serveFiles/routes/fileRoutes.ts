import { Router } from "express";
import { 
    getFiles, 
    getPrivateFilesForOneUser, 
    uploadFile,
    uploadOnePublicFile
} from "../controller";
import { 
    checkAdminStatus, 
    checkUserStatus, 
    upLoadOneFile
} from '../mdw';


const router = Router();
// TODO implement route for admin to load public files
router.get("/", checkAdminStatus, getFiles);
router.get("/:id/:email", checkUserStatus, getPrivateFilesForOneUser);
router.post("/upload/:id", checkUserStatus, upLoadOneFile, uploadFile);
router.post("/upload/admin/:id", checkAdminStatus, upLoadOneFile, uploadOnePublicFile);

export default router;