import express from 'express'
import cors from 'cors'
import categoriesRouter from './routes/categories'
import productRouter from './routes/products'
import orderRouter from './routes/orders'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/categories', categoriesRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

app.use((req, res) => {
  res.status(404).json({error: 'Not found'});
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));