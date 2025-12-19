const { fetchKunna } = require('../utils/fetchData');
const AcquireData = require('../models/acquireData');

async function acquireData(req, res) {
    try {
        
        const now = new Date();
        const targetDate = new Date();
        targetDate.setHours(0, 0, 0, 0);

        if (now.getHours() >= 23) {
            targetDate.setDate(targetDate.getDate() + 1);
        }

        const timeEnd = new Date(targetDate);
        timeEnd.setDate(timeEnd.getDate() - 1);
        timeEnd.setHours(23, 59, 59, 999);

        const timeStart = new Date(timeEnd);
        timeStart.setDate(timeStart.getDate() - 3);
        timeStart.setHours(0, 0, 0, 0);

        const result = await fetchKunna(timeStart, timeEnd);

        if (!result.values || result.values.length < 3) {
            throw new Error("KUNNA_INSUFFICIENT_DATA");
        }

        // Buscar el índice de la columna 'value' (valor)
        let columns = result.columns;
        if (typeof columns === 'string') {
            columns = JSON.parse(columns);
        }
        
        const VAL_INDEX = columns.indexOf('value');
        
        if (VAL_INDEX === -1) {
            console.error("Columnas disponibles:", columns);
            throw new Error("No se encontró la columna 'value' en los datos de Kunna");
        }


        // Parsear los valores si vienen como strings
        const parseRow = (row, index) => {
            if (typeof row === 'string') {
                try {
                    row = JSON.parse(row);
                } catch (e) {
                    console.error(`Error parseando fila ${index}:`, row);
                    throw new Error("Los datos de Kunna vienen en formato incorrecto");
                }
            }
            return row;
        };

        const row0 = parseRow(result.values[0], 0);
        const row1 = parseRow(result.values[1], 1);
        const row2 = parseRow(result.values[2], 2);

        const consumo_t   = Number(row0[VAL_INDEX]);   
        const consumo_t_1 = Number(row1[VAL_INDEX]); 
        const consumo_t_2 = Number(row2[VAL_INDEX]);
        
        
        // Validar que los valores son números válidos
        if (isNaN(consumo_t) || isNaN(consumo_t_1) || isNaN(consumo_t_2)) {
            console.error("ERROR: Valores extraídos no son números:", { consumo_t, consumo_t_1, consumo_t_2 });
            throw new Error("Los valores de consumo no son números válidos");
        } 

        const features = [
            consumo_t,
            consumo_t_1,
            consumo_t_2,
            Number(targetDate.getHours()),
            Number(targetDate.getDay()),
            Number(targetDate.getMonth() + 1),
            Number(targetDate.getDate())
        ];


        const newRecord = new AcquireData({
            features: features, // Aquí Mongoose ya no debería fallar
            scalerVersion: "v1",
            rawSource: "kunna",
            createdAt: new Date()
        });
        
        await newRecord.save();

        res.status(201).json({
            dataId: newRecord._id,
            features: newRecord.features,
            featureCount: newRecord.features.length,
            scalerVersion: newRecord.scalerVersion,
            createdAt: newRecord.createdAt.toISOString()
        });
    
    } catch (err) {
        console.error("[ACQUIRE ERROR]:", err.message);
        res.status(500).json({
            error: "Internal Server Error",
            message: err.message
        });
    }
}

module.exports = { acquireData };