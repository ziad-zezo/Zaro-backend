import Category from '../models/Category.js';


export const getAllCategories = async (req, res) => {
    try {

        const categories = await Category.find();
        //check if there are no category
        return res.status(200).json({
            success: 'true',
            count: categories.length,
            data: categories,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};


export const addNewCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        // validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'A category with this name already exists'
            });
        }

        const newCategory = await Category.create({
            name,
            description,
            image
        });


        return res.status(201).json({
            success: true,
            data: newCategory
        });

    } catch (error) {
        // Handle Mongoose duplicate key error (fallback)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category name must be unique'
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // Catch-all internal server error
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

export const updateCategoty = async (req, res) => {

    try {
        const categoryId = req.params.id;
        const updateData = req.body;
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No data provided for update!" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true, runValidators: true });

        //if the category does not exist

        if(!updatedCategory){
            return res.status(400).json({
                success:false,
                message:"Category not found"
            })
        }

        res.status(200).json({
            success: true,
            data: updatedCategory
        }
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteCategoy = async (req, res) => {
    try {
        const categoryId = req.params.id;
        //check if the category exist
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category not found"
            });
        }

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        res.status(200).json({
            success: true,
            data: deletedCategory
        });


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}