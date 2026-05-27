import exress from 'express';
import {emailQueue} from './queue.js';

const app=express();
app.use(exress.json());


app.post("/welcome-email",async (req, res)=>{
    const job=emailQueue.add('Send welcome-email',{
        to:req.body.to,
        name:req.body.name || Leaner},
        {
            attempts:3,
            backoff:{
            type:'exponential',
            delay:5000,
        }
    });
    res.json({queued:true,jobId:job.id});
        }
);


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});

