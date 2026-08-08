import express from 'express'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js';
const port = 3000;
const app = express();
app.use(express.json())

//app._router(userRoutes);

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/categories',categoryRoutes);
//app.get('df',(req,res)=>)
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




