import express from 'express';
import Redis from 'ioredis';

const app=express();
app.use(express.json());

const redis=new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const Queue_Key='queue:emails'

app.post("/email",async (req, res)=>{

    const job={
        to=req.body.to,
        subject=req.body.subject || "No Subject",
        body=req.body.body ||"NO Content",
        createdAt=new Date().toISOString(),
    };
    await redis.lpush(Queue_Key,JSON.stringify(job));
    res.json({queued:true,job});

});

app.get("/email/process-one",async (req,res)=>{
    const rawJob=await redis.rpop(Queue_Key);
    if(!rawJob){
        return res.json({message:'No jobs in queue'});
    }
    const job=JSON.parse(rawJob);
    // Simulate email sending
    res.json({message:'Email sent',job});
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});