const db = require('../db');

exports.insertarDatos = async (req, res) => {
  const { persona, direccion, ine } = req.body;

  // Validar o poner null para evitar undefined
  const nombre = persona.nombre ?? null;
  const aPaterno = persona.apellido_paterno ?? null;
  const aMaterno = persona.apellido_materno ?? null;
  const curp = persona.curp ?? null;
  const fechaNacimiento = persona.fechaNacimiento ?? null;
  const sexo = persona.sexo ?? null;

  const calle = direccion.calle ?? null;
  const numero = direccion.numero ?? null;
  const colonia = direccion.colonia ?? null;
  const municipio = direccion.municipio ?? null;
  const estado = direccion.estado ?? null;
  const cp = direccion.cp ?? null;

  const claveElector = ine.clave_elector ?? null;
  const anioRegistro = ine.anio_registro ?? null;
  const vigencia = ine.vigencia ?? null;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const [result] = await conn.execute(
      `INSERT INTO Personas (nombre, aPaterno, aMaterno, curp, fechaNacimiento, sexo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, aPaterno, aMaterno, curp, fechaNacimiento, sexo]
    );
    const personaId = result.insertId;

    await conn.execute(
      `INSERT INTO Direccion (personaId, calle, numero, colonia, municipio, estado, cp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [personaId, calle, numero, colonia, municipio, estado, cp]
    );

    await conn.execute(
      `INSERT INTO INE (personaId, claveElector, anioRegistro, vigencia)
       VALUES (?, ?, ?, ?)`,
      [personaId, claveElector, anioRegistro, vigencia]
    );

    await conn.commit();
    res.status(201).json({ message: 'Datos insertados correctamente' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Error al insertar los datos', details: err.message });
  } finally {
    conn.release();
  }
};


exports.buscarPorCurp = async (req, res) => {
  const { curp } = req.params;
  try {
    const [rows] = await db.query(
      `
      SELECT 
        P.id as persona_id,
        P.nombre,
        P.aPaterno as apellido_paterno,
        P.aMaterno as apellido_materno,
        P.curp,
        P.fechaNacimiento as fecha_nacimiento,
        P.sexo,
        D.calle,
        D.numero,
        D.colonia,
        D.municipio,
        D.estado,
        D.cp,
        I.claveElector as clave_elector,
        I.anioRegistro as anio_registro,
        I.vigencia
      FROM Personas P
      LEFT JOIN Direccion D ON P.id = D.personaId
      LEFT JOIN INE I ON P.id = I.personaId
      WHERE P.curp = ?
      `,
      [curp]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'No encontrado' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarPorCurp = async (req, res) => {
  const { curp } = req.params;
  try {
    const [result] = await db.query(`DELETE FROM Personas WHERE curp = ?`, [curp]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(`DELETE FROM Personas WHERE id = ?`, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerTodos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        P.id as persona_id,
        P.nombre,
        P.aPaterno as apellido_paterno,
        P.aMaterno as apellido_materno,
        P.curp,
        P.fechaNacimiento as fecha_nacimiento,
        P.sexo,
        D.calle,
        D.numero,
        D.colonia,
        D.municipio,
        D.estado,
        D.cp,
        I.claveElector as clave_elector,
        I.anioRegistro as anio_registro,
        I.vigencia
      FROM Personas P
      LEFT JOIN Direccion D ON P.id = D.personaId
      LEFT JOIN INE I ON P.id = I.personaId
      `
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
