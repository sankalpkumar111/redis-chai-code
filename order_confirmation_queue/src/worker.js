import {Worker} from 'bullmq';
import  {connection} from './queue.js ';



const worker=new Worker('emails',async job=>{
    "emails",
    console.log('Processing job:',job.id,job.name,job.data)
    await new Promise(resolve=>setTimeout(resolve,2000));
    console.log('Job completed:',job.id);

}, {connection})

worker.on('completed', job => {
    console.log(`Job ${job.id} has been completed`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} has failed with error:`, err);
});
