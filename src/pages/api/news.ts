// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { Client } from "@planetscale/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { page = 1, perPage = 20 }: any = req.query;

  const offset: any = (page - 1) * perPage;

  const client = new Client({
    host: process.env.HOST,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  });

  const conn = client.connection();
  const data = await conn.execute(
    `SELECT * FROM News LIMIT ${parseInt(perPage)} OFFSET ${parseInt(offset)}`
  );

  const count: any = await conn.execute("SELECT COUNT(*) AS count FROM News");

  res.status(200).json({
    news: data.rows,
    total: parseInt(count.rows[0].count),
  });
}
