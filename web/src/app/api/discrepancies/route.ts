import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const { rows } = await pool.query('SELECT * FROM discrepancies ORDER BY margin DESC');
    
    // Parse the details JSON if it's stored as a string, otherwise use directly
    const formatted = rows.map((row: any) => ({
      ...row,
      details: typeof row.details === 'string' ? JSON.parse(row.details) : row.details,
      profit_percentage: (row.margin * 100).toFixed(2)
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('Failed to fetch discrepancies:', error);
    return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
  }
}
