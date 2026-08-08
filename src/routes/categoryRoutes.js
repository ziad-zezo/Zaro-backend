import { getAllCategories ,addNewCategory} from "../controllers/categoryController.js";
import express from 'express';


const router=express.Router();
router.get('/',getAllCategories);
router.post('/',addNewCategory);




export default router;



