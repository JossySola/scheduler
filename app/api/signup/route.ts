import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import pool from "@/app/lib/mocks/db";

export async function POST (
    request: NextRequest
) {
    const req = await request.json();
    
    const name = req.name;
    const username = req.username;
    const birthday = req.birthday;
    const email = req.email;
    const password = req.password;
    const id = uuidv4();

    
    /*
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    'CREATE TABLE IF NOT EXISTS scheduler_users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        username VARCHAR(15) NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        birthday TEXT NOT NULL,
        password TEXT NOT NULL
    );

    await pool.query(`
        INSERT INTO scheduler_users (id, name, username, email, birthday, password)
            VALUES (
                ${id}
                "${name}",
                "${username}",
                "${email}",
                ${birthday},
                "${password}"
            )
        ON CONFLICT (id) DO NOTHING;
    `)
    */
    return NextResponse.json({  })
}