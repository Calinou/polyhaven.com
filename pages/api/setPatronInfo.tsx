import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import crypto from 'crypto'
require('dotenv').config()

const Route = async (req, res) => {
  let data = req.body;
  data.key = crypto.createHmac('md5', process.env.PATRON_INFO_KEY).update(data.uuid).digest('hex')

  const baseUrl = (process.env.NODE_ENV == "production" || process.env.POLYHAVEN_API == "live") ? "https://api.polyhaven.com" : "http://localhost:3000"

  let returnData = {
    error: "500",
    message: "Unknown error"
  }
  await fetch(`${baseUrl}/patron_info`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => res.json())
    .then(resdata => {
      returnData = resdata
    })

  res.status(200).json(returnData);
}

export default withApiAuthRequired(Route);