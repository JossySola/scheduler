import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import * as argon2 from "argon2";
import pool from "@/app/lib/mocks/db";

export async function POST (
    request: NextRequest
) {
    const incoming = await request.json();
    
    const name = incoming.name;
    const username = incoming.username;
    const birthday = incoming.birthday;
    const email = incoming.email;
    const password = argon2.hash(incoming.password);
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