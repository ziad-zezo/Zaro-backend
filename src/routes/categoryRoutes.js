import { getAllCategories ,addNewCategory,deleteCategoy,updateCategoty, getCategory} from "../controllers/categoryController.js";
import express from 'express';


const router=express.Router();
router.get('/',getAllCategories);
router.get('/:id',getCategory)
router.post('/',addNewCategory);
router.delete('/:id',deleteCategoy);
router.patch('/:id',updateCategoty);




export default router;



