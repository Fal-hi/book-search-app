import axios from "axios";

export default async function handler(req: any, res: any) {
  const options = {
    method: 'GET',
    url: `https://hapi-books.p.rapidapi.com/search/${req.query.title}`,
    headers: {
      'X-RapidAPI-Key': process.env.API_KEY,
      'X-RapidAPI-Host': 'hapi-books.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options)
    res.status(200).json(response.data)
  } catch (error) {
    console.log(error)
  }
}