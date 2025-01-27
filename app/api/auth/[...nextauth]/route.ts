"use server"
import "server-only";
import { handlers } from "@/auth";

export const { GET, POST } = handlers;