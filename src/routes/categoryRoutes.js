import { getAllCategories ,addNewCategory,deleteCategoy,updateCategoty} from "../controllers/categoryController.js";
import express from 'express';


const router=express.Router();
router.get('/',getAllCategories);
router.post('/',addNewCategory);
router.delete('/:id',deleteCategoy);
router.patch('/:id',updateCategoty);




export default router;



