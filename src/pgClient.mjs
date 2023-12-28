import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";
class DBConnect {
  static pool;
  static async connect() {
    this.pool = new Pool({
      connectionString: process.env.PG_CONNECTION_STRING,
    });
  }

  static async insertData(
    pon,
    date,
    time,
    imageUrl,
    location,
    receiver,
    signature
  ) {
    const query = {
      text:
        "Insert into proof_of_delivery (purchase_order_number, date, time_of_delivery, image_url, location_of_delivery, receiver_name, signature_url)" +
        "VALUES ($1, $2, $3, $4, $5, $6, $7)",
      values: [pon, date, time, imageUrl, location, receiver, signature],
    };
    try {
      const res = await this.pool.query(query);
      return res.rows[0];
    } catch (err) {
      console.error(err);
    } finally {
      this.pool.end();
    }
  }
}

export default DBConnect;
