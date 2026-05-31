import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.$connect();
console.log('prisma connected');
import http from 'http';
http.createServer((req,res)=>res.end('ok')).listen(4001, ()=>console.log('up'));
