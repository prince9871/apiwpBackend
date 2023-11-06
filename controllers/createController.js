const dbModel = require('../models/db')

const dbCreate = async (req, res) => {
  try {
    const newDbModel = new dbModel()

    newDbModel.name = req.body.name.toLowerCase()
    newDbModel.code = req.body.code
    newDbModel.quantity = req.body.quantity

    await newDbModel.save()

    return res.status(201).json({ message: 'New entry created successfully!' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const dbGet = async (req, res) => {
  try {
    const name = req.query.name.toLowerCase()
    let result = await dbModel.findOne({ name: name })
    console.log(result)
    return res.send({ data: result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const dbApiSend = async (req, res) => {
  console.log('cooming in this fuctnion')
  const { number, type, message, instance_id, access_token } = req.query;

  if (!number || !type || !message || !instance_id || !access_token) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  console.log('coming in backend')

  try {
    const result = await fetch(`https://ai.botcontrolpanel.com/api/send?number=${number}&type=${type}&message=${message}&instance_id=${instance_id}&access_token=${access_token}`, {
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      }
    });

    if (result.ok) {
      const data = await result.json();
      console.log('Backend Hit dbApiSend successfully:', data);
      res.json(data);
    } else {
      result = await result.json();
      console.log(result);
      console.log('Error in data fetching');
      res.status(result.status).json({ error: 'Error in data fetching' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const dbApiMessages =  async (req, res) => {
  const userMessage = req.body.message.toLowerCase();

  if (userMessage === '1 product name') {
    const product = await dbModel.findOne({ name: 'Product Name' }); 
    if (product) {
      const response = `${product.name} quantity is ${product.quantity}`;
      res.json({ message: response });
    } else {
      res.json({ message: 'Product not found' });
    }
  } else {
    res.json({ message: 'Invalid input' });
  }
}

module.exports = { dbCreate, dbGet, dbApiSend,dbApiMessages }
