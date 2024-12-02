import query from '../db/index.js';

export const createUser = async (req, res) => {
  const { email } = req.body.userData;
  console.log('create')
  console.log(email)

  try {
    const statement = `
      INSERT INTO users (email)
      VALUES ($1)
      RETURNING *
    `;
    const { rows } = await query(statement, [email]);

    res.status(201).send({ status: 'success', user: rows[0] });
  } catch (error) {
    console.error('Error creating new User', error);
    res.status(500).send({ error: 'Unable To Create New User' });
  }
}

export const loginUser = async (req, res) => {
  const { email } = req.body.userData;
  console.log('login')
  console.log(email)
  
  try {
    const statement = `
      SELECT *
      FROM users
      WHERE email = $1
    `;
    const { rows, rowCount } = await query(statement, [email]);
    console.log(rows)
    console.log(rowCount)

    if (rowCount === 0) {
      return res.status(404).json({ status: 'not_found' });
    }

    return res.status(200).json({ status: 'success', user: rows[0] });
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

export const portalController = {
  createUser,
  loginUser,
}