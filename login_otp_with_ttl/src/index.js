import express from 'express';
import Redis from 'ioredis'


const app=express();
app.use(express.json());
const redis=new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


function otpKey(phone){
    return `otp:${phone}`;

}

app.post('/otp',async (req,res)=>{
    const {phone}=req.body;
    const otp=Math.floor(100000 + Math.random()* 90000).toString();

    await redis.set(otpKey(phone),otp,'EX',300);

    res.json({message:'Otp has been sent',otp});

});


app.post('/otp/verify',async (req,res)=>{
    const {phone,otp}=req.body;
    const storedOtp=await redis.get(otpKey(phone));
    if(!storedOtp){
        return res.status(400).json({message:'Otp expired or not found'});
    }
    if(storedOtp!==otp){
        return res.status(400).json({message:'Invalid otp'});
    }

    await redis.del(otpKey(phone));

    });

app.get('/otp/:phone/ttl',async (req,res)=>{
    const ttl=await redis.ttl(otpKey(req.params.phone));    
    res.json({ttl});
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});