import express from 'express'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js'
import addressRoutes from './routes/addressRoutes.js'
const port = 3000;
const app = express();
app.use(express.json())

//app._router(userRoutes);

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)
app.use('/addresses',addressRoutes)
app.use((err, req, res, next) => {
    // إذا كان الخطأ بسبب صيغة JSON غير صحيحة
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            status: "fail",
            message: "(Invalid JSON syntax)"
        });
    }

    // لأي أخطاء أخرى عامة
    return res.status(err.status || 500).json({
        status: "error",
        message: err.message || "حدث خطأ في السيرفر"
    });
});

export default app;




