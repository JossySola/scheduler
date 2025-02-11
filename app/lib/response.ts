import { NextResponse } from "next/server";

type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    metadata?: {
        timestamp: string;
        path?: string;
    };
};

export class ResponseHandler {
    static success<T>(data: T, status: number = 200): NextResponse {
        const response: ApiResponse<T> = {
            success: true,
            data,
            metadata: {
                timestamp: new Date().toISOString(),
            }
        }
        return NextResponse.json(response, { status });
    }

    static error (
        message: string,
        code: string = 'INTERNAL_ERROR',
        status: number = 500,
        details?: any
    ) : NextResponse {
        const response: ApiResponse = {
            success: false,
            error: {
                code,
                message,
                details
            },
            metadata: {
                timestamp: new Date().toISOString(),
            }
        };
        return NextResponse.json(response, { status });
    }
}
export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;